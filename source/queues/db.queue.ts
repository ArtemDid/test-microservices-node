import { generateQueue } from './default.queue';

let _queue = null;

export const getDBQueue = () => {
  if (!_queue) {
    _queue = generateQueue('db');
  }
  return _queue;
};
