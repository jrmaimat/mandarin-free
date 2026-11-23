import Image from "next/image";
import Link from "next/link";
import { LessonBoard } from "@/components/LessonBoard";
import { SpeakButton } from "@/components/SpeakButton";
import { CURRICULUM, TOTAL_LESSON_MINUTES } from "@/data/curriculum";
import { BASICS_SECTIONS, CHINA_ESSENTIALS } from "@/data/basics";
import { VIDEO_COUNT } from "@/data/videos";
import { REVIEW_DECK_SIZE } from "@/data/review";

const PHRASE_COUNT = BASICS_SECTIONS.reduce((sum, section) => sum + section.phrases.length, 0);

const LANES = [
  {
    href: "/basics",
    hanzi: "基",
    title: "China basics",
    copy: `${PHRASE_COUNT} everyday phrases, pinyin chart and the practical stuff — payments, trains, etiquette.`,
    cta: "Open the phrasebook",
  },
  {
    href: "/videos",
    hanzi: "看",
    title: "Video library",
    copy: `${VIDEO_COUNT} curated video lessons, from pinyin drills to street food, hotpot etiquette and HSK prep.`,
    cta: "Browse videos",
  },
  {
    href: "/tutor",
    hanzi: "说",
    title: "AI speaking partner",
    copy: "Speak Mandarin into your mic. Xiaomin answers in Chinese, corrects you kindly and keeps the chat going.",
    cta: "Start talking",
  },
  {
    href: "/review",
    hanzi: "复",
    title: "Review studio",
    copy: `Spaced recall on ${REVIEW_DECK_SIZE} words and phrases, plus quick quizzes with saved accuracy.`,
    cta: "Train your memory",
  },
];

const TONE_CARDS = [
  { mark: "mā", tone: "1st", word: "妈", en: "mother", hint: "high & flat" },
  { mark: "má", tone: "2nd", word: "麻", en: "numb", hint: "rising" },
  { mark: "mǎ", tone: "3rd", word: "马", en: "horse", hint: "dip, then rise" },
  { mark: "mà", tone: "4th", word: "骂", en: "scold", hint: "sharp fall" },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-16">
          <div className="rise">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-vermilion">
              <span className="hanzi text-base tracking-normal">中文</span>
              Learn Mandarin from zero
            </p>
            <h1 className="display mt-4 text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[0.98] tracking-tight text-ink">
              Mandarin,
              <br />
              made <span className="text-vermilion italic">human.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base">
              Tones you can actually hear. A phrasebook built for real life in China. Eighty-four
              video lessons. And a patient AI partner who will let you practise your Mandarin out
              loud — no judgement, always in Chinese and English.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#lesson-list"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-vermilion"
              >
                Start with lesson 1
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" aria-hidden>
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <Link
                href="/tutor"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-card px-6 py-3 text-sm font-semibold text-ink transition hover:border-vermilion hover:text-vermilion"
              >
                <span className="h-2 w-2 rounded-full bg-jade" />
                Talk to Xiaomin
              </Link>
            </div>

            <dl className="mt-9 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-4">
              {[
                { value: String(CURRICULUM.length), label: "lessons" },
                { value: `${PHRASE_COUNT}+`, label: "basics" },
                { value: `${VIDEO_COUNT}`, label: "videos" },
                { value: `${REVIEW_DECK_SIZE}`, label: "review cards" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="display text-2xl font-semibold text-ink">{stat.value}</dt>
                  <dd className="text-[11px] uppercase tracking-[0.16em] text-ink-soft/70">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-paper-deep shadow-[0_30px_70px_-40px_rgba(25,22,18,0.6)]">
              <Image
                src="/images/hero.jpg"
                alt="A Chinese study desk with calligraphy brush, tea and a red lantern"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent p-5 pt-16 text-paper">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-paper/70">
                  Lesson 1 · the four tones
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="hanzi text-4xl leading-none">妈 麻 马 骂</p>
                  <p className="text-right text-xs leading-relaxed text-paper/85">
                    Same sound,
                    <br />
                    four meanings.
                  </p>
                </div>
              </div>
            </div>
            <div className="paper-panel absolute -left-3 top-6 max-w-[190px] rounded-2xl p-3.5 sm:-left-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-vermilion">
                Today&apos;s phrase
              </p>
              <p className="hanzi mt-1 text-xl text-ink">慢慢来</p>
              <p className="text-[11px] text-jade">màn màn lái</p>
              <p className="mt-0.5 text-[11px] text-ink-soft">take your time — no rush</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <h2 className="display text-2xl font-semibold text-ink">First, the tones. Tap and listen.</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Chinese is a melody. The same syllable in four different pitches means four
                different things. Press each tile to hear it, then repeat out loud.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-4">
              {TONE_CARDS.map((tone) => (
                <div key={tone.mark} className="rounded-2xl border border-line bg-paper p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
                    {tone.tone} · {tone.hint}
                  </p>
                  <p className="hanzi mt-1 text-3xl text-ink">{tone.word}</p>
                  <p className="text-xs text-vermilion">{tone.mark}</p>
                  <p className="text-[11px] text-ink-soft">{tone.en}</p>
                  <div className="mt-2 flex justify-center">
                    <SpeakButton text={`${tone.word} ${tone.mark}`} size="sm" label={`Hear ${tone.mark}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANES.map((lane) => (
            <Link
              key={lane.href}
              href={lane.href}
              className="group paper-panel flex flex-col justify-between rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-vermilion/50"
            >
              <div>
                <span className="hanzi grid h-10 w-10 place-items-center rounded-lg bg-paper-deep text-lg text-vermilion">
                  {lane.hanzi}
                </span>
                <h3 className="display mt-4 text-lg font-semibold text-ink">{lane.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{lane.copy}</p>
              </div>
              <p className="mt-4 text-xs font-semibold text-vermilion group-hover:underline">
                {lane.cta} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-vermilion">
                课程 · The course
              </p>
              <h2 className="display mt-2 text-3xl font-semibold text-ink sm:text-4xl">
                Twelve lessons, one clear path
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                {Math.round(TOTAL_LESSON_MINUTES / 60)}+ hours of guided study from your first tone to
                a full conversation about family, food, work and festivals.
              </p>
            </div>
            <p className="hanzi text-sm text-ink-soft/70">一步一步，学中文</p>
          </div>

          <div className="mt-8">
            <LessonBoard lessons={CURRICULUM} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-line">
            <Image
              src="/images/culture.jpg"
              alt="A Beijing hutong alley with red lanterns at golden hour"
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <p className="hanzi absolute bottom-4 left-4 text-2xl text-paper">胡同 · hútòng</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-vermilion">
              生活 · Life in China
            </p>
            <h2 className="display mt-2 text-3xl font-semibold text-ink">
              The basics nobody teaches you
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              How to pay with a QR code. Which apps you need. What not to gift. Why your taxi driver
              calls you 朋友. Everything practical, in one place.
            </p>
            <div className="mt-6 space-y-3">
              {CHINA_ESSENTIALS.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-xl border border-line bg-card p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="text-base" aria-hidden>
                      {item.icon}
                    </span>
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/basics"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-vermilion px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-vermilion-deep"
            >
              Explore all the China basics
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              You did the reading
            </p>
            <h2 className="display mt-2 text-3xl font-semibold">
              Now say it out loud to Xiaomin.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/70">
              Press the microphone, speak your Mandarin, and hear a patient reply in Chinese. She
              recognises your phrases, nudges your tones and keeps the conversation moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tutor"
              className="rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold"
            >
              Open the AI partner
            </Link>
            <Link
              href="/videos"
              className="rounded-full border border-paper/30 px-6 py-3 text-sm font-semibold text-paper transition hover:border-gold hover:text-gold"
            >
              Watch {VIDEO_COUNT} videos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
