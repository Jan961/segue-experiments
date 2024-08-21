import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: `https://${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}`,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
