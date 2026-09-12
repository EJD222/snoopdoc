import { isCurrentUserAdmin, isRlsBypassed } from "@/database/utils/rls.util";
import { TWorkspaceId, TWorkspaceKeys } from "@snoopdoc/types";
import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const workspacesTable = pgTable(
    'workspaces',
    {
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        deletedAt: timestamp('deleted_at', { withTimezone: true}),
        id: uuid('id').$type<TWorkspaceId>().defaultRandom().primaryKey(),
        name: varchar('name', { length: 255 }).notNull()
    } satisfies Record<TWorkspaceKeys, unknown>,
    (table) => [
        pgPolicy('workspace_select_policy', {
            for: 'select',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR EXISTS (
                    SELECT 1
                    FROM workspace_members as wm
                    WHERE wm.workspace_id = workspaces.id
                        AND wm.user_id = current_setting('app.user_id', true)::uuid
                )
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
                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = workspaces.id
                        AND wm.role = 'owner'
                        AND wm.user_id = current_setting('app.user_id', true)::uuid
                )
            `,
        }),
        pgPolicy('workspace_delete_policy', {
            for: 'delete',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = workspaces.id
                        AND wm.role = 'owner'
                        AND wm.user_id = current_setting('app.user_id', true)::uuid
                )
            `,
        }),
    ]
);