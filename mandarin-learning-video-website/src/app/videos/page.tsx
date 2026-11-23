import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { VideoLibrary } from "@/components/VideoLibrary";
import {
  FEATURED_PLAYLIST,
  VIDEO_CATEGORIES,
  VIDEO_COUNT,
  VIDEO_LESSONS,
} from "@/data/videos";

export const metadata: Metadata = {
  title: "84 Video Lessons · Mandarin Compass",
  description:
    "A curated library of 84 Mandarin video lessons: pinyin and tones, beginner conversations, HSK 1–4, listening practice, food, travel, culture, grammar and characters.",
};

const STATS = [
  { value: String(VIDEO_COUNT), label: "curated lessons" },
  { value: "12", label: "topic collections" },
  { value: "3", label: "HSK levels" },
  { value: "0", label: "cost, forever" },
];

export default function VideosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Watch · listen · repeat"
        hanzi="视频"
        title={
          <>
            {VIDEO_COUNT} video lessons
            <br className="hidden sm:block" /> for every kind of learner
          </>
        }
        description="Pinyin drills for your first week, real street conversations, hotpot etiquette, HSK preparation and slow listening practice. Filter by topic or level, then keep the Mandarin playing while you do the dishes."
        aside={
          <div className="grid grid-cols-2 gap-2.5">
            {STATS.map((stat) => (
              <div key={stat.label} className="paper-panel rounded-xl px-4 py-3">
                <p className="display text-2xl font-semibold text-vermilion">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">{stat.label}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <VideoLibrary
          lessons={VIDEO_LESSONS}
          categories={VIDEO_CATEGORIES}
          playlist={FEATURED_PLAYLIST}
        />

        <div className="mt-12 grid gap-3 rounded-2xl border border-line bg-card/70 p-5 sm:grid-cols-3">
          {[
            {
              title: "Watch with intent",
              body: "Pick one lesson, watch it twice, and note five new phrases with tone marks. Two focused videos beat ten passive ones.",
            },
            {
              title: "Shadow, don't just listen",
              body: "Pause after each sentence and copy the speaker's melody out loud. Your mouth learns faster than your eyes.",
            },
            {
              title: "Then come and speak",
              body: "Bring those five phrases to the AI partner. Using a phrase in a real reply is what makes it stick.",
            },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-vermilion">{item.title}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-ink p-6 text-paper sm:flex-row sm:items-center">
          <div>
            <p className="display text-lg font-semibold">Watched something good? Say it back.</p>
            <p className="mt-1 text-xs text-paper/70">
              The AI speaking partner is one tab away — microphone, replies and corrections included.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/tutor" className="rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold">
              Speak Mandarin
            </Link>
            <Link
              href="/basics"
              className="rounded-full border border-paper/30 px-5 py-2.5 text-sm font-semibold text-paper hover:border-gold hover:text-gold"
            >
              Phrasebook
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
