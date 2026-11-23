"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { callApi, getLearnerKey } from "@/lib/client";
import type { Lesson } from "@/data/curriculum";
import type { ProgressResponse } from "@/lib/types";

const LEVEL_STYLES: Record<Lesson["level"], string> = {
  Foundation: "bg-jade-soft text-jade",
  Beginner: "bg-gold/15 text-[#8a641f]",
  Elementary: "bg-vermilion/10 text-vermilion",
  "Pre-intermediate": "bg-ink/8 text-ink-soft",
};

export function LessonBoard({ lessons }: { lessons: Lesson[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [inProgress, setInProgress] = useState<string[]>([]);
  const [quizzes, setQuizzes] = useState(0);
  const [open, setOpen] = useState<string | null>(lessons[0]?.slug ?? null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const key = getLearnerKey();
    callApi<ProgressResponse>(`/api/progress?learnerKey=${encodeURIComponent(key)}`)
      .then((data) => {
        if (cancelled) return;
        setCompleted(data.completed);
        setInProgress(data.inProgress);
        setQuizzes(data.quizzes);
      })
      .catch(() => {
        if (!cancelled) setError("Progress will save once the database is reachable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(
    async (slug: string, status: "complete" | "in_progress" | "none") => {
      setBusy(slug);
      setError(null);
      try {
        const data = await callApi<ProgressResponse>("/api/progress", {
          method: "POST",
          body: JSON.stringify({ learnerKey: getLearnerKey(), lessonSlug: slug, status }),
        });
        setCompleted(data.completed);
        setInProgress(data.inProgress);
      } catch {
        setError("Could not save progress. Check your connection and try again.");
      } finally {
        setBusy(null);
      }
    },
    [],
  );

  const units = useMemo(() => {
    const grouped = new Map<string, Lesson[]>();
    for (const lesson of lessons) {
      const list = grouped.get(lesson.unit) ?? [];
      list.push(lesson);
      grouped.set(lesson.unit, list);
    }
    return Array.from(grouped.entries());
  }, [lessons]);

  const percent = Math.round((completed.length / lessons.length) * 100);
  const nextLesson =
    lessons.find((lesson) => !completed.includes(lesson.slug)) ?? lessons[0];

  return (
    <div>
      <div className="paper-panel sticky top-[76px] z-30 mb-8 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative grid h-14 w-14 shrink-0 place-items-center">
              <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="var(--color-line)" strokeWidth="3" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="var(--color-vermilion)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(percent / 100) * 113} 113`}
                />
              </svg>
              <span className="hanzi text-xs font-semibold text-ink">{percent}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                {loading ? "Loading your progress…" : `${completed.length} of ${lessons.length} lessons complete`}
              </p>
              <p className="text-xs text-ink-soft">
                {inProgress.length} in progress · {quizzes} quizzes taken · progress saved to PostgreSQL
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#lesson-list"
              className="rounded-full border border-line bg-card px-4 py-2 text-xs font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
            >
              Jump to lessons
            </a>
            <Link
              href="/review"
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper transition hover:bg-vermilion"
            >
              Review these words
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper-deep">
          <div
            className="h-full rounded-full bg-vermilion transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {error ? (
        <p className="mb-5 rounded-xl border border-vermilion/30 bg-vermilion/5 px-4 py-3 text-sm text-vermilion">
          {error}
        </p>
      ) : null}

      <div id="lesson-list" className="space-y-10">
        {units.map(([unit, unitLessons]) => (
          <section key={unit}>
            <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft/80">
                {unit}
              </h2>
              <span className="text-[11px] text-ink-soft/70">
                {unitLessons.filter((lesson) => completed.includes(lesson.slug)).length}/
                {unitLessons.length} done
              </span>
            </div>

            <div className="space-y-3">
              {unitLessons.map((lesson) => {
                const isOpen = open === lesson.slug;
                const isDone = completed.includes(lesson.slug);
                const isStarted = inProgress.includes(lesson.slug);
                return (
                  <article
                    key={lesson.slug}
                    className={[
                      "paper-panel overflow-hidden rounded-2xl transition",
                      isDone ? "border-jade/40" : "",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : lesson.slug)}
                        aria-expanded={isOpen}
                        className="flex flex-1 items-start gap-4 text-left"
                      >
                        <span
                          className={[
                            "hanzi grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-semibold",
                            isDone
                              ? "bg-jade text-paper"
                              : isStarted
                                ? "bg-vermilion text-paper"
                                : "bg-paper-deep text-ink-soft",
                          ].join(" ")}
                          aria-hidden
                        >
                          {isDone ? "✓" : lesson.hanzi}
                        </span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft/70">
                            Lesson {String(lesson.number).padStart(2, "0")}
                            <span className={`rounded-full px-2 py-0.5 tracking-[0.08em] ${LEVEL_STYLES[lesson.level]}`}>
                              {lesson.level}
                            </span>
                            <span>{lesson.minutes} min</span>
                          </span>
                          <span className="display mt-1 block truncate text-lg font-semibold text-ink">
                            {lesson.title}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-ink-soft">
                            {lesson.subtitle}
                          </span>
                        </span>
                      </button>

                      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          disabled={busy === lesson.slug}
                          onClick={() => update(lesson.slug, isDone ? "none" : "complete")}
                          className={[
                            "rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50",
                            isDone
                              ? "border border-jade/40 bg-jade-soft text-jade hover:bg-jade/10"
                              : "bg-ink text-paper hover:bg-vermilion",
                          ].join(" ")}
                        >
                          {busy === lesson.slug ? "Saving…" : isDone ? "Completed ✓" : "Mark done"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : lesson.slug)}
                          aria-label={isOpen ? "Collapse lesson" : "Open lesson"}
                          className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-soft transition hover:text-ink"
                        >
                          <svg viewBox="0 0 24 24" className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} fill="none" aria-hidden>
                            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {isOpen ? (
                      <div className="border-t border-line bg-paper/40 p-4 sm:p-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                          <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                              You will be able to
                            </h3>
                            <ul className="mt-3 space-y-2">
                              {lesson.objectives.map((objective) => (
                                <li key={objective} className="flex gap-2 text-sm text-ink-soft">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-vermilion" />
                                  {objective}
                                </li>
                              ))}
                            </ul>

                            <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                              Dialogue
                            </h3>
                            <div className="mt-3 space-y-2.5">
                              {lesson.dialogue.map((line, index) => (
                                <div
                                  key={`${lesson.slug}-line-${index}`}
                                  className="rounded-xl border border-line bg-card p-3"
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-jade">
                                        {line.who}
                                      </p>
                                      <p className="hanzi mt-1 text-lg leading-snug text-ink">{line.zh}</p>
                                      <p className="mt-0.5 text-xs text-vermilion">{line.pinyin}</p>
                                      <p className="mt-0.5 text-xs text-ink-soft">{line.en}</p>
                                    </div>
                                    <SpeakButton text={line.zh} size="sm" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                              Core vocabulary
                            </h3>
                            <div className="mt-3 divide-y divide-line rounded-xl border border-line bg-card">
                              {lesson.vocab.map((word) => (
                                <div key={word.id} className="flex items-center gap-3 p-3">
                                  <div className="min-w-0 flex-1">
                                    <p className="flex flex-wrap items-baseline gap-2">
                                      <span className="hanzi text-lg text-ink">{word.zh}</span>
                                      <span className="text-xs text-vermilion">{word.pinyin}</span>
                                    </p>
                                    <p className="text-xs text-ink-soft">{word.en}</p>
                                  </div>
                                  <SpeakButton text={word.zh} size="sm" />
                                </div>
                              ))}
                            </div>

                            <div className="mt-5 rounded-xl border border-jade/25 bg-jade-soft/60 p-4">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-jade">
                                Grammar · {lesson.grammar.title}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                                {lesson.grammar.body}
                              </p>
                              <div className="mt-3 space-y-2">
                                {lesson.grammar.examples.map((example) => (
                                  <div key={example.zh} className="rounded-lg bg-card/80 p-2.5">
                                    <p className="hanzi text-sm text-ink">{example.zh}</p>
                                    <p className="text-[11px] text-vermilion">{example.pinyin}</p>
                                    <p className="text-[11px] text-ink-soft">{example.en}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-vermilion/25 bg-vermilion/5 p-4">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-vermilion">
                                Speak it out loud
                              </p>
                              <p className="mt-2 text-sm text-ink-soft">{lesson.practice.prompt}</p>
                              <div className="mt-2 flex items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="hanzi text-base text-ink">{lesson.practice.model}</p>
                                  <p className="text-[11px] text-vermilion">{lesson.practice.pinyin}</p>
                                  <p className="text-[11px] text-ink-soft">{lesson.practice.en}</p>
                                </div>
                                <SpeakButton text={lesson.practice.model} size="sm" />
                              </div>
                              <Link
                                href="/tutor"
                                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-vermilion hover:underline"
                              >
                                Say it to the AI partner →
                              </Link>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-line bg-card p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                            China note · {lesson.culture.title}
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{lesson.culture.body}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={busy === lesson.slug}
                            onClick={() => update(lesson.slug, isDone ? "in_progress" : "complete")}
                            className="rounded-full bg-vermilion px-4 py-2 text-xs font-semibold text-paper transition hover:bg-vermilion-deep disabled:opacity-50"
                          >
                            {isDone ? "Move back to in progress" : "I finished this lesson"}
                          </button>
                          <button
                            type="button"
                            disabled={busy === lesson.slug}
                            onClick={() => update(lesson.slug, "in_progress")}
                            className="rounded-full border border-line bg-card px-4 py-2 text-xs font-semibold text-ink-soft transition hover:border-ink hover:text-ink disabled:opacity-50"
                          >
                            Save for later
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
