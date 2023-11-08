import { generateQueue } from './default.queue';

let _queue = null;

export const getDomainsQueue = () => {
  if (!_queue) {
    _queue = generateQueue('domains');
  }
  return _queue;
};
