"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { callApi, getLearnerKey } from "@/lib/client";
import type { ReviewItem } from "@/data/review";
import type { QuizResponse, ReviewCardView, ReviewResponse } from "@/lib/types";

type Mode = "recall" | "quiz";

type QuizQuestion = {
  item: ReviewItem;
  options: string[];
  answer: string;
};

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function buildQuiz(deck: ReviewItem[], size = 8): QuizQuestion[] {
  return shuffle(deck)
    .slice(0, size)
    .map((item) => {
      const distractors = shuffle(deck.filter((entry) => entry.en !== item.en))
        .slice(0, 3)
        .map((entry) => entry.en);
      return { item, options: shuffle([item.en, ...distractors]), answer: item.en };
    });
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="paper-panel rounded-xl px-4 py-3">
      <p className="display text-2xl font-semibold text-ink">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">{label}</p>
      {hint ? <p className="mt-0.5 text-[10px] text-ink-soft/60">{hint}</p> : null}
    </div>
  );
}

export function ReviewStudio({ deck }: { deck: ReviewItem[] }) {
  const [mode, setMode] = useState<Mode>("recall");
  const [data, setData] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [freePractice, setFreePractice] = useState<ReviewItem | null>(null);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResponse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await callApi<ReviewResponse>(
        `/api/review?learnerKey=${encodeURIComponent(getLearnerKey())}`,
      );
      setData(response);
      setError(null);
    } catch {
      setError("Could not load your review deck. Is the database running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const current: ReviewCardView | null = data?.due[0] ?? null;

  const rate = async (rating: "again" | "good" | "easy") => {
    if (!current || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await callApi<ReviewResponse>("/api/review", {
        method: "POST",
        body: JSON.stringify({ learnerKey: getLearnerKey(), itemId: current.itemId, rating }),
      });
      setData(response);
      setRevealed(false);
      setSessionCount((count) => count + 1);
      setFreePractice(null);
    } catch {
      setError("Could not save that review. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const startQuiz = () => {
    setQuestions(buildQuiz(deck));
    setQuizIndex(0);
    setPicked(null);
    setScore(0);
    setQuizDone(false);
    setQuizResult(null);
    setMode("quiz");
  };

  const answer = (option: string) => {
    if (picked) return;
    setPicked(option);
    const isRight = option === questions[quizIndex]?.answer;
    if (isRight) setScore((value) => value + 1);
  };

  const nextQuestion = async () => {
    const isLast = quizIndex + 1 >= questions.length;
    if (!isLast) {
      setQuizIndex((index) => index + 1);
      setPicked(null);
      return;
    }
    setQuizDone(true);
    setQuizSaving(true);
    try {
      const response = await callApi<QuizResponse>("/api/review/quiz", {
        method: "POST",
        body: JSON.stringify({
          learnerKey: getLearnerKey(),
          correct: score,
          total: questions.length,
          mode: "mandarin-recall",
        }),
      });
      setQuizResult(response);
    } catch {
      setError("Quiz finished, but the score could not be saved.");
    } finally {
      setQuizSaving(false);
    }
  };

  const practiceCard: ReviewCardView | null = useMemo(() => {
    if (!freePractice) return null;
    return {
      itemId: freePractice.id,
      box: 1,
      dueAt: new Date().toISOString(),
      correctCount: 0,
      lapses: 0,
      zh: freePractice.zh,
      pinyin: freePractice.pinyin,
      en: freePractice.en,
      category: freePractice.category,
      note: freePractice.note,
    };
  }, [freePractice]);

  const activeCard = current ?? practiceCard;
  const question = questions[quizIndex];
  const accuracy = data?.stats.accuracy;

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatCard
          label="Due now"
          value={data ? data.stats.due : "–"}
          hint={data ? `${data.stats.total} in your deck` : undefined}
        />
        <StatCard label="Learned" value={data ? data.stats.learned : "–"} hint="reviewed at least once" />
        <StatCard label="Mastered" value={data ? data.stats.mastered : "–"} hint="box 4 and above" />
        <StatCard
          label="Quiz accuracy"
          value={accuracy === null || accuracy === undefined ? "–" : `${accuracy}%`}
          hint={data ? `${data.stats.attempts} attempts` : undefined}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setMode("recall")}
            className={[
              "rounded-full px-4 py-2 text-xs font-semibold transition",
              mode === "recall" ? "bg-ink text-paper" : "border border-line bg-card text-ink-soft hover:border-ink",
            ].join(" ")}
          >
            Spaced recall
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("quiz");
              if (questions.length === 0) startQuiz();
            }}
            className={[
              "rounded-full px-4 py-2 text-xs font-semibold transition",
              mode === "quiz" ? "bg-ink text-paper" : "border border-line bg-card text-ink-soft hover:border-ink",
            ].join(" ")}
          >
            Quick quiz
          </button>
        </div>
        <p className="text-[11px] text-ink-soft/70">
          {mode === "recall"
            ? `${sessionCount} reviewed this session · progress saved automatically`
            : "8 questions · pinyin to meaning"}
        </p>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-vermilion/30 bg-vermilion/5 px-4 py-3 text-sm text-vermilion">
          {error}
        </p>
      ) : null}

      {mode === "recall" ? (
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {loading ? (
              <div className="paper-panel grid min-h-[340px] place-items-center rounded-2xl">
                <p className="text-sm text-ink-soft">Shuffling your deck…</p>
              </div>
            ) : activeCard ? (
              <div className="paper-panel relative overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-line bg-paper/60 px-4 py-2.5">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
                    {activeCard.category}
                  </p>
                  <span className="rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold text-jade">
                    {current ? `box ${activeCard.box}` : "free practice"}
                  </span>
                </div>

                <div className="px-5 py-10 text-center sm:px-10 sm:py-14">
                  <p className="hanzi text-[clamp(2.6rem,9vw,4.5rem)] leading-tight text-ink">
                    {activeCard.zh}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <SpeakButton text={activeCard.zh} size="lg" label="Hear the word" />
                  </div>

                  {revealed ? (
                    <div className="rise mt-7 border-t border-line pt-5">
                      <p className="text-lg font-medium text-vermilion">{activeCard.pinyin}</p>
                      <p className="mt-1 text-base text-ink-soft">{activeCard.en}</p>
                      {activeCard.note ? (
                        <p className="mx-auto mt-2 max-w-sm text-[12px] leading-relaxed text-jade">
                          {activeCard.note}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRevealed(true)}
                      className="mt-7 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper transition hover:bg-vermilion"
                    >
                      Reveal pinyin & meaning
                    </button>
                  )}
                </div>

                <div className="border-t border-line bg-paper/50 p-4">
                  {current ? (
                    <div className="grid gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => void rate("again")}
                        disabled={busy || !revealed}
                        className="rounded-xl border border-vermilion/40 bg-vermilion/5 px-3 py-2.5 text-xs font-semibold text-vermilion transition hover:bg-vermilion/10 disabled:opacity-40"
                      >
                        Again
                        <span className="mt-0.5 block text-[10px] font-normal text-ink-soft/70">8 minutes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => void rate("good")}
                        disabled={busy || !revealed}
                        className="rounded-xl border border-gold/50 bg-gold/10 px-3 py-2.5 text-xs font-semibold text-[#7a5a1a] transition hover:bg-gold/20 disabled:opacity-40"
                      >
                        Good
                        <span className="mt-0.5 block text-[10px] font-normal text-ink-soft/70">a few days</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => void rate("easy")}
                        disabled={busy || !revealed}
                        className="rounded-xl border border-jade/40 bg-jade-soft px-3 py-2.5 text-xs font-semibold text-jade transition hover:bg-jade/10 disabled:opacity-40"
                      >
                        Easy
                        <span className="mt-0.5 block text-[10px] font-normal text-ink-soft/70">two weeks</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-ink-soft">Practising outside the schedule — nice.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFreePractice(null);
                          setRevealed(false);
                          if (data?.upcoming.length) {
                            const next = data.upcoming[Math.floor(Math.random() * data.upcoming.length)];
                            setFreePractice({
                              id: next.itemId,
                              zh: next.zh,
                              pinyin: next.pinyin,
                              en: next.en,
                              category: next.category,
                              note: next.note,
                            });
                          }
                        }}
                        className="rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink"
                      >
                        Another card
                      </button>
                    </div>
                  )}
                  {!revealed && current ? (
                    <p className="mt-2 text-center text-[10px] text-ink-soft/60">
                      Try to recall it before revealing — that struggle is what builds memory.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="paper-panel grid min-h-[340px] place-items-center rounded-2xl p-8 text-center">
                <div>
                  <p className="hanzi text-4xl text-vermilion/80">太好了！</p>
                  <h3 className="display mt-3 text-2xl font-semibold text-ink">All caught up</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                    No cards are due right now. You can keep practising anyway, or switch to the quiz
                    and test yourself against the whole deck.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRevealed(false);
                        setFreePractice(deck[Math.floor(Math.random() * deck.length)]);
                      }}
                      className="rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-paper hover:bg-vermilion"
                    >
                      Free practice a card
                    </button>
                    <button
                      type="button"
                      onClick={startQuiz}
                      className="rounded-full border border-line bg-card px-5 py-2.5 text-xs font-semibold text-ink-soft hover:border-ink"
                    >
                      Take the quiz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="paper-panel rounded-2xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                Coming back soon
              </p>
              {data && data.upcoming.length > 0 ? (
                <ul className="mt-2.5 divide-y divide-line">
                  {data.upcoming.slice(0, 6).map((card) => (
                    <li key={card.itemId} className="flex items-center gap-2 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="hanzi truncate text-sm text-ink">{card.zh}</p>
                        <p className="truncate text-[11px] text-ink-soft">{card.en}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-ink-soft/60">
                        {new Date(card.dueAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-ink-soft">Your schedule is clear.</p>
              )}
            </div>

            <div className="rounded-2xl border border-jade/25 bg-jade-soft/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-jade">
                How this works
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
                Every card has a box. A correct recall moves it up a box and pushes it further into
                the future; a miss sends it back to the start. Short, frequent sessions beat long
                cramming.
              </p>
              <p className="hanzi mt-2 text-xs text-jade">每天十分钟 · ten minutes a day</p>
            </div>

            <div className="paper-panel rounded-2xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                Deck makeup
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px] text-ink-soft">
                <li className="flex justify-between gap-3">
                  <span>Lesson vocabulary</span>
                  <span className="font-semibold text-ink">12 lessons</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>China basics phrases</span>
                  <span className="font-semibold text-ink">10 categories</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Total cards</span>
                  <span className="font-semibold text-ink">{deck.length}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="paper-panel rounded-2xl p-5 sm:p-7">
            {questions.length === 0 ? (
              <div className="py-10 text-center">
                <p className="hanzi text-3xl text-ink">小测验</p>
                <p className="mt-2 text-sm text-ink-soft">Eight questions, taken from your whole deck.</p>
                <button
                  type="button"
                  onClick={startQuiz}
                  className="mt-5 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-vermilion"
                >
                  Start the quiz
                </button>
              </div>
            ) : quizDone ? (
              <div className="py-8 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-vermilion">
                  Quiz complete
                </p>
                <p className="display mt-2 text-5xl font-semibold text-ink">
                  {score}
                  <span className="text-xl text-ink-soft">/{questions.length}</span>
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  {score === questions.length
                    ? "全部正确！Perfect score — take that confidence to the AI partner."
                    : score >= questions.length / 2
                      ? "不错！Good work. Review the misses and try again."
                      : "别担心 — every miss is a word you will remember next time."}
                </p>
                {quizSaving ? (
                  <p className="mt-2 text-xs text-ink-soft/60">Saving your score…</p>
                ) : quizResult ? (
                  <p className="mt-2 text-xs text-ink-soft/60">
                    Saved · {quizResult.attempts} total attempts · best {quizResult.best}% · average{" "}
                    {quizResult.average ?? 0}%
                  </p>
                ) : null}
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-paper hover:bg-vermilion"
                  >
                    New quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("recall")}
                    className="rounded-full border border-line bg-card px-5 py-2.5 text-xs font-semibold text-ink-soft hover:border-ink"
                  >
                    Back to recall
                  </button>
                </div>
              </div>
            ) : question ? (
              <div>
                <div className="flex items-center justify-between text-[11px] text-ink-soft/70">
                  <span>
                    Question {quizIndex + 1} of {questions.length}
                  </span>
                  <span>{score} correct</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-paper-deep">
                  <div
                    className="h-full rounded-full bg-vermilion transition-all"
                    style={{ width: `${((quizIndex + (picked ? 1 : 0)) / questions.length) * 100}%` }}
                  />
                </div>

                <div className="mt-6 text-center">
                  <p className="hanzi text-4xl leading-tight text-ink sm:text-5xl">{question.item.zh}</p>
                  <p className="mt-2 text-base text-vermilion">{question.item.pinyin}</p>
                  <div className="mt-3 flex justify-center">
                    <SpeakButton text={question.item.zh} />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-soft/60">
                    What does it mean?
                  </p>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const isAnswer = option === question.answer;
                    const isPicked = option === picked;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => answer(option)}
                        disabled={!!picked}
                        className={[
                          "rounded-xl border px-4 py-3 text-left text-[13px] transition",
                          picked
                            ? isAnswer
                              ? "border-jade bg-jade-soft text-jade"
                              : isPicked
                                ? "border-vermilion bg-vermilion/10 text-vermilion"
                                : "border-line bg-paper text-ink-soft/70"
                            : "border-line bg-paper text-ink-soft hover:border-vermilion hover:text-ink",
                        ].join(" ")}
                      >
                        {option}
                        {picked && isAnswer ? <span className="ml-1.5 font-semibold">✓</span> : null}
                      </button>
                    );
                  })}
                </div>

                {picked ? (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-ink-soft">
                      {picked === question.answer ? "Correct! 很好！" : `The answer is “${question.answer}”.`}{" "}
                      <span className="text-vermilion">{question.item.pinyin}</span>
                      {question.item.note ? ` · ${question.item.note}` : ""}
                    </p>
                    <button
                      type="button"
                      onClick={() => void nextQuestion()}
                      className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-paper hover:bg-vermilion"
                    >
                      {quizIndex + 1 >= questions.length ? "See result" : "Next question"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            <div className="paper-panel rounded-2xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
                Quiz record
              </p>
              <p className="display mt-2 text-3xl font-semibold text-ink">
                {data?.stats.attempts ?? 0}
                <span className="ml-1 text-sm font-normal text-ink-soft">attempts</span>
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                Overall accuracy: {accuracy === null || accuracy === undefined ? "not enough data yet" : `${accuracy}%`}
              </p>
              <p className="mt-3 border-t border-line pt-3 text-[11px] leading-relaxed text-ink-soft">
                Questions mix words from all twelve lessons and ten basics collections, so a good score
                means real coverage — not luck.
              </p>
            </div>
            <div className="rounded-2xl border border-vermilion/25 bg-vermilion/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-vermilion">
                When you miss one
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
                Say the word aloud three times with its tone, then use it in a sentence to the AI
                partner. Production locks in what recognition only hints at.
              </p>
              <a
                href="/tutor"
                className="mt-2 inline-block text-xs font-semibold text-vermilion hover:underline"
              >
                Open the AI partner →
              </a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
