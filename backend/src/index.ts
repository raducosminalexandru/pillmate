import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { medsRouter } from "./routes/medications";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"], // frontend Next
  credentials: true
}));
app.use(express.json());

// Temporar: simulăm user-ul logat
app.use((req, _res, next) => {
  (req as any).userId = 1;
  next();
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/medications", medsRouter);

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
