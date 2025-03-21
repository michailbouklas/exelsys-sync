import { PrismaService } from '@services/prisma.service';

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    pages: number;
    page: number;
    count: number;
    limit: number;
    offset: number;
  }
}

export class BasePrismaService {
  protected prisma: PrismaService
  constructor() {
    this.prisma = new PrismaService();
  }

  formatResultToPaginatedResponse(result: any, count: number, limit: number, offset: number): IPaginatedResponse<any> {
    const pages = Math.ceil(count / limit);
    const page = Math.ceil(offset / limit) + 1;
    return {
      data: result,
      meta: {
        pages,
        page,
        count,
        limit,
        offset,
      }
    }
  }
}