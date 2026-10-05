
import { RlsService } from "@/database/services/rls.service";
import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs";
import { TCurrentUser, TGetWorkspaceResult, TWorkspaceId } from "@snoopdoc/types";
import * as schema from '@/database/schema';
import { eq } from "drizzle-orm";
import { NotFoundException } from "@nestjs/common";

export class GetWorkspaceQuery extends Query<TGetWorkspaceResult> {
    constructor(
        public readonly workspaceId: TWorkspaceId,
        public readonly user: TCurrentUser
    ) {
        super()
    }
}

@QueryHandler(GetWorkspaceQuery)
export class GetWorkspaceQueryHandler implements IQueryHandler<GetWorkspaceQuery, TGetWorkspaceResult> {
    constructor(
        private readonly rlsService: RlsService,
    ) {}
    
    async execute(query: GetWorkspaceQuery): Promise<TGetWorkspaceResult> {
        return this.rlsService.withUserContext({ userId: query.user.id, role: query.user.role }, async (tx) => {
            const workspace = await tx
                .select({
                    id: schema.workspacesTable.id,
                    workspaceName: schema.workspacesTable.name,
                    createdAt: schema.workspacesTable.createdAt,
                    updatedAt: schema.workspacesTable.updatedAt,
                    memberFirstName: schema.usersTable.firstName,
                    memberLastName: schema.usersTable.lastName,
                    role: schema.workspaceMembersTable.role,
                })
                .from(schema.workspacesTable)
                .where(eq(schema.workspacesTable.id, query.workspaceId))
                .leftJoin(
                    schema.workspaceMembersTable,
                    eq(schema.workspacesTable.id, schema.workspaceMembersTable.workspaceId)
                )
                .leftJoin(
                    schema.usersTable,
                    eq(schema.workspaceMembersTable.userId, schema.usersTable.id)
                )
            
            if (workspace.length === 0) {
                throw new NotFoundException('Workspace not found.');
            }

            return {
                id: workspace[0].id,
                name: workspace[0].workspaceName,
                createdAt: workspace[0].createdAt,
                updatedAt: workspace[0].updatedAt,
                members: workspace
                    .filter((member) => 
                        member.memberFirstName !== null && 
                        member.memberLastName !== null &&
                        member.role !== null
                    )
                    .map((member) => ({
                        firstName: member.memberFirstName!,
                        lastName: member.memberLastName!,
                        role: member.role! ,
                    }))
            }
        })
    }
}    