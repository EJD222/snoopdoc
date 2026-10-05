CREATE TYPE "public"."workspace_member_role" AS ENUM('admin', 'owner', 'member');--> statement-breakpoint
CREATE TABLE "workspaces" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspaces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "workspace_member_role" DEFAULT 'member' NOT NULL,
	CONSTRAINT "workspace_members_workspace_user_unique" UNIQUE("workspace_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "workspace_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE POLICY "workspace_select_policy" ON "workspaces" AS PERMISSIVE FOR SELECT TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR EXISTS (
                    SELECT 1
                    FROM workspace_members as wm
                    WHERE wm.workspace_id = workspaces.id
                        AND wm.user_id = current_setting('app.user_id', true)::uuid
                )
            );--> statement-breakpoint
CREATE POLICY "workspace_insert_policy" ON "workspaces" AS PERMISSIVE FOR INSERT TO public WITH CHECK (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

            );--> statement-breakpoint
CREATE POLICY "workspace_update_policy" ON "workspaces" AS PERMISSIVE FOR UPDATE TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = workspaces.id
                        AND wm.role = 'owner'
                        AND wm.user_id = current_setting('app.user_id', true)::uuid
                )
            );--> statement-breakpoint
CREATE POLICY "workspace_delete_policy" ON "workspaces" AS PERMISSIVE FOR DELETE TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = workspaces.id
                        AND wm.role = 'owner'
                        AND wm.user_id = current_setting('app.user_id', true)::uuid
                )
            );--> statement-breakpoint
CREATE POLICY "workspace_members_select_policy" ON "workspace_members" AS PERMISSIVE FOR SELECT TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = "workspace_members"."workspace_id"
                        AND wm.user_id = 
    current_setting('app.user_id', true)::uuid

                )
            );--> statement-breakpoint
CREATE POLICY "workspace__members_insert_policy" ON "workspace_members" AS PERMISSIVE FOR INSERT TO public WITH CHECK (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = "workspace_members"."workspace_id"
                        AND wm.user_id = 
    current_setting('app.user_id', true)::uuid

                        AND wm.role = 'owner'
                )
            );--> statement-breakpoint
CREATE POLICY "workspace_members_update_policy" ON "workspace_members" AS PERMISSIVE FOR UPDATE TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = "workspace_members"."workspace_id"
                        AND wm.user_id = 
    current_setting('app.user_id', true)::uuid

                        AND wm.role = 'owner'
                )
            );--> statement-breakpoint
CREATE POLICY "workspace_members_delete_policy" ON "workspace_members" AS PERMISSIVE FOR DELETE TO public USING (
                
    current_setting('app.bypass_rls', true) = 'true'

                OR 
    current_setting('app.current_user_role', true) = 'admin'

                OR EXISTS (
                    SELECT 1
                    FROM workspace_members wm
                    WHERE wm.workspace_id = "workspace_members"."workspace_id"
                        AND wm.user_id = 
    current_setting('app.user_id', true)::uuid

                        AND wm.role = 'owner'
                )
            );