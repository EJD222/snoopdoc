import { Global, Module } from '@nestjs/common';
import { ConnectionService } from './services/connection.service';
import { MigrationsService } from './services/migrations.service';
import { RlsService } from './services/rls.service';

@Global()
@Module({
    imports: [],
    providers: [ConnectionService, MigrationsService, RlsService],
    exports: []
})
export class DatabaseModule {}
