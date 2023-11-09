import { ExpressRequest, ExpressResponse } from '../../../common/types';
import { IOperation } from '../../../common/db/interfaces/domain.interface';
import { v4 as uuidv4 } from 'uuid';
import { urlsRedisClient } from '../../../common/db/redis';
import { getLogger } from '../../../common/logging';
import { getDomainsQueue } from '../../../queues/domains.queue';

const redis = urlsRedisClient();
const log = getLogger();

const asyncOperation = async (req: ExpressRequest, res: ExpressResponse) => {
  const q = getDomainsQueue();

  const queueSize = await q.getJobCounts();
  if (queueSize.waiting > 2) {
    return res.json({ result: 'Too many jobs' });
  }
  const id = uuidv4();
  const operation: IOperation = {
    domain: req.query.domain as string,
    id,
    status: 'processing',
  };

  await q.add('url', operation);

  res.status(200).json(operation);
};

const syncOperation = async (req: ExpressRequest, res: ExpressResponse) => {
  const q = getDomainsQueue();
  const queueSize = await q.getJobCounts();
  if (queueSize.waiting > 100) {
    return res.json({ result: 'Too many jobs' });
  }
  const id = uuidv4();
  console.log(req.query.domain);

  const operation: IOperation = {
    domain: req.params.domain,
    id,
    status: 'processing',
  };

  await q.add('url', operation);

  try {
    const result = await waitForOperationCompletion(id);
    log.info('The operation is completed with the result ', result);
    res.status(200).json({ result });
  } catch (error) {
    log.error('Error waiting for operation:', error);
    res.status(400).json('Error');
  }
};

async function waitForOperationCompletion(operationId, timeout = 30000, interval = 500) {
  return new Promise(async (resolve, reject) => {
    const checkOperation = async () => {
      const operationResult = await redis.get(operationId);

      if (JSON.parse(operationResult).status === 'success') {
        resolve(JSON.parse(operationResult));
      } else if (timeout <= 0) {
        reject(new Error('The operation timed out'));
      } else {
        log.info('In progress ', operationResult);
        timeout -= interval;
        setTimeout(checkOperation, interval);
      }
    };

    setTimeout(checkOperation, interval);
  });
}

const getStatusById = async (req: ExpressRequest, res: ExpressResponse) => {
  const id = req.params.id;

  const operationData = await redis.get(id);
  if (operationData) {
    const operation: IOperation = JSON.parse(operationData);
    return res.status(200).json(operation);
  }

  res.status(404).json({ message: 'Not Found' });
};

const terminateQueue = async (req: ExpressRequest, res: ExpressResponse) => {
  const q = getDomainsQueue();

  await q.obliterate();

  await redis.flushall();

  res.status(200).json({ message: 'Deleted' });
};

const clearQueue = async (req: ExpressRequest, res: ExpressResponse) => {
  const q = getDomainsQueue();

  await q.clean(0, 'completed');

  res.status(200).json({ message: 'Deleted' });
};

export const CrawlerController = {
  asyncOperation,
  getStatusById,
  syncOperation,
  terminateQueue,
  clearQueue,
};
