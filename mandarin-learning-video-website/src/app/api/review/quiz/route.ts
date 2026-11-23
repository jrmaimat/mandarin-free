import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureLearner, normalizeLearnerKey } from "@/db/learners";
import { quizAttempts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      learnerKey?: string;
      correct?: number;
      total?: number;
      mode?: string;
    };
    const learnerKey = normalizeLearnerKey(body.learnerKey);
    const correct = Number(body.correct);
    const total = Number(body.total);

    if (!learnerKey || !Number.isFinite(correct) || !Number.isFinite(total) || total < 1) {
      return Response.json({ error: "learnerKey, correct and total are required." }, { status: 400 });
    }
    if (correct < 0 || correct > total || total > 100) {
      return Response.json({ error: "Score is out of range." }, { status: 400 });
    }

    const learner = await ensureLearner(learnerKey);
    await db.insert(quizAttempts).values({
      learnerId: learner.id,
      correct: Math.round(correct),
      total: Math.round(total),
      mode: typeof body.mode === "string" ? body.mode.slice(0, 32) : "mixed",
    });

    const attempts = await db
      .select({ correct: quizAttempts.correct, total: quizAttempts.total })
      .from(quizAttempts)
      .where(eq(quizAttempts.learnerId, learner.id));

    const totals = attempts.reduce((sum, row) => sum + row.total, 0);
    const corrects = attempts.reduce((sum, row) => sum + row.correct, 0);
    const best = attempts.reduce(
      (max, row) => Math.max(max, Math.round((row.correct / row.total) * 100)),
      0,
    );

    return Response.json({
      correct: Math.round(correct),
      total: Math.round(total),
      attempts: attempts.length,
      best,
      average: totals > 0 ? Math.round((corrects / totals) * 100) : null,
    });
  } catch {
    return Response.json({ error: "Could not save your quiz." }, { status: 500 });
  }
}
