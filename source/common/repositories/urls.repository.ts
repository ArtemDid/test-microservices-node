import { urlsRedisClient } from '../db/redis';

type DataUrlsType = {
  url: string;
  domain_id: number;
  is_has_asin: number;
};

const isExistsUrl = async (parsedUrl: string, category: string) => {
  return urlsRedisClient().zrank(category, encodeURI(parsedUrl));
};

export const urlsRepository = {
  isExistsUrl,
};
