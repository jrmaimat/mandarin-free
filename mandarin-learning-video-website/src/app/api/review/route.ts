import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { ensureLearner, normalizeLearnerKey } from "@/db/learners";
import { quizAttempts, reviewCards } from "@/db/schema";
import { REVIEW_DECK } from "@/data/review";
import type { ReviewCardView, ReviewResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

function schedule(rating: "again" | "good" | "easy", box: number) {
  if (rating === "again") return { box: 1, due: new Date(Date.now() + 8 * MINUTE) };
  if (rating === "good") {
    const next = Math.min(box + 1, 5);
    return { box: next, due: new Date(Date.now() + next * DAY) };
  }
  const next = Math.min(box + 2, 6);
  return { box: next, due: new Date(Date.now() + next * 3 * DAY) };
}

function toView(row: typeof reviewCards.$inferSelect): ReviewCardView | null {
  const item = REVIEW_DECK.find((entry) => entry.id === row.itemId);
  if (!item) return null;
  return {
    itemId: row.itemId,
    box: row.box,
    dueAt: row.dueAt.toISOString(),
    correctCount: row.correctCount,
    lapses: row.lapses,
    zh: item.zh,
    pinyin: item.pinyin,
    en: item.en,
    category: item.category,
    note: item.note,
  };
}

async function ensureDeck(learnerId: number) {
  const existing = await db
    .select({ itemId: reviewCards.itemId })
    .from(reviewCards)
    .where(eq(reviewCards.learnerId, learnerId));
  const existingIds = new Set(existing.map((row) => row.itemId));
  const missing = REVIEW_DECK.filter((item) => !existingIds.has(item.id));
  if (missing.length === 0) return;

  const chunkSize = 80;
  for (let index = 0; index < missing.length; index += chunkSize) {
    const chunk = missing.slice(index, index + chunkSize).map((item) => ({
      learnerId,
      itemId: item.id,
    }));
    await db.insert(reviewCards).values(chunk).onConflictDoNothing();
  }
}

async function loadReview(learnerId: number): Promise<ReviewResponse> {
  const rows = await db
    .select()
    .from(reviewCards)
    .where(eq(reviewCards.learnerId, learnerId))
    .orderBy(asc(reviewCards.dueAt));

  const views = rows.map(toView).filter((view): view is ReviewCardView => view !== null);
  const now = Date.now();
  const due = views.filter((card) => new Date(card.dueAt).getTime() <= now);
  const upcoming = views.filter((card) => new Date(card.dueAt).getTime() > now).slice(0, 12);

  const attempts = await db
    .select({ correct: quizAttempts.correct, total: quizAttempts.total })
    .from(quizAttempts)
    .where(eq(quizAttempts.learnerId, learnerId));

  const totalAnswers = attempts.reduce((sum, entry) => sum + entry.total, 0);
  const correctAnswers = attempts.reduce((sum, entry) => sum + entry.correct, 0);

  return {
    due: due.slice(0, 40),
    upcoming,
    stats: {
      total: views.length,
      due: due.length,
      learned: views.filter((card) => card.correctCount > 0).length,
      mastered: views.filter((card) => card.box >= 4).length,
      attempts: attempts.length,
      accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : null,
      streak: views
        .filter((card) => card.correctCount > 0)
        .reduce((max, card) => Math.max(max, card.box), 0),
    },
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
    await ensureDeck(learner.id);
    const payload = await loadReview(learner.id);
    return Response.json(payload);
  } catch {
    return Response.json({ error: "Could not load review cards." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      learnerKey?: string;
      itemId?: string;
      rating?: "again" | "good" | "easy";
    };
    const learnerKey = normalizeLearnerKey(body.learnerKey);
    if (!learnerKey || !body.itemId || !body.rating) {
      return Response.json({ error: "learnerKey, itemId and rating are required." }, { status: 400 });
    }
    if (!REVIEW_DECK.some((item) => item.id === body.itemId)) {
      return Response.json({ error: "Unknown review card." }, { status: 404 });
    }
    const rating = body.rating;
    if (!["again", "good", "easy"].includes(rating)) {
      return Response.json({ error: "Invalid rating." }, { status: 400 });
    }

    const learner = await ensureLearner(learnerKey);
    await ensureDeck(learner.id);

    const [existing] = await db
      .select()
      .from(reviewCards)
      .where(and(eq(reviewCards.learnerId, learner.id), eq(reviewCards.itemId, body.itemId)))
      .limit(1);

    const next = schedule(rating, existing?.box ?? 1);

    await db
      .insert(reviewCards)
      .values({
        learnerId: learner.id,
        itemId: body.itemId,
        box: next.box,
        dueAt: next.due,
        correctCount: rating === "again" ? 0 : 1,
        lapses: rating === "again" ? 1 : 0,
        lastReviewedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [reviewCards.learnerId, reviewCards.itemId],
        set: {
          box: next.box,
          dueAt: next.due,
          correctCount:
            rating === "again" ? (existing?.correctCount ?? 0) : (existing?.correctCount ?? 0) + 1,
          lapses: rating === "again" ? (existing?.lapses ?? 0) + 1 : (existing?.lapses ?? 0),
          lastReviewedAt: new Date(),
        },
      });

    const payload = await loadReview(learner.id);
    return Response.json(payload);
  } catch {
    return Response.json({ error: "Could not save your review." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const learnerKey = normalizeLearnerKey(url.searchParams.get("learnerKey"));
  if (!learnerKey) {
    return Response.json({ error: "A learner key is required." }, { status: 400 });
  }
  try {
    const learner = await ensureLearner(learnerKey);
    const ids = REVIEW_DECK.map((item) => item.id);
    await db
      .delete(reviewCards)
      .where(and(eq(reviewCards.learnerId, learner.id), inArray(reviewCards.itemId, ids)));
    await ensureDeck(learner.id);
    const payload = await loadReview(learner.id);
    return Response.json(payload);
  } catch {
    return Response.json({ error: "Could not reset your deck." }, { status: 500 });
  }
}
