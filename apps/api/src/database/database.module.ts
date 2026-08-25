import { Global, Module } from '@nestjs/common';
import { ConnectionService } from './services/connection.service';
import { MigrationsService } from './services/migrations.service';

@Global()
@Module({
    imports: [],
    providers: [ConnectionService, MigrationsService],
    exports: []
})
export class DatabaseModule {}
