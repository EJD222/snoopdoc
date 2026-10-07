import { isCurrentUserAdmin, isRlsBypassed } from "../../utils/rls.util";
import { TWorkspaceId, TWorkspaceKeys } from "@snoopdoc/types";
import { sql } from "drizzle-orm";
import { pgPolicy, text } from "drizzle-orm/pg-core";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const workspacesTable = pgTable(
    'workspaces',
    {
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
        id: uuid('id').$type<TWorkspaceId>().defaultRandom().primaryKey(),
        name: varchar('name', { length: 255 }).notNull().unique(),
        description: text('description'),
    } satisfies Record<TWorkspaceKeys, unknown>,
    (table) => [
        pgPolicy('workspace_select_policy', {
            for: 'select',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR is_workspace_member(${table.id})
            `
        }),
        pgPolicy('workspace_insert_policy', {
            for: 'insert',
            withCheck: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
            `
        }),
        pgPolicy('workspace_update_policy', {
            for: 'update',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR is_workspace_owner(${table.id})
            `,
        }),
        pgPolicy('workspace_delete_policy', {
            for: 'delete',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR is_workspace_owner(${table.id})
            `,
        }),
    ]
);