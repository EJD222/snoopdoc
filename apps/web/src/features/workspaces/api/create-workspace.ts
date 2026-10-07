import { api, requestData } from '@/lib/api/client';
import { TCreateWorkspaceRequest, TCreateWorkspaceResult } from "@snoopdoc/types";

export function createWorkspace(data: TCreateWorkspaceRequest): Promise<TCreateWorkspaceResult> {
    return requestData(async () => {
        return api.post('workspaces', data);
    })
}