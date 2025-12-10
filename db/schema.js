import { pgTable, serial, text, integer, jsonb, timestamp, boolean, real, unique } from 'drizzle-orm/pg-core';

// Contestants table
export const contestants = pgTable('contestants', {
  id: serial('id').primaryKey(),
  number: integer('number').notNull(),
  name: text('name').notNull(),
  gender: text('gender').notNull(), // 'Male' or 'Female'
  course: text('course'),
  partnerNumber: integer('partner_number'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  gender: text('gender').notNull(), // 'Male', 'Female', or 'Both'
  order: integer('order').notNull(),
  criteria: jsonb('criteria').notNull(), // Array of {name: string, maxScore: number}
  createdAt: timestamp('created_at').defaultNow(),
});

// Judges table
export const judges = pgTable('judges', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  pin: text('pin').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Scores table
export const scores = pgTable('scores', {
  id: serial('id').primaryKey(),
  judgeId: integer('judge_id').notNull().references(() => judges.id),
  contestantId: integer('contestant_id').notNull().references(() => contestants.id),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  criteriaScores: jsonb('criteria_scores').notNull(), // Object with criterion names as keys
  totalScore: real('total_score').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueScore: unique().on(table.judgeId, table.contestantId, table.categoryId),
}));
