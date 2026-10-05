CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
CREATE POLICY "users_select_policy" ON "users" AS PERMISSIVE FOR SELECT TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR "users"."id" = current_setting('app.user_id', true)::uuid
            );--> statement-breakpoint
CREATE POLICY "users_insert_policy" ON "users" AS PERMISSIVE FOR INSERT TO public WITH CHECK (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

            );--> statement-breakpoint
CREATE POLICY "users_update_policy" ON "users" AS PERMISSIVE FOR UPDATE TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR "users"."id" = current_setting('app.user_id', true)::uuid
            );--> statement-breakpoint
CREATE POLICY "users_delete_policy" ON "users" AS PERMISSIVE FOR DELETE TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

            );