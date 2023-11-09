import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { getRedisConfig } from '../../common/db/redis';
import { getLogger } from '../../common/logging';
import { processDomain } from '../../jobs/urls-job/urls-job.controller';
import { getDomainsQueue } from '../../queues/domains.queue';

export const buildWorker = async (): Promise<void> => {
  const domainsQueue = getDomainsQueue();
  const log = getLogger();

  const queueSize = await domainsQueue.getJobCounts();
  log.info({ queueSize });

  const domainsQueueWorker = new Worker(
    'domains',
    async (job: Job) => {
      const { id, domain } = job.data;

      await processDomain(job);

      log.info(`Crawling ${domain} domain [started] id: ${id}`);

      return { id, domain };
    },
    {
      concurrency: 10,
      connection: getRedisConfig(),
      limiter: {
        max: 10,
        duration: 1000,
        // groupKey: 'domainId',
      },
    }
  );

  domainsQueueWorker.on('failed', (job: Job, err) => {
    console.log(`${job.id} ${job.data.domain} has failed with ${err.message}`);
  });
};
