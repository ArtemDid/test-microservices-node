import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { parse } from 'tldts';
import { urlsRedisClient } from '../../common/db/redis';
import { getLogger } from '../../common/logging';
import { getDomainsQueue } from '../../queues/domains.queue';

export const processDomain = async (job: Job) => {
  const { domain, id: domainId } = job.data;
  const { domainWithoutSuffix, hostname } = parse(domain);
  const q = getDomainsQueue();
  const log = getLogger();
  const redis = urlsRedisClient();

  await redis.set(domainId, JSON.stringify(job.data));

  // q.add(domain, { url: domain, domain, domainWithoutSuffix, hostname, domainId }); a simple “sleep” job that waits for some time

  const logsInternalURLId = setInterval(async () => {
    const queueSize = await q.getJobCounts();

    log.info(
      { queueSize, domain },
      'active = ',
      queueSize.active,
      'delayed = ',
      queueSize.delayed,
      'waiting = ',
      queueSize.waiting,
      ` Crawling ${domain} ${domainId} domain [in progress] ` + 'Count of existing domains:' + domainWithoutSuffix
    );

    if (queueSize.active === 0 && queueSize.waiting === 0 && queueSize.delayed === 0) {
      await q.drain();
      await redis.set(domainId, JSON.stringify({ ...job.data, status: 'success' }));
      log.info({ queueSize, domain, domainId }, `Crawling ${domain} ${domainId} domain [finished]`);
      clearInterval(logsInternalURLId);
    }
  }, 5000);
};
