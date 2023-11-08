import { Queue } from 'bullmq';
import { getRedisConfig } from '../common/db/redis';
import { defaultJobOptions } from './queue.config';

export const generateQueue = (name: string) => {
  const queue = new Queue(name, {
    connection: getRedisConfig(),
    defaultJobOptions,
  });
  return queue;
};
