import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { medsRouter } from "./routes/medications";
import { authRouter } from "./routes/auth";
import { authRequired } from "./middleware/auth";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);

// de aici încolo rutele necesită token:
app.use("/api/medications", authRequired, medsRouter);

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
