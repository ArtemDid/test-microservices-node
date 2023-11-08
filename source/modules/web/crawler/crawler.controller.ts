import { ExpressRequest, ExpressResponse } from '../../../common/types';
import { parse } from 'tldts';
// import { getDomainsQueue } from '../../../queues/domains.queue';
import { urlsRepository } from '../../../common/repositories/urls.repository';
import { IDomainDB } from '../../../common/db/interfaces/domain.interface';
import { v4 as uuidv4 } from 'uuid';
import { urlsRedisClient } from '../../../common/db/redis';
import { getLogger } from '../../../common/logging';
import { getDomainsQueue } from '../../../queues/domains.queue';

const asyncOperations = [];
const redis = urlsRedisClient();
const log = getLogger();

const asyncOperation = async (req: ExpressRequest, res: ExpressResponse) => {
  const id = uuidv4();
  const operation = {
    id,
    data: req.body,
    status: 'processing',
  };

  // asyncOperations.push(operation);
  const q = getDomainsQueue();

  const queueSize = await q.getJobCounts();
  // if (queueSize.waiting > 2) {
  //   return res.json({ result: 'Too many' });
  // }

  for (let index = 0; index < 10000; index++) {
    await q.add('url', {
      domain: 'https://',
      id,
    });
  }

  res.json({ id });
};

const syncOperation = async (req: ExpressRequest, res: ExpressResponse) => {
  const data = req.body;
  const q = getDomainsQueue();
  const id = uuidv4();
  const queueSize = await q.getJobCounts();
  if (queueSize.waiting > 2) {
    return res.json({ result: 'Too many' });
  }

  await q.add('url', {
    domain: 'https://',
    id,
  });

  try {
    const result = await waitForOperationCompletion(id);
    log.info('The operation is completed with the result ', result);
    res.json({ result });
  } catch (error) {
    log.error('Error waiting for operation:', error);
    res.status(400).json('Error');
  }
};

async function waitForOperationCompletion(operationId, timeout = 30000, interval = 500) {
  return new Promise(async (resolve, reject) => {
    const checkOperation = async () => {
      const operationResult = await redis.get(operationId);
      console.log(111111111111111111111111111, operationResult);

      if (!operationResult) {
        resolve(JSON.parse(operationResult));
      } else if (timeout <= 0) {
        reject(new Error('The operation timed out'));
      } else {
        log.info('In progress');
        // await redis.set(`sync-operation-result:${operationId}`, JSON.stringify({ result: true })); //
        timeout -= interval;
        setTimeout(checkOperation, interval);
      }
    };

    setTimeout(checkOperation, interval);
  });
}

const getStatusById = async (req: ExpressRequest, res: ExpressResponse) => {
  const id = req.params.id;

  // const asyncOperation = asyncOperations.find(op => op.id === id);

  // if (asyncOperation) {
  //   res.json(asyncOperation);
  //   return;
  // }

  const operationData = await redis.get(id);
  if (operationData) {
    const operation = JSON.parse(operationData);
    res.json({ status: 'inProgress' });
    return;
  }

  res.status(404).json({ message: 'Not Found' });
};

const deleteDb = async (req: ExpressRequest, res: ExpressResponse) => {
  // const id = req.params.id;

  // const asyncOperation = asyncOperations.find(op => op.id === id);

  // if (asyncOperation) {
  //   res.json(asyncOperation);
  //   return;
  // }

  // const operationData = await redis.get(id);
  // if (operationData) {
  //   const operation = JSON.parse(operationData);
  //   res.json({ status: 'inProgress' });
  //   return;
  // }
  const q = getDomainsQueue();

  await q.obliterate();

  await redis.flushall();

  res.status(200).json({ message: 'Deleted' });
};

export const CrawlerController = {
  asyncOperation,
  getStatusById,
  syncOperation,
  deleteDb,
};
