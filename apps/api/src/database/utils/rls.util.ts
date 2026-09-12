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