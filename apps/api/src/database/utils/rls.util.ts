import { sql } from "drizzle-orm";

export const isRlsBypassed = sql`
    current_setting('app.bypass_rls', true) = 'true'
`;

export const currentUserId = sql`
    current_setting('app.user_id', true)::uuid
`;

export const isCurrentUserAdmin = sql`
    current_setting('app.current_user_role', true) = 'admin'
`;

export const createWorkspaceMemberFunctions = sql`
    CREATE OR REPLACE FUNCTION is_workspace_member(target_workspace_id uuid)
    RETURNS boolean
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = public
    AS $$
        SELECT EXISTS (
            SELECT 1
            FROM workspace_members wm
            WHERE wm.workspace_id = target_workspace_id
              AND wm.user_id = current_setting('app.user_id')::uuid
        );
    $$;

    CREATE OR REPLACE FUNCTION is_workspace_owner(target_workspace_id uuid)
    RETURNS boolean
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = public
    AS $$
        SELECT EXISTS (
            SELECT 1
            FROM workspace_members wm
            WHERE wm.workspace_id = target_workspace_id
              AND wm.user_id = current_setting('app.user_id')::uuid
              AND wm.role = 'owner'
        );
    $$;
`;