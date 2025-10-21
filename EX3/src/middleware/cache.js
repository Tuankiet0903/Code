// src/middleware/cache.js
import redis from "../services/redisClient.js";
import logger from "../utils/logger.js";

const cacheMiddleware =
  (keyFn, ttl = 60) =>
  async (req, res, next) => {
    const key = keyFn(req);
    try {
      const cached = await redis.get(key);
      if (cached) {
        res.setHeader("x-cache", "HIT");
        return res.json(JSON.parse(cached));
      }
    } catch (e) {
      logger.warn("Redis error in cache middleware", e);
    }
    // wrap res.json to set cache on response
    const originalJson = res.json.bind(res);
    res.json = async (data) => {
      try {
        await redis.set(key, JSON.stringify(data), "EX", ttl);
        res.setHeader("x-cache", "MISS");
      } catch (e) {
        logger.warn("Redis set error", e);
      }
      return originalJson(data);
    };
    next();
  };

export default cacheMiddleware;
