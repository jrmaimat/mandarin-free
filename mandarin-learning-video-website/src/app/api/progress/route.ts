import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureLearner, normalizeLearnerKey } from "@/db/learners";
import { lessonProgress, quizAttempts } from "@/db/schema";
import { CURRICULUM } from "@/data/curriculum";

export const dynamic = "force-dynamic";

async function loadProgress(learnerId: number) {
  const rows = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.learnerId, learnerId));
  const attempts = await db
    .select({ id: quizAttempts.id })
    .from(quizAttempts)
    .where(eq(quizAttempts.learnerId, learnerId));

  const completed = rows.filter((row) => row.status === "complete").map((row) => row.lessonSlug);
  const inProgress = rows
    .filter((row) => row.status === "in_progress")
    .map((row) => row.lessonSlug);

  return {
    completed,
    inProgress,
    totalLessons: CURRICULUM.length,
    wordsSeen: completed.length * 6,
    quizzes: attempts.length,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const learnerKey = normalizeLearnerKey(url.searchParams.get("learnerKey"));
  if (!learnerKey) {
    return Response.json({ error: "A learner key is required." }, { status: 400 });
  }
  try {
    const learner = await ensureLearner(learnerKey);
    const payload = await loadProgress(learner.id);
    return Response.json(payload);
  } catch {
    return Response.json({ error: "Could not load progress." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      learnerKey?: string;
      lessonSlug?: string;
      status?: "complete" | "in_progress" | "none";
    };
    const learnerKey = normalizeLearnerKey(body.learnerKey);
    const lessonSlug = typeof body.lessonSlug === "string" ? body.lessonSlug.trim() : "";
    const status = body.status;

    if (!learnerKey || !lessonSlug || !status) {
      return Response.json({ error: "learnerKey, lessonSlug and status are required." }, { status: 400 });
    }
    if (!CURRICULUM.some((lesson) => lesson.slug === lessonSlug)) {
      return Response.json({ error: "Unknown lesson." }, { status: 404 });
    }

    const learner = await ensureLearner(learnerKey);

    if (status === "none") {
      await db
        .delete(lessonProgress)
        .where(
          and(
            eq(lessonProgress.learnerId, learner.id),
            eq(lessonProgress.lessonSlug, lessonSlug),
          ),
        );
    } else {
      await db
        .insert(lessonProgress)
        .values({ learnerId: learner.id, lessonSlug, status })
        .onConflictDoUpdate({
          target: [lessonProgress.learnerId, lessonProgress.lessonSlug],
          set: { status, updatedAt: new Date() },
        });
    }

    const payload = await loadProgress(learner.id);
    return Response.json(payload);
  } catch {
    return Response.json({ error: "Could not save progress." }, { status: 500 });
  }
}
