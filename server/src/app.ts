import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { generalRateLimit } from "./middleware/rateLimiter";
import { mongoSanitize } from "./middleware/mongoSanitize";

const app = express();

/* ---------- Global Middlewares ---------- */

app.use(cors({
  origin: (origin, cb) => {
    cb(null, origin?.replace(/\/$/, "") || true);
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
