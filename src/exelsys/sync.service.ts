import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from "@nestjs/schedule";
import {ExelsysService, mapExelsysEmployeeToPrismaUser} from "./exelsys.service";
import {ProgressBar} from "@services/progress-bar";
import {IExelsysEmployeeDetailedResponse} from "./models/user";
import {PrismaService} from "@services/prisma.service";
import {BasePrismaService} from "@services/base-prisma.service";
import {User} from "@prisma/client";

@Injectable()
export class SyncService extends BasePrismaService {
    private readonly logger = new Logger(SyncService.name);
    numberOfWorkers = 8;
    pageSize = 10;

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cronSync() {
        const startTime = new Date();
        await this.startSync();
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        const durationInMinutes = duration / (1000 * 60);
        this.logger.log('Syncing finished. Took ' + durationInMinutes + ' minutes');
    }

    async fetchPage(page: number) {
        const service = new ExelsysService();
        return await service.getEmployees(page, this.pageSize) as unknown as IExelsysEmployeeDetailedResponse[];
    }

    async startSync() {
        // this.logger.log('Syncing started')
        const service = new ExelsysService();
        const counts = await service.getEmployeeCount(1, this.pageSize);
        const progressBar = new ProgressBar(counts.pages);
        let workers = this.numberOfWorkers;
        let percentDone = 0;

        const functions: Array<() => Promise<any>> = [];
        progressBar.update(percentDone, `pages`);
        for (let i = 1; i <= counts.pages; i++) {
            functions.push(async () => {
                try {
                    const records = await this.fetchPage(i);
                    await this.processRecords(records);

                    percentDone = parseFloat(((i / counts.pages) * 100).toFixed(2));

                    progressBar.update(i, 'pages');
                }
                catch (e: any) {
                    this.logger.error(e);
                }

            });
        }


        while (workers > 0) {
            workers--;
            const func = functions.shift();
            if (func) {
                await func();
            }
        }

        while (functions.length > 0) {
            const func = functions.shift();
            if (func) {
                await func();

            }
        }

        progressBar.complete();

        return counts;
    }

    async createUser(record: IExelsysEmployeeDetailedResponse) {
        const convertedRecord = mapExelsysEmployeeToPrismaUser(record);
        const data = this.setupUserRecord(convertedRecord) as User;

        try {
            const res = await this.prisma.user.create({
                data
            });

            // this.logger.log(`User created: ${res.employeeCode}`);

            return res;
        }
        catch (e: any) {
            this.logger.error(e);
        }
    }

    async updateUser(record: IExelsysEmployeeDetailedResponse) {
        const convertedRecord = mapExelsysEmployeeToPrismaUser(record);
        try {
            await this.prisma.user.update({
                // @ts-ignore
                where: {
                    employeeCode: record.EmployeeCode
                },
                data: this.setupUserRecord(convertedRecord)
            });
            // this.logger.log(`User updated: ${record.EmployeeCode}`);
        }
        catch (e: any) {
            this.logger.error(e);
        }
    }

    private async processRecords(records: IExelsysEmployeeDetailedResponse[]) {
        for (let idx = 0; idx < records.length; idx++) {
            // check if the user exists or not
            const record = records[idx];

            const user = await this.prisma.user.findUnique({
                // @ts-ignore
                where: {
                    employeeCode: record.EmployeeCode
                }
            });

            if (user) {
                // update the user
                try {
                    await this.updateUser(record);
                }
                catch (e: any) {
                    this.logger.error(e);
                }

                continue;
            }

            try {
                await this.createUser(record);
            }
            catch (e: any) {
                this.logger.error(e);
            }

        }

    }

    setupUserRecord(record: Partial<User>) {
        return {
            employeeCode: record.employeeCode,
            namePrefix: record.namePrefix,
            firstName: record.firstName,
            lastName: record.lastName,
            email: record.email,
            status: record.status,
            employmentDate: record.employmentDate,
            terminationDate: record.terminationDate,
            terminationReasonCode: record.terminationReasonCode,
            jobTitle: record.jobTitle,
            gender: record.gender,
            birthDate: record.birthDate,
            department: record.department,
            departmentCode: record.departmentCode,
            departmentLocation: record.departmentLocation,
            phoneNo: record.phoneNo,
            phoneNo2: record.phoneNo2,
            mobilePhone: record.mobilePhone,
            identityCardNo: record.identityCardNo,
            employeeGrade: record.employeeGrade,
            employeeManager: record.employeeManager,
            employeeManagerCode: record.employeeManagerCode,
            yearsOfService: record.yearsOfService,
            age: record.age,
            pictureId: record.pictureId,
            createdBy: record.createdBy,
            updatedBy: record.updatedBy,
            initials: record.initials,
            externalId: record.externalId,
        } as User;
    }
}
