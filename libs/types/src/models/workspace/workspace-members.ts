import { type, Type } from "arktype";
import { TBrand } from "../../utils/brand.js";
import { Timestamp } from "../../utils/timestamp.js";
import { UserId } from "../user/user.js";
import { WorkspaceId } from "./workspace.js";

export type TWorkspaceMemberId = TBrand<string, "workspaceMemberId">;
export const WorkspaceMemberId: Type<TWorkspaceMemberId> = type('string.uuid#workspaceMemberId');

export const WorkspaceMember = type({
    '...': Timestamp,
    id: WorkspaceMemberId,
    workspaceId: WorkspaceId, 
    userId: UserId,
    role: type('string')
});
export const WorkspaceMemberKeys = WorkspaceMember.keyof();
export type TWorkspaceMemberKeys = typeof WorkspaceMemberKeys.infer;