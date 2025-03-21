import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { ExelsysClientService } from './exelsys-client.service';
import { ExelsysService } from './exelsys.service';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [
    SharedModule
  ],
  providers: [ExelsysClientService, ExelsysService, SyncService],
  controllers: [SyncController]
})
export class ExelsysModule {

}
