import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { parse } from 'tldts';
import { urlsRedisClient } from '../../common/db/redis';
import { urlsRepository } from '../../common/repositories/urls.repository';
import { getLogger } from '../../common/logging';
import { destroyCrawlingQueue, getCrawlingQueue } from '../../queues/crawling.queue';
import { getDomainsQueue } from '../../queues/domains.queue';
import axios from 'axios';
import { distribute, parseHref, parseHTML } from './urls-job.service';
import { getDBQueue } from '../../queues/db.queue';
import { IUrlsDb } from './urls-job.types';

let arrWithUrl: Array<IUrlsDb> = [];
const _crawlingDomains = {};

export const processDomain = async (job: Job) => {
  const { domain, id: domainId } = job.data;
  const { domainWithoutSuffix, hostname } = parse(domain);
  // const q = getCrawlingQueue('url');
  // const qDB = getDBQueue();
  const q = getDomainsQueue();
  const log = getLogger();
  const redis = urlsRedisClient();

  await redis.set(domainId, JSON.stringify({ domain }));
  // _crawlingDomains[domain] = domain;

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
      ` Crawling ${domain} ${domainId} domain [in progress] ` + arrWithUrl.length,
      'Count of existing domains:' + domainWithoutSuffix
    );

    if (queueSize.active === 0 && queueSize.waiting === 0 && queueSize.delayed === 0) {
      await q.drain();
      // await urlsRepository.putStatusDomain(
      //   { status: 'finished', updated_at: new Date().toISOString(), last_crawled: new Date().toISOString() },
      //   domainId
      // );
      destroyCrawlingQueue(domain);

      await redis.del(domainId);
      // if (arrWithUrl.length) {
      //   for (const iterator in _crawlingDomains) {
      //     const arrToDb: Array<IUrlsDb> = distribute(arrWithUrl, _crawlingDomains[iterator]);
      //     if (arrToDb.length) await qDB.add(domain, { domain: _crawlingDomains[iterator], arrDB: arrToDb });
      //   }
      //   arrWithUrl.length = 0;
      // }

      // delete _crawlingDomains[domain];
      log.info({ queueSize, domain, domainId }, `Crawling ${domain} ${domainId} domain [finished]`);
      clearInterval(logsInternalURLId);
    }
  }, 5000);
};
