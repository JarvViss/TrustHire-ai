import { Request, Response, NextFunction } from "express";

const DANGEROUS_KEYS = /^\$|__|[.*]/;

function sanitize(target: any): void {
  if (!target || typeof target !== "object") return;

  for (const key of Object.keys(target)) {
    if (DANGEROUS_KEYS.test(key)) {
      delete target[key];
    } else if (typeof target[key] === "object") {
      sanitize(target[key]);
    }
  }
}

export function mongoSanitize(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
}
