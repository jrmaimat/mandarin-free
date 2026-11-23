import { CURRICULUM } from "@/data/curriculum";
import { BASICS_SECTIONS } from "@/data/basics";

export type ReviewItem = {
  id: string;
  zh: string;
  pinyin: string;
  en: string;
  category: string;
  note?: string;
};

const seen = new Set<string>();
const items: ReviewItem[] = [];

function add(item: ReviewItem) {
  if (!item.zh || seen.has(item.zh)) return;
  seen.add(item.zh);
  items.push(item);
}

for (const lesson of CURRICULUM) {
  for (const vocab of lesson.vocab) {
    add({
      id: `lesson-${lesson.slug}-${vocab.id}`,
      zh: vocab.zh,
      pinyin: vocab.pinyin,
      en: vocab.en,
      category: `Lesson ${String(lesson.number).padStart(2, "0")} · ${lesson.title}`,
      note: vocab.note,
    });
  }
}

const extraSections = [
  "politeness",
  "greetings",
  "numbers",
  "money",
  "food",
  "transport",
  "emergency",
  "apps",
  "smalltalk",
  "cultural",
];

for (const section of BASICS_SECTIONS.filter((entry) => extraSections.includes(entry.id))) {
  for (const phrase of section.phrases) {
    const clean = !phrase.zh.includes("/") && !phrase.zh.includes("…") && phrase.zh.length <= 9;
    if (!clean) continue;
    add({
      id: `basics-${phrase.id}`,
      zh: phrase.zh,
      pinyin: phrase.pinyin,
      en: phrase.en,
      category: `Basics · ${section.title}`,
      note: phrase.tip,
    });
  }
}

export const REVIEW_DECK: ReviewItem[] = items;

export const REVIEW_CATEGORIES: string[] = Array.from(
  new Set(REVIEW_DECK.map((item) => item.category)),
);

export const REVIEW_DECK_SIZE = REVIEW_DECK.length;

export function getReviewItem(id: string): ReviewItem | undefined {
  return REVIEW_DECK.find((item) => item.id === id);
}
