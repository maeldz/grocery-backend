import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const rateLimiter = new RateLimiterRedis({
  redis: redisClient,
  points: 100, // 100 requests
  duration: 60 * 1, // per 1 minute by IP
  blockDuration: 60 * 15, // block per 15 min
});

export default async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (err) {
    res.status(429).send('Too Many Requests');
  }
};
