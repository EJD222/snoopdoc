import { TUserId, TUserRole } from "@snoopdoc/types";
import { TDatabase } from "./database";

export interface IRlsContext {
    userId?: TUserId;
	bypassRls?: boolean;
    role?: TUserRole;
}

export type TOperation<T> = (db: TDatabase) => Promise<T>;