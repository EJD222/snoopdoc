import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { commandHandlers, queryHandlers } from './workspaces.cqrs';

@Module({
	controllers: [WorkspacesController],
	providers: [
		...commandHandlers,
		...queryHandlers,
	]
})
export class WorkspacesModule { }
