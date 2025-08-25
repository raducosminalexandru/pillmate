import { Router } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authRouter = Router();

const SignUpSchema = z.object({
  name: z.string().min(1).optional().nullable(),
  email: z.string().email(),
  password: z.string().min(6)
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const JWT_SECRET = process.env.JWT_SECRET || "dev";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(user: { id: number; email: string }) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

// POST /api/auth/signup
authRouter.post("/signup", async (req, res) => {
  const parsed = SignUpSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already in use" });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: name ?? null, email, password: hash },
    select: { id: true, email: true, name: true }
  });

  const token = signToken(user);
  res.status(201).json({ user, token });
});

// POST /api/auth/signin
authRouter.post("/signin", async (req, res) => {
  const parsed = SignInSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user.id, email: user.email });
  res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
});

// GET /api/auth/me  (util pt. profil)
authRouter.get("/me", async (req, res) => {
  // optional: folosește authRequired dacă vrei să validezi tokenul
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: number };
    const me = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, createdAt: true }
    });
    if (!me) return res.status(404).json({ error: "Not found" });
    res.json(me);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});
