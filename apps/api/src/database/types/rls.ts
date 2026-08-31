import { TUserId } from "@snoopdoc/types";
import { TDatabase } from "./database";

export interface IRlsContext {
    userId?: TUserId;
	bypassRls?: boolean;
}

export type TOperation<T> = (db: TDatabase) => Promise<T>;