import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

const cleanupTimer = setInterval(() => {
  const now = Date.now();

  for (const key of Object.keys(store)) {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  }
}, CLEANUP_INTERVAL_MS);

cleanupTimer.unref?.();

type KeyResolver = (req: Request) => string;

export function rateLimit({
  windowMs = 60 * 1000,
  max = 60,
  message = "Too many requests, please try again later",
  keyFor,
}: {
  windowMs?: number;
  max?: number;
  message?: string;
  keyFor?: KeyResolver;
} = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyFor
      ? keyFor(req)
      : `ip:${req.ip ?? req.socket.remoteAddress ?? "unknown"}`;
    const now = Date.now();

    if (
      !store[key] ||
      now > store[key].resetTime
    ) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    store[key].count++;

    if (store[key].count > max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    next();
  };
}

const aiKeyFor = (req: Request): string => {
  const userId = (req as AuthRequest).userId;

  return userId
    ? `user:${userId}`
    : `ip:${req.ip ?? req.socket.remoteAddress ?? "unknown"}`;
};

export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many AI requests. Please wait a minute.",
  keyFor: aiKeyFor,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many auth attempts. Try again in 15 minutes.",
});

export const generalRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
});
