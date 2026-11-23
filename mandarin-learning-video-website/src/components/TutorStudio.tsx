"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { SpeakButton } from "@/components/SpeakButton";
import { callApi, getLearnerKey } from "@/lib/client";
import { useRecognition, useSpeech } from "@/lib/speech";
import { TUTOR_STARTERS } from "@/lib/tutor";
import type { ChatMessage, TutorResponse } from "@/lib/types";

type LastReply = {
  suggestions: string[];
  vocab: { zh: string; pinyin: string; en: string }[];
  coach: string;
  engine: string;
  matched?: { zh: string; pinyin: string; en: string };
};

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "你好！我是小敏，你的中文伙伴。按麦克风，用中文跟我说一句话吧。你叫什么名字？",
  pinyin: "Nǐ hǎo! Wǒ shì Xiǎomǐn, nǐ de Zhōngwén huǒbàn. Àn màikèfēng, yòng Zhōngwén gēn wǒ shuō yí jù huà ba. Nǐ jiào shénme míngzi?",
  translation:
    "Hello! I'm Xiaomin, your Mandarin partner. Press the microphone and say one sentence to me in Chinese. What's your name?",
  tips: [
    "Speak slowly — meaning lives in the tones, not the speed.",
    "You can also type pinyin or English; I'll always reply in Chinese.",
  ],
  createdAt: new Date().toISOString(),
};

const HELP_TOPICS = [
  "Greetings & introductions",
  "Ordering food & paying",
  "Taxis, metro & directions",
  "Hotels, Wi-Fi & rooms",
  "Shopping & bargaining",
  "Tones, pinyin & pronunciation",
  "Family, work & small talk",
  "Hospitals & emergencies",
];

export function TutorStudio() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [lastReply, setLastReply] = useState<LastReply | null>(null);
  const [turn, setTurn] = useState(0);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);
  const { speak } = useSpeech();

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;
      setInput("");
      setError(null);
      setPending(true);
      const optimistic: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: text,
        pinyin: null,
        translation: null,
        tips: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((current) => [...current, optimistic]);

      try {
        const data = await callApi<TutorResponse>("/api/tutor", {
          method: "POST",
          body: JSON.stringify({ learnerKey: getLearnerKey(), message: text }),
        });
        setMessages(data.messages);
        setTurn(data.turn);
        setLastReply({
          suggestions: data.reply.suggestions ?? [],
          vocab: data.reply.vocab ?? [],
          coach: data.reply.coach,
          engine: data.reply.engine,
          matched: data.reply.matched,
        });
        if (autoSpeak) speak(data.reply.zh);
      } catch (caught) {
        setMessages((current) => current.filter((message) => message.id !== optimistic.id));
        setError(caught instanceof Error ? caught.message : "Could not reach your tutor.");
      } finally {
        setPending(false);
      }
    },
    [autoSpeak, pending, speak],
  );

  const recognition = useRecognition((transcript) => {
    setInput(transcript);
    void send(transcript);
  });

  useEffect(() => {
    let cancelled = false;
    callApi<{ messages: ChatMessage[] }>(`/api/tutor?learnerKey=${encodeURIComponent(getLearnerKey())}`)
      .then((data) => {
        if (cancelled) return;
        setMessages(data.messages);
        setTurn(data.messages.filter((message) => message.role === "user").length);
      })
      .catch(() => {
        if (!cancelled) setError("Chat history is unavailable right now — you can still practise.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  const visibleMessages = useMemo(
    () => (messages.length === 0 && !loading ? [WELCOME] : messages),
    [messages, loading],
  );

  const suggestions = lastReply?.suggestions?.length
    ? lastReply.suggestions
    : TUTOR_STARTERS.map((starter) => starter.zh);

  const reset = async () => {
    setError(null);
    try {
      await callApi<{ messages: ChatMessage[] }>(
        `/api/tutor?learnerKey=${encodeURIComponent(getLearnerKey())}`,
        { method: "DELETE" },
      );
      setMessages([]);
      setLastReply(null);
      setTurn(0);
    } catch {
      setError("Could not clear the conversation.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
      <div className="paper-panel flex min-h-[560px] flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-paper/70 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="relative">
              <span className="seal grid h-10 w-10 place-items-center rounded-full text-base">敏</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-jade" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">小敏 · Xiaomin</p>
              <p className="text-[11px] text-ink-soft">
                {pending ? "Listening carefully…" : "Online · replies in Mandarin + English"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowTranslation((value) => !value)}
              className={[
                "rounded-full border px-2.5 py-1 text-[10px] font-semibold transition",
                showTranslation
                  ? "border-jade/40 bg-jade-soft text-jade"
                  : "border-line bg-card text-ink-soft hover:border-ink",
              ].join(" ")}
            >
              {showTranslation ? "Translations on" : "Translations off"}
            </button>
            <button
              type="button"
              onClick={() => setAutoSpeak((value) => !value)}
              className={[
                "rounded-full border px-2.5 py-1 text-[10px] font-semibold transition",
                autoSpeak
                  ? "border-vermilion/40 bg-vermilion/10 text-vermilion"
                  : "border-line bg-card text-ink-soft hover:border-ink",
              ].join(" ")}
            >
              {autoSpeak ? "Voice on" : "Voice off"}
            </button>
          </div>
        </div>

        <div className="chat-scroll flex-1 space-y-4 overflow-y-auto bg-paper/30 px-3 py-4 sm:px-4">
          {loading ? (
            <p className="py-10 text-center text-sm text-ink-soft">Waking Xiaomin up…</p>
          ) : null}

          {visibleMessages.map((message) => {
            const isAssistant = message.role === "assistant";
            if (!isAssistant) {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-paper">
                    <p className="hanzi text-[15px] leading-relaxed">{message.content}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className="flex gap-2.5">
                <span className="seal mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px]">
                  敏
                </span>
                <div className="min-w-0 max-w-[88%] rounded-2xl rounded-tl-sm border border-line bg-card px-4 py-3">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="hanzi text-lg leading-snug text-ink">{message.content}</p>
                      {message.pinyin ? (
                        <p className="mt-1 text-xs leading-relaxed text-vermilion">{message.pinyin}</p>
                      ) : null}
                      {showTranslation && message.translation ? (
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                          {message.translation}
                        </p>
                      ) : null}
                    </div>
                    <SpeakButton text={message.content} size="sm" />
                  </div>

                  {message.tips && message.tips.length > 0 ? (
                    <ul className="mt-2.5 space-y-1 border-t border-line pt-2">
                      {message.tips.map((tip) => (
                        <li key={tip} className="flex gap-1.5 text-[11px] leading-relaxed text-jade">
                          <span aria-hidden>▹</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            );
          })}

          {pending ? (
            <div className="flex items-center gap-2.5">
              <span className="seal grid h-7 w-7 place-items-center rounded-full text-[11px]">敏</span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-line bg-card px-4 py-3">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-vermilion/60"
                    style={{ animationDelay: `${dot * 120}ms` }}
                  />
                ))}
                <span className="ml-1 text-[11px] text-ink-soft">小敏 is thinking…</span>
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        {lastReply ? (
          <div className="border-t border-line bg-card px-3 pt-2.5 sm:px-4">
            <p className="text-[11px] leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">Coach:</span> {lastReply.coach}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/60">
                New words
              </span>
              {lastReply.vocab.map((word) => (
                <span
                  key={word.zh}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper py-0.5 pl-2 pr-0.5"
                >
                  <span className="hanzi text-xs text-ink">{word.zh}</span>
                  <span className="text-[10px] text-vermilion">{word.pinyin}</span>
                  <SpeakButton text={word.zh} size="sm" className="!h-5 !w-5" />
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="border-t border-line bg-card p-3 sm:p-4">
          <div className="tab-scroll mb-2 flex gap-1.5 overflow-x-auto pb-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void send(suggestion)}
                disabled={pending}
                className="shrink-0 rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink-soft transition hover:border-vermilion hover:text-vermilion disabled:opacity-50"
              >
                <span className="hanzi">{suggestion}</span>
              </button>
            ))}
          </div>

          {error ? (
            <p className="mb-2 rounded-lg border border-vermilion/30 bg-vermilion/5 px-3 py-2 text-xs text-vermilion">
              {error}
            </p>
          ) : null}
          {recognition.error ? (
            <p className="mb-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-[#7a5a1a]">
              {recognition.error}
            </p>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2"
          >
            <button
              type="button"
              onClick={recognition.listening ? recognition.stop : recognition.start}
              disabled={pending || !recognition.supported}
              aria-label={recognition.listening ? "Stop recording" : "Speak Mandarin"}
              className={[
                "grid h-11 w-11 shrink-0 place-items-center rounded-full text-paper transition disabled:opacity-40",
                recognition.listening ? "mic-live bg-vermilion" : "bg-jade hover:bg-[#245748]",
              ].join(" ")}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
                <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                rows={1}
                placeholder={
                  recognition.listening
                    ? "Listening… say 你好 or 我要一碗面"
                    : "Type Mandarin, pinyin or English — or press the mic"
                }
                aria-label="Your message"
                className="max-h-28 min-h-[44px] w-full resize-none rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/50 focus:border-vermilion"
              />
            </div>
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="grid h-11 shrink-0 place-items-center rounded-full bg-ink px-4 text-sm font-semibold text-paper transition hover:bg-vermilion disabled:opacity-40"
            >
              Send
            </button>
          </form>
          <p className="mt-2 text-[10px] text-ink-soft/70">
            {recognition.supported
              ? "Microphone uses your browser's Chinese speech recognition (Chrome or Edge works best)."
              : "Voice input isn't available in this browser — typing works perfectly."}
            {turn > 0 ? ` · ${turn} speaking turn${turn === 1 ? "" : "s"} saved.` : ""}
          </p>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-line">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/tutor.jpg"
              alt="Ink-wash mountains with a vermilion seal"
              fill
              sizes="(max-width: 1024px) 100vw, 380px"
              className="object-cover"
            />
          </div>
          <div className="bg-card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-vermilion">
              Your patient partner
            </p>
            <p className="display mt-1 text-lg font-semibold text-ink">No judgement. Only practice.</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
              Xiaomin speaks beginner Mandarin, recognises the phrases you&apos;ve learned, corrects
              gently and always gives you the pinyin.
            </p>
          </div>
        </div>

        <div className="paper-panel rounded-2xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
            How to use the mic
          </p>
          <ol className="mt-2.5 space-y-2">
            {[
              "Press the green microphone and allow access.",
              "Say one short phrase: 你好，我叫…",
              "Wait — your words appear, then Xiaomin answers aloud.",
              "Tap any speaker icon to hear a line again, slowly.",
            ].map((step, index) => (
              <li key={step} className="flex gap-2 text-[12px] leading-relaxed text-ink-soft">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-paper-deep text-[10px] font-semibold text-ink">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="paper-panel rounded-2xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
            What she can help with
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {HELP_TOPICS.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] text-ink-soft"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
            Starter phrases
          </p>
          <div className="mt-2.5 space-y-2">
            {TUTOR_STARTERS.slice(0, 4).map((starter) => (
              <div key={starter.zh} className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => void send(starter.zh)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="hanzi text-sm text-ink hover:text-vermilion">{starter.zh}</p>
                  <p className="text-[10px] text-vermilion">{starter.pinyin}</p>
                  <p className="text-[11px] text-ink-soft">{starter.en}</p>
                </button>
                <SpeakButton text={starter.zh} size="sm" />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => void reset()}
          className="w-full rounded-full border border-line bg-card px-4 py-2.5 text-xs font-semibold text-ink-soft transition hover:border-vermilion hover:text-vermilion"
        >
          Start a fresh conversation
        </button>
        <p className="text-center text-[10px] leading-relaxed text-ink-soft/60">
          Voice features use your browser&apos;s built-in speech engine. Nothing is recorded — only
          the text of your messages is saved so you can come back later.
        </p>
      </aside>
    </div>
  );
}
