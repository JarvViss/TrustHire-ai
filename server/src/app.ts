import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import "./config/env";

import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { generalRateLimit } from "./middleware/rateLimiter";
import { mongoSanitize } from "./middleware/mongoSanitize";

const app = express();

/* ---------- Global Middlewares ---------- */

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "");

if (clientUrl) {
  allowedOrigins.push(clientUrl);
}

const isProduction = process.env.NODE_ENV === "production";

const isLocalhostOrigin = (origin: string): boolean => {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    if (!isProduction && isLocalhostOrigin(origin)) {
      return cb(null, true);
    }

    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize);

app.use(cookieParser());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(morgan("dev"));

app.use(generalRateLimit);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ---------- Health Check ---------- */

app.get("/", (req, res) => {
  res.json({
    message: "TrustHire AI API Running 🚀",
  });
});

/* ---------- API Routes ---------- */

app.use("/api", routes);

/* ---------- Error Handler ---------- */

app.use(errorHandler);

export default app;
