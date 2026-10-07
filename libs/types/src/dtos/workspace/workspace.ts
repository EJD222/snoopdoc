import { type } from "arktype";
import { WorkspaceMember } from "../../models/workspace/workspace-member.js";
import { Workspace } from "../../models/index.js";

export const CreateWorkspaceRequest = type({
    name: type('string'),
    description: type('string').atLeastLength(1).atMostLength(2500).optional(),
    members: WorkspaceMember.omit(
        'id',
        'createdAt',
        'updatedAt',
        'deletedAt'
    ).array().optional(),
})
export type TCreateWorkspaceRequest = typeof CreateWorkspaceRequest.infer;

export const CreateWorkspaceResult = type({
    '...': Workspace.omit(
        'createdAt',
        'updatedAt',
        'deletedAt'
    ),
    members: WorkspaceMember.pick(
        'userId',
        'role'
    ).array().optional(),
})
export type TCreateWorkspaceResult = typeof CreateWorkspaceResult.infer;

export const GetWorkspaceResult = type({
    '...': Workspace.omit(
        'deletedAt'
    ),
    members: type({
        firstName: type('string'),
        lastName: type('string'),
        role: type('string'),
    }).array().optional()
})
export type TGetWorkspaceResult = typeof GetWorkspaceResult.infer;