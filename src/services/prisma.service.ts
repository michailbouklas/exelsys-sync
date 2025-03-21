import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '.prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const log: Prisma.LogLevel[] = (process.env.DEBUG === 'DEBUG') ? ['query', 'info', 'warn', 'error']  : ['error'] ;
    super({
      log,
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}