import { generateQueue } from './default.queue';

const _crawlingQueues = {};

export const getCrawlingQueue = (name: string) => {
  if (!_crawlingQueues[name]) _crawlingQueues[name] = generateQueue(name);
  return _crawlingQueues[name];
};

export const destroyCrawlingQueue = (name: string) => {
  if (!_crawlingQueues[name]) return;

  // _crawlingQueues[name].empty();

  delete _crawlingQueues[name];
};
