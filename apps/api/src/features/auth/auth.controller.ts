import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './services/session.service';
import type { FastifyRequest } from 'fastify';
import { AuthGuard } from './guards/auth.guard';
import type { TLoginUserRequest, TRegisterUserRequest } from '@snoopdoc/types';
import { LoginUserCommand } from './commands/login-user.command';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands/register-user.command';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly sessionService: SessionService,
        private readonly commandBus: CommandBus,
    ) {}

    @Post('login')
    async createSession(
        @Req() req: FastifyRequest,
        @Body() body: TLoginUserRequest,
    ) {
        const result =  await this.commandBus.execute(
            new LoginUserCommand(body)
        );

        req.session.set('sessionId', result.sessionId);

        return result.user;
    }
    
    @Post('register')
    async registerUser(
        @Body() body: TRegisterUserRequest
    ) {
        return this.commandBus.execute(
            new RegisterUserCommand(body)
        );
    }

    @Post('logout')
    async logout(@Req() req: FastifyRequest) {
        const sessionId = req.session.get('sessionId');

        if (sessionId) {
            await this.sessionService.delete(sessionId);
        }

        req.session.delete();

        return {
            message: 'User logged out successfully.',
        };
    }

    @UseGuards(AuthGuard)
    @Get('protected')
    getProtected(@Req() request: FastifyRequest) {
        return {
            userId: request.user.id,
        };
    }
}
