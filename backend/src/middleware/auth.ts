import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface JWTPayload {
  userId: number;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev";

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const token = auth.slice("Bearer ".length);
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    (req as any).userId = payload.userId;
    (req as any).userEmail = payload.email;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
