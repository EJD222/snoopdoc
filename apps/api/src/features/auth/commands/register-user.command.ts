import { RlsService } from "@/database/services/rls.service";
import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CurrentUser, RegisterUserRequest, TCurrentUser, TRegisterUserRequest } from "@snoopdoc/types";
import * as schema from '@/database/schema';
import { hashPassword } from "../utils/hash.util";
import { TDatabase } from "@/database/types/database";
import { eq } from "drizzle-orm";
import { ConflictException } from "@nestjs/common";

export class RegisterUserCommand extends Command<TCurrentUser> {
    constructor(
        public readonly data: TRegisterUserRequest
    ) {
        super()
    };
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand, TCurrentUser>{
    constructor(
		private readonly rls: RlsService,
	) {}

    private async isEmailRegistered(
        tx: TDatabase,
        email: string,
    ): Promise<boolean> {
        const [user] = await tx
            .select({
                id: schema.usersTable.id
            })
            .from(schema.usersTable)
            .where(eq(schema.usersTable.email, email))
            .limit(1);
        
        return !!user;
    }

    async execute(command: RegisterUserCommand): Promise<TCurrentUser> {
        const userData = RegisterUserRequest.assert(command.data)
        const passwordHash = await hashPassword(userData.password);

        return this.rls.withUserContext({ bypassRls: true }, async (tx) => {
            if (await this.isEmailRegistered(tx, userData.email)) {
                throw new ConflictException(
                    'Email is already registered.',
                );
            }

            const [createdUser] = await tx
                .insert(schema.usersTable)
                .values({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: passwordHash,
                })
                .returning();

            if (!createdUser) {
                throw new Error('Failed to create user.');
            }

            return CurrentUser.from({
                id: createdUser.id,
                email: createdUser.email,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName
            });
        });
    }
}