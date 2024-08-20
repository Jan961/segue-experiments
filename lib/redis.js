import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://more-oriole-60149.upstash.io',
  token: 'Aer1AAIjcDE1Mzg0YmE4NTdlZjc0ZjJmOGFjNTM1YmYzNGJlM2E4N3AxMA',
});

export default redis;
