import { Router } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export const medsRouter = Router();

// Validarea datelor primite
const MedCreateSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  startDate: z.string(),                 // "2025-08-21" sau ISO
  endDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  reminderTime: z.string().optional().nullable() // "HH:mm"
});
const MedUpdateSchema = MedCreateSchema.partial();

function toDate(s?: string | null) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// LIST (toate ale user-ului)
medsRouter.get("/", async (req, res) => {
  const userId = (req as any).userId as number;
  const meds = await prisma.medication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  res.json(meds);
});

// READ ONE
medsRouter.get("/:id", async (req, res) => {
  const userId = (req as any).userId as number;
  const id = Number(req.params.id);
  const med = await prisma.medication.findFirst({ where: { id, userId } });
  if (!med) return res.status(404).json({ error: "Not found" });
  res.json(med);
});

// ADD
medsRouter.post("/", async (req, res) => {
  const userId = (req as any).userId as number;
  const parsed = MedCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { name, dosage, frequency, startDate, endDate, notes, reminderTime } = parsed.data;

  const created = await prisma.medication.create({
    data: {
      userId,
      name,
      dosage,
      frequency,
      startDate: new Date(startDate),
      endDate: toDate(endDate) ?? undefined,
      notes: notes ?? undefined,
      reminderTime: reminderTime ?? undefined
    }
  });

  res.status(201).json(created);
});

// EDIT
medsRouter.put("/:id", async (req, res) => {
  const userId = (req as any).userId as number;
  const id = Number(req.params.id);

  const exists = await prisma.medication.findFirst({ where: { id, userId } });
  if (!exists) return res.status(404).json({ error: "Not found" });

  const parsed = MedUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const data: any = { ...parsed.data };
  if ("startDate" in data) data.startDate = toDate(data.startDate) ?? undefined;
  if ("endDate" in data) data.endDate = toDate(data.endDate);

  const updated = await prisma.medication.update({ where: { id }, data });
  res.json(updated);
});

// DELETE
medsRouter.delete("/:id", async (req, res) => {
  const userId = (req as any).userId as number;
  const id = Number(req.params.id);

  const exists = await prisma.medication.findFirst({ where: { id, userId } });
  if (!exists) return res.status(404).json({ error: "Not found" });

  await prisma.medication.delete({ where: { id } });
  res.status(204).send();
});
