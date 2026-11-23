"use client";

import { useSpeech } from "@/lib/speech";

export function SpeakButton({
  text,
  label,
  size = "md",
  className = "",
}: {
  text: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { speak, supported, speaking } = useSpeech();
  const dims =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-9 w-9";

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      title={supported ? `Hear “${text}”` : "Your browser cannot play speech audio"}
      aria-label={label ?? `Hear ${text}`}
      className={[
        dims,
        "grid shrink-0 place-items-center rounded-full border border-line bg-card text-ink-soft transition hover:border-vermilion hover:text-vermilion active:scale-95",
        speaking ? "border-vermilion text-vermilion" : "",
        !supported ? "opacity-50" : "",
        className,
      ].join(" ")}
    >
      <svg viewBox="0 0 24 24" fill="none" className={size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]"} aria-hidden>
        <path
          d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5H4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
