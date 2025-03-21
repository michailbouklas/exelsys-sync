import {Controller, Post} from '@nestjs/common';
import {SyncService} from "./sync.service";

@Controller('sync')
export class SyncController {
    onApplicationBootstrap() {
        setTimeout(async () => {
                  const res = await fetch(`http://localhost:4507/sync`, {
                      method: 'POST',
                  })
                  const data = await res.json();
                  // console.log(data);
        })
    }
    @Post()
    async startSync() {
        return new SyncService().startSync();
    }
}
