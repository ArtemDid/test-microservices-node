import Redis, { RedisOptions } from 'ioredis';

let __client: Redis;

export const getRedisConfig = () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10) || 6432,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  password: process.env.REDIS_PASS || undefined,
  db: parseInt(process.env.REDIS_DB, 10) || 1,
});

export function urlsRedisClient(): Redis {
  if (!__client) {
    const options: RedisOptions = getRedisConfig();

    __client = new Redis({
      ...options,
    });
  }
  return __client;
}
