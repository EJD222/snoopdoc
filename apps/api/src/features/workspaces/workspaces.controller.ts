import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import type { TCreateWorkspaceRequest, TCreateWorkspaceResult } from '@snoopdoc/types';
import { CreateWorkspaceCommand } from './cqrs/commands/create-workspace.command';

@Controller('workspaces')
export class WorkspacesController {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    async createWorkspace(
        @Body() body: TCreateWorkspaceRequest
    ): Promise<TCreateWorkspaceResult> {
        return this.commandBus.execute(
            new CreateWorkspaceCommand(body)
        );
    }

    
}
