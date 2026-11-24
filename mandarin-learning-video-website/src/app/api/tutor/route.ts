import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureLearner, normalizeLearnerKey } from "@/db/learners";
import { tutorMessages } from "@/db/schema";
import { buildAiReply } from "@/lib/tutor";
import type { ChatMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

function parseTips(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.map(String).slice(0, 4);
  } catch {
    return null;
  }
  return null;
}

function toMessage(row: typeof tutorMessages.$inferSelect): ChatMessage {
  return {
    id: row.id,
    role: row.role === "assistant" ? "assistant" : "user",
    content: row.content,
    pinyin: row.pinyin,
    translation: row.translation,
    tips: parseTips(row.tips),
    createdAt: row.createdAt.toISOString(),
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
    const rows = await db
      .select()
      .from(tutorMessages)
      .where(eq(tutorMessages.learnerId, learner.id))
      .orderBy(asc(tutorMessages.id));
    return Response.json({ messages: rows.slice(-60).map(toMessage) });
  } catch {
    return Response.json({ error: "Could not load your conversation." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { learnerKey?: string; message?: string };
    const learnerKey = normalizeLearnerKey(body.learnerKey);
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 600) : "";

    if (!learnerKey) {
      return Response.json({ error: "A learner key is required." }, { status: 400 });
    }
    if (!message) {
      return Response.json({ error: "Say or type something first." }, { status: 400 });
    }

    const learner = await ensureLearner(learnerKey);
    const existing = await db
      .select()
      .from(tutorMessages)
      .where(eq(tutorMessages.learnerId, learner.id))
      .orderBy(asc(tutorMessages.id));

    const turn = existing.filter((row) => row.role === "user").length + 1;
    const history = existing.slice(-10).map((row) => ({ role: row.role, content: row.content }));

    const reply = await buildAiReply(message, turn, history);

    const inserted = await db
      .insert(tutorMessages)
      .values([
        { learnerId: learner.id, role: "user", content: message, tips: null },
        {
          learnerId: learner.id,
          role: "assistant",
          content: reply.zh,
          pinyin: reply.pinyin,
          translation: reply.en,
          tips: JSON.stringify(reply.tips),
        },
      ])
      .returning();

    const messages = existing.slice(-58).map(toMessage).concat(inserted.map(toMessage));

    return Response.json({ reply, turn, messages });
   } catch (error) {
    console.error("TUTOR API ERROR:", error);

    return Response.json(
      { error: "Your tutor could not answer just now. Try again." },
      { status: 500 },
    );
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
    await db.delete(tutorMessages).where(eq(tutorMessages.learnerId, learner.id));
    return Response.json({ messages: [] });
  } catch {
    return Response.json({ error: "Could not clear your conversation." }, { status: 500 });
  }
}
