import { CacheService } from '@/features/cache/cache.service';
import { Injectable } from '@nestjs/common';
import { SessionData } from '../../types/session';

@Injectable()
export class SessionService {
    private readonly SESSION_PREFIX = 'session:';
    private readonly SESSION_EXPIRATION = 24 * 60 * 60 * 1000;

    constructor(
        private readonly cache: CacheService
    ) {}

    async create(userId: string): Promise<string> {
        const sessionId = await this.generateSessionId();

        await this.cache.set<SessionData>(
            this.SESSION_PREFIX + sessionId, 
            { userId }, 
            this.SESSION_EXPIRATION
        ); 

        return sessionId;
    }

    async get(sessionId: string): Promise<SessionData | undefined> {
        return this.cache.get(this.SESSION_PREFIX + sessionId);
    }

    async delete(sessionId: string): Promise<void> {
        await this.cache.delete(this.SESSION_PREFIX + sessionId);
    }

    private async generateSessionId(): Promise<string> {
        return crypto.randomUUID();
    }
}
