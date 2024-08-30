import { Redis } from '@upstash/redis';

const REDIS_URL = `https://${process.env.UPSTASH_REDIS_REST_URL}`;
const REDIS_API_KEY = `${process.env.UPSTASH_REDIS_REST_TOKEN}`;

const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_API_KEY,
});

export default redis;
