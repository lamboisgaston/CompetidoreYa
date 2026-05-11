import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./core/middleware/error-handler.js";
import { router } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", router);
app.use(errorHandler);
