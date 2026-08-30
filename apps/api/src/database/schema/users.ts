import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { TUserId, TUserKeys } from '@snoopdoc/types';

export const usersTable = pgTable(
    'users',
    {
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        deletedAt: timestamp('deleted_at', { withTimezone: true}),
        id: uuid('id').$type<TUserId>().defaultRandom().primaryKey(),
        firstName: varchar('first_name', { length: 255 }).notNull(),
        lastName: varchar('firstName', { length: 255 }).notNull(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        password: varchar('password', { length: 255 }).notNull(),
    } satisfies Record<TUserKeys, unknown>
);

