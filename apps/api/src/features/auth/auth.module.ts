import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SessionService } from './services/session.service';
import { commandsHandlers } from './auth.cqrs';

@Module({
    controllers: [AuthController],
    providers: [
        SessionService,
        ...commandsHandlers
    ]
})
export class AuthModule {}
