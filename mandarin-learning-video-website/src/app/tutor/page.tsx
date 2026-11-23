import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { TutorStudio } from "@/components/TutorStudio";

export const metadata: Metadata = {
  title: "AI Speaking Partner · Mandarin Compass",
  description:
    "Speak Mandarin out loud to Xiaomin, your AI conversation partner. She answers in beginner Chinese with pinyin and English, corrects your tones gently and keeps a saved transcript.",
};

export default function TutorPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Speak · listen · be corrected"
        hanzi="对话"
        title={
          <>
            Say your Mandarin out loud.
            <br className="hidden sm:block" /> Xiaomin answers.
          </>
        }
        description="Press the microphone and speak — even if it's only 你好. Your AI partner replies in beginner Mandarin with pinyin and English, recognises the phrases you've studied, and nudges your tones without ever making you feel silly."
        aside={
          <div className="paper-panel rounded-2xl p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-vermilion">
              Try your first sentence
            </p>
            <p className="hanzi mt-2 text-2xl text-ink">你好！我叫…</p>
            <p className="text-xs text-vermilion">Nǐ hǎo! Wǒ jiào…</p>
            <p className="mt-1 text-sm text-ink-soft">Hello! My name is…</p>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3 text-[11px] text-ink-soft">
              <span>🎙 Mandarin speech input</span>
              <span>🔊 Spoken replies</span>
              <span>✍️ Pinyin for every line</span>
              <span>🗂 Saved conversation</span>
            </div>
          </div>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <TutorStudio />
      </section>
    </div>
  );
}
