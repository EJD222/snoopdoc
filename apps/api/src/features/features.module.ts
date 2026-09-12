import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
    imports: [
        AuthModule,
        WorkspacesModule,
    ],
    exports: [
        AuthModule,
    ],
})
export class FeaturesModule {}
