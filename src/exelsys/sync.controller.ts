import {Controller, Post} from '@nestjs/common';
import {SyncService} from "./sync.service";

@Controller('sync')
export class SyncController {
    onApplicationBootstrap() {
        setTimeout(async () => {
            const s = new SyncController();
            await s.startSync();
        }, 1000)
    }
    @Post()
    async startSync() {
        return new SyncService().startSync();
    }
}
