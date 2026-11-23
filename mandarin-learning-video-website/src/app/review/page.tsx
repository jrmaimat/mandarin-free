import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ReviewStudio } from "@/components/ReviewStudio";
import { REVIEW_DECK, REVIEW_DECK_SIZE } from "@/data/review";

export const metadata: Metadata = {
  title: "Review Studio · Mandarin Compass",
  description:
    "Spaced-repetition flashcards and quick quizzes for every Mandarin word and phrase on the site. Progress is saved to your own learner profile.",
};

export default function ReviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Recall · repeat · remember"
        hanzi="复习"
        title={
          <>
            Review studio
            <br className="hidden sm:block" /> for what you just learned
          </>
        }
        description={`${REVIEW_DECK_SIZE} flashcards drawn from all twelve lessons and the everyday China phrasebook. Recall each word, reveal the tone, then let the schedule bring it back at the perfect moment.`}
        aside={
          <div className="paper-panel rounded-2xl p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-vermilion">
              A good review habit
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-ink-soft">
              <li>· Ten minutes every morning beats an hour on Sunday.</li>
              <li>· Say the word out loud before you reveal the meaning.</li>
              <li>· Rate honestly — “Easy” on a word you barely know slows you down.</li>
              <li>· Finish with the quiz to test reading, not just recognition.</li>
            </ul>
            <p className="hanzi mt-3 border-t border-line pt-3 text-sm text-jade">熟能生巧 · practice makes perfect</p>
          </div>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ReviewStudio deck={REVIEW_DECK} />
      </section>
    </div>
  );
}
