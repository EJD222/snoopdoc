import { RlsService } from "@/database/services/rls.service";
import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateWorkspaceRequest, CreateWorkspaceResult, TCreateWorkspaceRequest, TCreateWorkspaceResult } from "@snoopdoc/types";
import * as schema from '@/database/schema';
import { eq } from "drizzle-orm";

export class CreateWorkspaceCommand extends Command<TCreateWorkspaceResult>{
    constructor(
        public readonly data: TCreateWorkspaceRequest
    ) {
        super()
    };
}

@CommandHandler(CreateWorkspaceCommand)
export class CreateWorkspaceCommandHandler implements ICommandHandler<CreateWorkspaceCommand, TCreateWorkspaceResult> {
    constructor(
        private readonly rlsService: RlsService,
    ) {}

    async execute(command: CreateWorkspaceCommand): Promise<TCreateWorkspaceResult> {
        const workspaceData = CreateWorkspaceRequest.assert(command.data)
        
        return this.rlsService.withUserContext({ bypassRls: true }, async (tx) => {
            const [existingWorkspace] = await tx
                .select()
                .from(schema.workspacesTable)
                .where(eq(schema.workspacesTable.name, workspaceData.name))
                .limit(1);

            if(!existingWorkspace) {
                throw new Error(
                    `Workspace with name ${workspaceData.name} already exists.`
                );
            }

            const [newWorkspace] = await tx
                .insert(schema.workspacesTable)
                .values({
                    name: workspaceData.name,
                })
                .returning();
            
            if(!newWorkspace) {
                throw new Error(
                    `Failed to create workspace with name ${workspaceData.name}.`
                );
            }

            return CreateWorkspaceResult.from({
                id: newWorkspace.id,
                name: newWorkspace.name,
            })
        })
    }
}