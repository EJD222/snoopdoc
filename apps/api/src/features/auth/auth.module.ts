import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SessionService } from './commands/services/session.service';

@Module({
    controllers: [AuthController],
    providers: [SessionService]
})
export class AuthModule {}
