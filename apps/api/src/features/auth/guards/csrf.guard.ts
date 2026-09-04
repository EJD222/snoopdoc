import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const reply = context.switchToHttp().getResponse();

        try {
            await new Promise((resolve, reject) => {
                request.server.csrfProtection(request, reply, (error: Error | undefined) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(undefined);
                    }
                });
            });
        } catch (error) {
            throw new ForbiddenException('Invalid CSRF token.');
        }

        return true;
    }
}
