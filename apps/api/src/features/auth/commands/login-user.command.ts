import { RlsService } from "@/database/services/rls.service";
import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CurrentUser, LoginUserRequest, TCurrentUser, TLoginUserRequest } from "@snoopdoc/types";
import { eq } from "drizzle-orm";
import * as schema from '@/database/schema';
import { verifyPassword } from "../utils/hash.util";
import { UnauthorizedException } from "@nestjs/common";
import { SessionService } from "../services/session.service";

type TLoginUserCommandResult = {
    user: TCurrentUser;
    sessionId: string;
};

export class LoginUserCommand extends Command<TLoginUserCommandResult> {
    constructor(
        public readonly data: TLoginUserRequest
    ) {
        super()
    };
}

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler implements ICommandHandler<LoginUserCommand, TLoginUserCommandResult>{
    constructor(
        private readonly rlsService: RlsService,
        private readonly sessionService: SessionService,
    ) {}

    async execute(command: LoginUserCommand): Promise<TLoginUserCommandResult> {
        const userData = LoginUserRequest.assert(command.data)
       
        return this.rlsService.withUserContext({ bypassRls: true }, async (tx) => {
            const [existingUser] = await tx
                .select()
                .from(schema.usersTable)
                .where(eq(schema.usersTable.email, userData.email))
                .limit(1);
            
            if (!existingUser) {
                throw new UnauthorizedException(
                    'Invalid email or password.',
                );
            }

            const passwordValid = await verifyPassword(existingUser.password, userData.password);
            
            if (!passwordValid) {
                throw new UnauthorizedException(
                    'Invalid email or password.',
                );
            }

            const sessionId = await this.sessionService.create(existingUser.id);

            return {
                user: CurrentUser.from({
                    id: existingUser.id,
                    email: existingUser.email,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                }),
                sessionId,
            };
        })
    }
}
