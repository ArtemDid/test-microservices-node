import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { getRedisConfig, urlsRedisClient } from '../../common/db/redis';
import { getLogger } from '../../common/logging';
import { processDomain } from '../../jobs/urls-job/urls-job.controller';
import { getDomainsQueue } from '../../queues/domains.queue';
import { urlsRepository } from '../../common/repositories/urls.repository';
import { parse } from 'tldts';

export const buildWorker = async (): Promise<void> => {
  const domainsQueue = getDomainsQueue();
  const log = getLogger();

  const queueSize = await domainsQueue.getJobCounts();
  log.info({ queueSize });

  const domainsQueueWorker = new Worker(
    'domains',
    async (job: Job) => {
      const { id, tablename, domain = '123' } = job.data;

      // await urlsRepository.createTableWithURLs(tablename);

      await processDomain(job);

      // await urlsRepository.putStatusDomain({ status: 'active', updated_at: new Date().toISOString() }, id);
      log.info(`Crawling ${domain} domain [started] id: ${id}`);

      return { tablename, domain };
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
