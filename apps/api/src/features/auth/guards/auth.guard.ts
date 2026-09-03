import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly sessionService: SessionService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const sessionId = request.session.get('sessionId');

        if (!sessionId) {
            throw new UnauthorizedException();
        }
        
        const session = await this.sessionService.get(sessionId);

        if (!session) {
            throw new UnauthorizedException();
        }

        request.user = { 
            id: session.userId 
        };

        return true;
    }
}
