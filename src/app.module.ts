import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@shared/shared.module';
import { ScheduleModule } from '@nestjs/schedule';
import cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from '@shared/logger.config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExelsysModule } from './exelsys/exelsys.module';

@Module({
  imports: [
    SharedModule,
    ScheduleModule.forRoot(),
    WinstonModule.forRoot(loggerConfig),
    ExelsysModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

  ],
  exports: [
  ]
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);
  public static eventEmitter: EventEmitter2;
  constructor(private eventEmitter: EventEmitter2) {
    AppModule.eventEmitter = this.eventEmitter;
  }
  onModuleInit() {
    this.logger.log('AppModule initialized');
  }

}
