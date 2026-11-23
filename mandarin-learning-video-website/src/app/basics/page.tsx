import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { BasicsExplorer } from "@/components/BasicsExplorer";
import { SpeakButton } from "@/components/SpeakButton";
import {
  BASIC_SCENARIOS,
  BASICS_SECTIONS,
  CHINA_ESSENTIALS,
  NUMBER_ROWS,
  PINYIN_FINALS,
  PINYIN_INITIALS,
  TONES,
  TONE_RULES,
} from "@/data/basics";

export const metadata: Metadata = {
  title: "China Basics · Mandarin Compass",
  description:
    "160+ everyday Mandarin phrases, a pinyin chart, tone rules, survival scripts and the practical basics of life in China: payments, apps, trains, etiquette and emergencies.",
};

const PHRASE_COUNT = BASICS_SECTIONS.reduce((sum, section) => sum + section.phrases.length, 0);

export default function BasicsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Everyday Mandarin · survival kit"
        hanzi="基础"
        title={
          <>
            Everything you need for
            <br className="hidden sm:block" /> your first weeks in China
          </>
        }
        description={`${PHRASE_COUNT} phrases across 16 situations, a full pinyin and tone reference, six ready-made scripts and the practical China knowledge no textbook gives you. Tap any speaker to hear a native pronunciation.`}
        aside={
          <div className="paper-panel rounded-2xl p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-vermilion">
              Five words that save you
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                { zh: "你好", pinyin: "nǐ hǎo", en: "hello" },
                { zh: "谢谢", pinyin: "xièxie", en: "thank you" },
                { zh: "多少钱？", pinyin: "duōshao qián?", en: "how much?" },
                { zh: "请问", pinyin: "qǐngwèn", en: "excuse me…" },
                { zh: "听不懂", pinyin: "tīng bu dǒng", en: "I don't understand" },
              ].map((item) => (
                <li key={item.zh} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline gap-2">
                      <span className="hanzi text-base text-ink">{item.zh}</span>
                      <span className="text-[11px] text-vermilion">{item.pinyin}</span>
                    </p>
                    <p className="text-[11px] text-ink-soft">{item.en}</p>
                  </div>
                  <SpeakButton text={item.zh} size="sm" />
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-ink-soft">
              Read pinyin with tone marks and you are already understood. The marks are the language.
            </p>
          </div>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <BasicsExplorer sections={BASICS_SECTIONS} />
      </section>

      <section className="border-y border-line bg-paper-deep/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-vermilion">
                情景 · Scripts
              </p>
              <h2 className="display mt-2 text-3xl font-semibold text-ink">Six situations, solved</h2>
            </div>
            <p className="text-xs text-ink-soft">Open each card and practise the four lines out loud.</p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {BASIC_SCENARIOS.map((scenario) => (
              <details key={scenario.id} className="paper-panel group rounded-2xl p-4 open:border-vermilion/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className="hanzi grid h-9 w-9 place-items-center rounded-lg bg-paper-deep text-sm text-vermilion">
                      {scenario.hanzi}
                    </span>
                    <span className="text-sm font-semibold text-ink">{scenario.title}</span>
                  </span>
                  <span className="text-xs text-ink-soft/60 transition group-open:rotate-45" aria-hidden>
                    ＋
                  </span>
                </summary>
                <div className="mt-3 space-y-2 border-t border-line pt-3">
                  {scenario.lines.map((line) => (
                    <div key={line.zh} className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="hanzi text-[15px] text-ink">{line.zh}</p>
                        <p className="text-[11px] text-vermilion">{line.pinyin}</p>
                        <p className="text-[11px] text-ink-soft">{line.en}</p>
                      </div>
                      <SpeakButton text={line.zh} size="sm" />
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-vermilion">
              拼音 · Pinyin reference
            </p>
            <h2 className="display mt-2 text-3xl font-semibold text-ink">Read anything on this site</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Pinyin spells Mandarin with English letters. Initials start a syllable, finals finish
              it, and a tone mark rides on top. Master these and every phrase here is readable.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="paper-panel rounded-2xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                  Initials · 声母
                </p>
                <ul className="mt-2 space-y-1.5">
                  {PINYIN_INITIALS.map(([letter, hint]) => (
                    <li key={letter} className="flex gap-2 text-xs">
                      <span className="w-7 shrink-0 font-semibold text-vermilion">{letter}</span>
                      <span className="text-ink-soft">{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="paper-panel rounded-2xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                  Finals · 韵母
                </p>
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {PINYIN_FINALS.map(([letters, hint]) => (
                    <li key={letters} className="text-xs">
                      <span className="font-semibold text-vermilion">{letters}</span>
                      <span className="block text-[11px] text-ink-soft">{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="paper-panel rounded-2xl p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                The five tones · 声调
              </p>
              <div className="mt-3 space-y-2">
                {TONES.map((tone) => (
                  <div key={tone.mark} className="flex items-center gap-3 rounded-xl border border-line bg-paper p-2.5">
                    <span className="hanzi grid h-10 w-10 place-items-center rounded-lg bg-vermilion/10 text-lg font-semibold text-vermilion">
                      {tone.mark}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink">{tone.name}</p>
                      <p className="text-[11px] text-ink-soft">{tone.hint}</p>
                      <p className="text-[11px] text-jade">{tone.example}</p>
                    </div>
                    <SpeakButton text={tone.mark} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-jade/25 bg-jade-soft/50 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-jade">
                Four rules that fix most mistakes
              </p>
              <ul className="mt-3 space-y-3">
                {TONE_RULES.map((rule) => (
                  <li key={rule.title}>
                    <p className="text-xs font-semibold text-ink">{rule.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-ink-soft">{rule.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-vermilion">
                数字 · Numbers
              </p>
              <h2 className="display mt-2 text-2xl font-semibold text-ink">Count, pay, read a platform</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Chinese numbers are perfectly logical: learn 0–10, then stack. Ten + one = eleven.
                Two + ten = twenty. Prices are quoted in 块 in speech.
              </p>
              <div className="mt-4 rounded-xl border border-line bg-paper p-3 text-xs text-ink-soft">
                <span className="font-semibold text-ink">Money shortcut:</span> 25块5毛 = ¥25.50 ·
                一百块 = ¥100 · 扫码 = scan to pay
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {NUMBER_ROWS.map(([label, pinyin]) => (
                <div key={label} className="rounded-xl border border-line bg-paper px-2.5 py-2 text-center">
                  <p className="hanzi text-lg text-ink">{label}</p>
                  <p className="text-[11px] text-vermilion">{pinyin}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-vermilion">
              中国生活 · Practical China
            </p>
            <h2 className="display mt-2 text-3xl font-semibold text-ink">
              Things actually used in China
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
              Not grammar — the daily mechanics. Set these up and life gets dramatically easier.
            </p>
          </div>
          <div className="relative hidden h-28 w-44 shrink-0 overflow-hidden rounded-2xl border border-line sm:block">
            <Image
              src="/images/basics.jpg"
              alt="A Chinese market stall with fresh produce and price cards"
              fill
              sizes="176px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {CHINA_ESSENTIALS.map((item) => (
            <article key={item.id} className="paper-panel flex flex-col rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xl" aria-hidden>
                  {item.icon}
                </span>
                <span className="hanzi rounded-md bg-paper-deep px-2 py-0.5 text-xs text-ink-soft">
                  {item.hanzi}
                </span>
              </div>
              <h3 className="display mt-3 text-base font-semibold leading-snug text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">{item.body}</p>
              <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                {item.items.map((line) => (
                  <li key={line} className="flex gap-2 text-[11px] leading-relaxed text-ink-soft">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-jade" />
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="paper-panel mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-ink p-6 text-paper sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Ready to say it?
            </p>
            <p className="display mt-1.5 text-xl font-semibold">
              Take any phrase to the AI partner and speak it back.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/tutor" className="rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold">
              Practise speaking
            </Link>
            <Link
              href="/review"
              className="rounded-full border border-paper/30 px-5 py-2.5 text-sm font-semibold text-paper hover:border-gold hover:text-gold"
            >
              Review the phrases
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
