import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());
app.use("/api/users",userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TrustHire AI API Running 🚀",
  });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;