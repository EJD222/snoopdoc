import { type, Type } from "arktype";
import { TBrand } from "../../utils/brand.js";
import { Timestamp } from "../../utils/timestamp.js";

export type TWorkspaceId = TBrand<string, "workspaceId">;
export const WorkspaceId: Type<TWorkspaceId> = type('string.uuid#workspaceId');

export const Workspace = type({
    '...': Timestamp,
    id: WorkspaceId,
    name: type('string'),
    description: type('string').atLeastLength(1).atMostLength(2500).optional(),
});
export const WorkspaceKeys = Workspace.keyof();
export type TWorkspaceKeys = typeof WorkspaceKeys.infer;