import { Controller, Get, Post, Req } from '@nestjs/common';
import { SessionService } from './commands/services/session.service';
import type { FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
    constructor(private readonly sessionService: SessionService) {}
    
    @Post('session')
    async testSession(@Req() req: FastifyRequest) {
        const sessionId = await this.sessionService.create('test-user-id');

        req.session.set('sessionId', sessionId);

        return {
            message: 'Session created',
        };
    };

    @Get('session')
    async getSession(@Req() req: FastifyRequest) {
        const sessionId = req.session.get('sessionId');

        if (!sessionId) {
            return {
                authenticated: false,
            };
        }

        const session = await this.sessionService.get(sessionId);

        return {
            authenticated: !!session,
            session,
        };
    }
}
