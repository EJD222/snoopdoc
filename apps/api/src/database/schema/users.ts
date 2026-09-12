import { pgEnum, pgPolicy, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { TUserId, TUserKeys } from '@snoopdoc/types';
import { sql } from "drizzle-orm";
import { isCurrentUserAdmin, isRlsBypassed } from "../utils/rls.util";

export const userRoleEnum = pgEnum(
    'user_role',
    ['admin', 'user'],
);

export const usersTable = pgTable(
    'users',
    {
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        deletedAt: timestamp('deleted_at', { withTimezone: true}),
        id: uuid('id').$type<TUserId>().defaultRandom().primaryKey(),
        firstName: varchar('first_name', { length: 255 }).notNull(),
        lastName: varchar('last_name', { length: 255 }).notNull(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        password: varchar('password', { length: 255 }).notNull(),
        role: userRoleEnum('role')
            .notNull()
            .default('user'),
    } satisfies Record<TUserKeys, unknown>,
    (table) => [
        pgPolicy('users_select_policy', {
            for: 'select',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR ${table.id} = current_setting('app.user_id', true)::uuid
            `
        }),
        pgPolicy('users_insert_policy', {
            for: 'insert',
            withCheck: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
            `
        }),
        pgPolicy('users_update_policy', {
            for: 'update',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR ${table.id} = current_setting('app.user_id', true)::uuid
            `,
        }),
        pgPolicy('users_delete_policy', {
            for: 'delete',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
            `,
        }),
    ]
);