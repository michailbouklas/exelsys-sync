import { Logger, Module } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ModuleRef } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      verboseMemoryLeak: true,
      maxListeners: 50,
    }),
  ],
  providers: [
    PrismaService,
  ],
  exports: [
    PrismaService,
  ],
})
export class SharedModule {
  public static eventEmitter: EventEmitter2;
  static moduleRef: ModuleRef;
  private readonly logger = new Logger(SharedModule.name);
  constructor(private eventEmitter: EventEmitter2, private m: ModuleRef,) {
    SharedModule.eventEmitter = this.eventEmitter;
    SharedModule.moduleRef = this.m;
  }

  onModuleInit() {
    this.logger.log('SharedModule initialized');
  }

  static getService(service: any) {
    return SharedModule.moduleRef.get(service);
  }
}
