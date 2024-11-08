import { date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
  id: varchar({ length: 255 }).primaryKey(),
  createdAt: date().notNull().default("now()"),
});

// Currency table
export const currencyTable = pgTable("currency", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  symbol: varchar({ length: 255 }).notNull(),
  code: varchar({ length: 255 }).notNull(),
});

// Asset table
export const assetTable = pgTable("asset", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }) // Ensure this matches the type of usersTable.id
    .notNull()
    .references(() => usersTable.id),
  name: varchar({ length: 255 }).notNull(),
  symbol: varchar({ length: 255 }).notNull(),
  sourceUrl: varchar({ length: 255 }),
  createdAt: date().notNull().default("now()"),
  updatedAt: date().notNull().default("now()"),
});

// Records table
export const recordsTable = pgTable("records", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }) // Ensure this matches the type of usersTable.id
    .notNull()
    .references(() => usersTable.id),
  assetId: integer()
    .notNull()
    .references(() => assetTable.id),
  note: text(),
  currencyId: integer()
    .notNull()
    .references(() => currencyTable.id),
  createdAt: date().notNull().default("now()"),
});
