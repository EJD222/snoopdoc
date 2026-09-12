import { Injectable } from '@nestjs/common';
import { IRlsContext, TOperation } from '../types/rls';
import { TDatabase } from '../types/database';
import { sql } from 'drizzle-orm';
import { ConnectionService } from './connection.service';

@Injectable()
export class RlsService {
    constructor(private readonly connection: ConnectionService) {};

    private static async setContext(
        tx: TDatabase,
        context: IRlsContext
    ): Promise<void> {
        if (context.userId) {
            await tx.execute(sql`select set_config('app.user_id', ${context.userId}, true)`);
        }

        if (context.role) {
            await tx.execute(
                sql`select set_config('app.current_user_role', ${context.role}, true)`
            );
        }

        if (context.bypassRls) {
            await tx.execute(sql`select set_config('app.bypass_rls', ${context.bypassRls}, true)`);
        }
    }

    async withUserContext<T>(
        context: IRlsContext,
        operation: TOperation<T>,
        options?: {
            isolationLevel?: 'repeatable read' | 'serializable';
        },
    ): Promise<T> {
        return this.connection.db.transaction(
            async (tx) => {
                await RlsService.setContext(tx, context);
                return operation(tx);
            },
            options?.isolationLevel ? { isolationLevel: options.isolationLevel } : undefined,
        )
    }
}
