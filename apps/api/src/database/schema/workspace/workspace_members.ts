import { TUserId, TWorkspaceId, TWorkspaceMemberId, TWorkspaceMemberKeys } from "@snoopdoc/types";
import { pgPolicy, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { workspacesTable } from "./workspaces";
import { usersTable } from "../users";
import { pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { currentUserId, isCurrentUserAdmin, isRlsBypassed } from "@/database/utils/rls.util";

export const workspaceMemberRoleEnum = pgEnum(
    'workspace_member_role',
    ['admin', 'owner', 'member'],
);

export const workspaceMembersTable = pgTable(
    'workspace_members',
    {
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        deletedAt: timestamp('deleted_at', { withTimezone: true}),
        id: uuid('id').$type<TWorkspaceMemberId>().defaultRandom().primaryKey(),
        workspaceId: uuid('workspace_id').$type<TWorkspaceId>()
            .notNull()
            .references(() => workspacesTable.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade'
            }),
        userId: uuid('user_id').$type<TUserId>()
            .notNull()
            .references(() => usersTable.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade'
            }),
        role: workspaceMemberRoleEnum('role')
            .notNull()
            .default('member'),
    } satisfies Record<TWorkspaceMemberKeys, unknown>,
    (table) => [
        unique('workspace_members_workspace_user_unique').on(
            table.workspaceId,
            table.userId,
        ),
        pgPolicy('workspace_members_select_policy', {
            for: 'select',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = ${table.workspaceId}
                        AND wm.user_id = ${currentUserId}
                )
            `
        }),
        pgPolicy('workspace__members_insert_policy', {
            for: 'insert',
            withCheck: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = ${table.workspaceId}
                        AND wm.user_id = ${currentUserId}
                        AND wm.role = 'owner'
                )
            `
        }),
        pgPolicy('workspace_members_update_policy', {
            for: 'update',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = ${table.workspaceId}
                        AND wm.user_id = ${currentUserId}
                        AND wm.role = 'owner'
                )
            `,
        }),
        pgPolicy('workspace_members_delete_policy', {
            for: 'delete',
            using: sql`
                ${isRlsBypassed}
                OR ${isCurrentUserAdmin}
                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = ${table.workspaceId}
                        AND wm.user_id = ${currentUserId}
                        AND wm.role = 'owner'
                )
            `,
        }),
    ],
);