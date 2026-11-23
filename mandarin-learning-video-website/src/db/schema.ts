import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const learners = pgTable(
  "learners",
  {
    id: serial("id").primaryKey(),
    learnerKey: text("learner_key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("learners_learner_key_idx").on(table.learnerKey)],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: serial("id").primaryKey(),
    learnerId: integer("learner_id")
      .notNull()
      .references(() => learners.id, { onDelete: "cascade" }),
    lessonSlug: text("lesson_slug").notNull(),
    status: text("status").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("lesson_progress_learner_lesson_idx").on(table.learnerId, table.lessonSlug),
  ],
);

export const reviewCards = pgTable(
  "review_cards",
  {
    id: serial("id").primaryKey(),
    learnerId: integer("learner_id")
      .notNull()
      .references(() => learners.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    box: integer("box").notNull().default(1),
    correctCount: integer("correct_count").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    dueAt: timestamp("due_at", { withTimezone: true }).defaultNow().notNull(),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("review_cards_learner_item_idx").on(table.learnerId, table.itemId)],
);

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  learnerId: integer("learner_id")
    .notNull()
    .references(() => learners.id, { onDelete: "cascade" }),
  correct: integer("correct").notNull(),
  total: integer("total").notNull(),
  mode: text("mode").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tutorMessages = pgTable("tutor_messages", {
  id: serial("id").primaryKey(),
  learnerId: integer("learner_id")
    .notNull()
    .references(() => learners.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  pinyin: text("pinyin"),
  translation: text("translation"),
  tips: text("tips"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
