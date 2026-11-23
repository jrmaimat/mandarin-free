"use client";

import { useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import type { BasicsSection } from "@/data/basics";

export function BasicsExplorer({ sections }: { sections: BasicsSection[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return sections
      .filter((section) => active === "all" || section.id === active)
      .map((section) => ({
        ...section,
        phrases: section.phrases.filter((phrase) => {
          if (!term) return true;
          return (
            phrase.zh.includes(query.trim()) ||
            phrase.pinyin.toLowerCase().includes(term) ||
            phrase.en.toLowerCase().includes(term) ||
            (phrase.tip ?? "").toLowerCase().includes(term)
          );
        }),
      }))
      .filter((section) => section.phrases.length > 0);
  }, [sections, query, active]);

  const total = filtered.reduce((sum, section) => sum + section.phrases.length, 0);

  return (
    <div>
      <div className="paper-panel sticky top-[76px] z-30 rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-soft/60" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search English, pinyin or 汉字 — try 'cheap', 'piányi' or 厕所"
              aria-label="Search phrases"
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
          <div className="tab-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={[
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                active === "all"
                  ? "bg-ink text-paper"
                  : "border border-line bg-card text-ink-soft hover:border-ink hover:text-ink",
              ].join(" ")}
            >
              All phrases
            </button>
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActive(section.id)}
                className={[
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  active === section.id
                    ? "bg-vermilion text-paper"
                    : "border border-line bg-card text-ink-soft hover:border-ink hover:text-ink",
                ].join(" ")}
              >
                <span className="hanzi mr-1.5">{section.hanzi}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-soft/70">
        Showing {total} phrase{total === 1 ? "" : "s"}
        {query ? ` for “${query}”` : ""} · tap any speaker to hear it
      </p>

      {total === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-card/70 p-10 text-center">
          <p className="hanzi text-3xl text-ink-soft/40">找不到</p>
          <p className="mt-2 text-sm text-ink-soft">
            Nothing matched “{query}”. Try an English word, pinyin without tones, or a character.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-8">
          {filtered.map((section) => (
            <section key={section.id} id={section.id}>
              <div className="mb-3 flex items-start justify-between gap-4 border-b border-line pb-2">
                <div>
                  <h3 className="display flex items-baseline gap-2 text-xl font-semibold text-ink">
                    <span className="hanzi text-base text-vermilion">{section.hanzi}</span>
                    {section.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-soft">{section.blurb}</p>
                </div>
                <span className="shrink-0 text-[11px] text-ink-soft/60">
                  {section.phrases.length} phrase{section.phrases.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-2.5 md:grid-cols-2">
                {section.phrases.map((phrase) => (
                  <div
                    key={phrase.id}
                    className="paper-panel flex items-start gap-3 rounded-xl p-3.5 transition hover:border-vermilion/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="hanzi text-lg leading-snug text-ink">{phrase.zh}</p>
                      <p className="text-xs font-medium text-vermilion">{phrase.pinyin}</p>
                      <p className="mt-0.5 text-[13px] text-ink-soft">{phrase.en}</p>
                      {phrase.tip ? (
                        <p className="mt-1.5 border-t border-line/70 pt-1.5 text-[11px] leading-relaxed text-jade">
                          {phrase.tip}
                        </p>
                      ) : null}
                    </div>
                    <SpeakButton text={phrase.zh} size="sm" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
