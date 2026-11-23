"use client";

import { useEffect, useMemo, useState } from "react";
import type { VideoCategory, VideoLesson } from "@/data/videos";

const CATEGORY_STYLE: Record<VideoCategory, { tile: string; ring: string }> = {
  "Pinyin & Tones": { tile: "from-[#7a2c22] via-[#a53b2c] to-[#d9793f]", ring: "text-[#f6d8bd]" },
  "Beginner Foundations": { tile: "from-[#1f4a3e] via-[#2c6a58] to-[#69a488]", ring: "text-[#d6ecdf]" },
  "Everyday Conversation": { tile: "from-[#2b3b52] via-[#3c5877] to-[#7d9dbb]", ring: "text-[#dbe7f3]" },
  "HSK 1–2": { tile: "from-[#4b3a1c] via-[#8a641f] to-[#c9a052]", ring: "text-[#f6e8c4]" },
  "HSK 3–4": { tile: "from-[#3f2740] via-[#6b3b62] to-[#a87397]", ring: "text-[#f0dcf0]" },
  "Listening Practice": { tile: "from-[#173c46] via-[#25626f] to-[#66a3ac]", ring: "text-[#d7edf0]" },
  "Food & Travel": { tile: "from-[#6d2a1f] via-[#a7442c] to-[#d98a4d]", ring: "text-[#fbe3cb]" },
  "Culture & Life": { tile: "from-[#4d2a35] via-[#7c3f4a] to-[#c27a70]", ring: "text-[#f7ddd8]" },
  "Grammar Clinic": { tile: "from-[#263a2b] via-[#3f6446] to-[#7ea581]", ring: "text-[#dff0e1]" },
  "Characters & Reading": { tile: "from-[#2c2b3f] via-[#454468] to-[#8b89b5]", ring: "text-[#e4e3f5]" },
  "Work & Business": { tile: "from-[#33363a] via-[#4f555c] to-[#8b939c]", ring: "text-[#e6eaee]" },
  "Songs & Fun": { tile: "from-[#5d2f16] via-[#9a4f22] to-[#dda25e]", ring: "text-[#fbe6cd]" },
};

const LEVELS = ["All levels", "Absolute beginner", "Beginner", "Elementary", "Intermediate"] as const;

export function VideoLibrary({
  lessons,
  categories,
  playlist,
}: {
  lessons: VideoLesson[];
  categories: VideoCategory[];
  playlist: { id: string; title: string; description: string };
}) {
  const [category, setCategory] = useState<"all" | VideoCategory>("all");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All levels");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(12);
  const [selected, setSelected] = useState<VideoLesson | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const categoryOk = category === "all" || lesson.category === category;
      const levelOk = level === "All levels" || lesson.level === level;
      const queryOk =
        !term ||
        lesson.title.toLowerCase().includes(term) ||
        lesson.channel.toLowerCase().includes(term) ||
        lesson.category.toLowerCase().includes(term) ||
        lesson.focus.toLowerCase().includes(term);
      return categoryOk && levelOk && queryOk;
    });
  }, [lessons, category, level, query]);

  useEffect(() => {
    setVisible(12);
  }, [category, level, query]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div>
      <div className="paper-panel overflow-hidden rounded-2xl">
        <div className="grid gap-0 lg:grid-cols-[1.5fr_1fr]">
          <div className="relative aspect-video w-full bg-ink">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlist.id}&rel=0`}
              title={playlist.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-between gap-4 border-t border-line p-5 lg:border-l lg:border-t-0">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-vermilion">
                <span className="h-1.5 w-1.5 rounded-full bg-vermilion" />
                Featured course playlist
              </p>
              <h2 className="display mt-2 text-xl font-semibold text-ink">{playlist.title}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{playlist.description}</p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft/70">
                How this library works
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">
                The playlist above plays inside the page. Every card below opens the exact YouTube
                lesson search for that topic — {lessons.length} curated lessons, all free.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="paper-panel sticky top-[76px] z-30 mt-6 rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-paper px-3">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-soft/60" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${lessons.length} lessons — 'hotpot', 'tones', 'HSK 2', 'taxi'…`}
                aria-label="Search video lessons"
                className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/50"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full px-2 text-xs font-semibold text-ink-soft hover:text-vermilion"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as (typeof LEVELS)[number])}
              aria-label="Filter by level"
              className="rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink-soft outline-none"
            >
              {LEVELS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="tab-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={[
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                category === "all"
                  ? "bg-ink text-paper"
                  : "border border-line bg-card text-ink-soft hover:border-ink hover:text-ink",
              ].join(" ")}
            >
              All {lessons.length} videos
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={[
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  category === item
                    ? "bg-vermilion text-paper"
                    : "border border-line bg-card text-ink-soft hover:border-ink hover:text-ink",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-ink-soft/70">
          {filtered.length} lesson{filtered.length === 1 ? "" : "s"} found
          {category !== "all" ? ` in ${category}` : ""}
        </p>
        <button
          type="button"
          onClick={() => {
            setCategory("all");
            setLevel("All levels");
            setQuery("");
          }}
          className="text-xs font-semibold text-vermilion hover:underline"
        >
          Reset filters
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-card/70 p-10 text-center">
          <p className="hanzi text-3xl text-ink-soft/40">没有</p>
          <p className="mt-2 text-sm text-ink-soft">No videos match that filter. Try another topic.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((lesson) => {
              const style = CATEGORY_STYLE[lesson.category];
              return (
                <article
                  key={lesson.id}
                  className="group paper-panel flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:border-vermilion/40"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(lesson)}
                    className={`relative flex aspect-video w-full items-center justify-between overflow-hidden bg-gradient-to-br ${style.tile} p-4 text-left`}
                    aria-label={`Open ${lesson.title}`}
                  >
                    <span className="hanzi text-5xl leading-none text-white/25">{lesson.hanzi}</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/30 transition group-hover:scale-105 group-hover:bg-white/25">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
                        <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                      </svg>
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      {lesson.minutes} min
                    </span>
                    <span className="absolute left-4 top-3 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90">
                      #{String(lesson.number).padStart(2, "0")}
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      <span className="rounded-full bg-paper-deep px-2 py-0.5 text-ink-soft">{lesson.level}</span>
                      <span className="text-ink-soft/60">{lesson.category}</span>
                    </div>
                    <h3 className="display mt-2 text-[15px] font-semibold leading-snug text-ink">
                      {lesson.title}
                    </h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{lesson.focus}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <p className="truncate text-[11px] text-ink-soft/70">{lesson.channel} · YouTube</p>
                      <button
                        type="button"
                        onClick={() => setSelected(lesson)}
                        className="shrink-0 text-xs font-semibold text-vermilion hover:underline"
                      >
                        Open →
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {visible < filtered.length ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((count) => count + 12)}
                className="rounded-full border border-line bg-card px-6 py-3 text-sm font-semibold text-ink transition hover:border-vermilion hover:text-vermilion"
              >
                Show 12 more · {filtered.length - visible} remaining
              </button>
            </div>
          ) : (
            <p className="hanzi mt-6 text-center text-sm text-ink-soft/60">
              全部看完了 · you&apos;ve seen all {filtered.length} lessons
            </p>
          )}
        </>
      )}

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <div
            className="rise w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`relative bg-gradient-to-br ${CATEGORY_STYLE[selected.category].tile} p-6`}>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white hover:bg-black/50"
                aria-label="Close"
              >
                ✕
              </button>
              <span className="hanzi text-6xl leading-none text-white/30">{selected.hanzi}</span>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Lesson {String(selected.number).padStart(2, "0")} · {selected.category}
              </p>
              <h3 className="display mt-1 text-2xl font-semibold leading-tight text-white">
                {selected.title}
              </h3>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="rounded-full bg-paper-deep px-2.5 py-1 text-ink-soft">{selected.level}</span>
                <span className="rounded-full bg-paper-deep px-2.5 py-1 text-ink-soft">{selected.minutes} min</span>
                <span className="rounded-full bg-paper-deep px-2.5 py-1 text-ink-soft">{selected.channel}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{selected.focus}</p>
              <div className="mt-4 rounded-xl border border-line bg-paper p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft/70">
                  While you watch
                </p>
                <ul className="mt-1.5 space-y-1 text-[12px] text-ink-soft">
                  <li>· Write down every phrase with a tone mark.</li>
                  <li>· Pause at each example and say it out loud twice.</li>
                  <li>· Afterwards, bring the phrase to the AI partner and use it in a sentence.</li>
                </ul>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href={selected.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full bg-vermilion px-4 py-2.5 text-center text-sm font-semibold text-paper transition hover:bg-vermilion-deep"
                >
                  Watch this lesson on YouTube
                </a>
                <a
                  href="/tutor"
                  className="rounded-full border border-line bg-paper px-4 py-2.5 text-center text-sm font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  Practise it
                </a>
              </div>
              <p className="mt-2 text-center text-[10px] text-ink-soft/60">
                Opens the YouTube search for “{selected.searchQuery}”
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
