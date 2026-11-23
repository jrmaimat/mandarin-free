import { db } from "@/db";
import { learners } from "@/db/schema";

export function normalizeLearnerKey(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const key = raw.trim().slice(0, 96);
  if (key.length < 4) return null;
  return key;
}

export async function ensureLearner(learnerKey: string) {
  const [row] = await db
    .insert(learners)
    .values({ learnerKey })
    .onConflictDoUpdate({
      target: learners.learnerKey,
      set: { learnerKey },
    })
    .returning();
  return row;
}
