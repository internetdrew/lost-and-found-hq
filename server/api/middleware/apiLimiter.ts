import rateLimit from 'express-rate-limit';

const apiLimiterMinutes = 15;

export const standardApiLimiter = rateLimit({
  windowMs: 60 * 1000 * apiLimiterMinutes,
  max: 100,
  message: `Too many requests from this IP, please try again after ${apiLimiterMinutes} minutes.`,
});

export const sensitiveRouteLimiter = rateLimit({
  windowMs: 60 * 1000 * apiLimiterMinutes,
  max: 5,
  message: `Too many requests from this IP, please try again after ${apiLimiterMinutes} minutes.`,
});
