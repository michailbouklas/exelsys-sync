import { Injectable } from '@nestjs/common';
import { ExelsysClientService } from './exelsys-client.service';

export interface IExelsysNumberOfEmployeePagesResponse {
  d: number;
}

export interface IExelsysEmployee {
  TerminationReasonCode?: string;
  ParentDepartmentCode?: string;
  PayrollCompanyNo?: string;
  ID: number;
  FirstName: string;
  LastName: string;
  EmployeeCode: string;
  Status: string;
  Department?: string;
  DepartmentCode?: string;
  EmploymentDate?: Date;
  TerminationDate?: Date | null;
  Email?: string;
  MobilePhone?: string;
  // Additional properties can be added as needed
}

export interface IExelsysEmployeeResponse {
  ArrayOfEmployeeWSI: {
    EmployeeWSI: IExelsysEmployee[] | IExelsysEmployee;
  };
}

@Injectable()
export class ExelsysService {
  client: ExelsysClientService;

  onApplicationBootstrap() {
    setTimeout(async () => {
      const s = new ExelsysService();
      // const res = await s.getEmployeeCount();
      const res = await s.getEmployees();
      // const res = await s.userLogin('michail.bouklas@phc','Magicj1978!@');
      // console.log(res.filter(e => e.Status === 'Active').length);


    });
  }


  constructor() {
    this.client = new ExelsysClientService();
  }

  async getEmployeeCount(Page = 1, PageSize = 10) {
    const numberOfPages = await this.client.post<IExelsysNumberOfEmployeePagesResponse>('GetTAEmployeePages', {
      Page,
      PageSize,
      IsActive: true
    });
    return {
      count: numberOfPages.d * PageSize,
      pages: numberOfPages.d,
      pageSize: PageSize,
      page: Page
    };
  }

  async getEmployees(Page = 1, PageSize = 10, EmployeeCode = '', DepartmentCode = '', pFromDate = '2000-01-01', EmployeeFillType = 'Detailed') {
    const res = await this.client.get<IExelsysEmployeeDetailedResponse[]>(`GetEmployeesPaged`, {Page, PageSize, EmployeeCode, DepartmentCode, pFromDate, EmployeeFillType});
    if (typeof res !== 'string') {
      return [];
    }

    return getEmployeesFromXml(res);
  }

  async userLogin(username: string, password: string) {
      try {
        const res = await fetch(`${process.env.EXELSYS_HOST}UserLogin?Login=${username}&Password=${password}&BusinessEntityName=${process.env.EXELSYS_BUSINESS_ENTITY_NAME}&SSO=false`, {
          method: 'GET',

        });

        const xmlText = await res.text();
        const xml2JsResponse =  await parseXmlToUserLoginResponse(xmlText);
        return xml2JsResponse.LoginUserWSI;
      }
      catch (e) {
        console.log(e)
      }
    // return await this.client.post('UserLogin', {Login: username, Password: password});
  }
}


import { parseString } from 'xml2js';
import {IExelsysEmployeeDetailedResponse, IUserLoginResponse} from './models/user';
import {User} from "@prisma/client";

/**
 * Converts XML response from Exelsys API to a typed JavaScript object
 * @param xmlString The XML string from the API response
 * @returns Promise with parsed IUserLoginResponse object
 */
export async function parseXmlToUserLoginResponse(xmlString: string): Promise<IUserLoginResponse> {
  return new Promise((resolve, reject) => {
    parseString(xmlString, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      // Transform boolean strings to actual booleans
      const transformBooleans = (obj: any) => {
        for (const key in obj) {
          if (obj[key] === 'true' || obj[key] === 'false') {
            obj[key] = obj[key] === 'true';
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            transformBooleans(obj[key]);
          }
        }
        return obj;
      };

      // Convert numeric strings to numbers
      const transformNumbers = (obj: any) => {
        for (const key in obj) {
          if (key === 'LanguageID' && !isNaN(Number(obj[key]))) {
            obj[key] = Number(obj[key]);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            transformNumbers(obj[key]);
          }
        }
        return obj;
      };

      // Process array fields that might come as single objects
      const ensureArrays = (obj: any) => {
        if (obj.LoginUserWSI?.PendingNotifications?.ItemStringKeyValue &&
          !Array.isArray(obj.LoginUserWSI.PendingNotifications.ItemStringKeyValue)) {
          obj.LoginUserWSI.PendingNotifications.ItemStringKeyValue =
            [obj.LoginUserWSI.PendingNotifications.ItemStringKeyValue];
        }

        // Process DataKeyValue arrays in each ItemStringKeyValue
        const notifications = obj.LoginUserWSI?.PendingNotifications?.ItemStringKeyValue;
        if (Array.isArray(notifications)) {
          notifications.forEach(item => {
            if (item.data?.DataKeyValue && !Array.isArray(item.data.DataKeyValue)) {
              item.data.DataKeyValue = [item.data.DataKeyValue];
            }
          });
        }

        return obj;
      };

      // Apply all transformations
      const transformedResult = ensureArrays(transformNumbers(transformBooleans(result)));
      resolve(transformedResult as IUserLoginResponse);
    });
  });
}

/**
 * Parses XML employee data from Exelsys API into a structured JavaScript object
 * @param xmlString The XML string from the API response
 * @returns Promise with parsed employee data
 */
export async function parseXmlToEmployees(xmlString: string): Promise<IExelsysEmployee[]> {
  return new Promise((resolve, reject) => {

    parseString(xmlString, {
      explicitArray: false,
      mergeAttrs: true,
      // @ts-ignore
      explicitNullMapping: true
    }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      // Handle the case where there might be one or multiple employees
      let employees: IExelsysEmployee[] = [];
      if (result.ArrayOfEmployeeWSI && result.ArrayOfEmployeeWSI.EmployeeWSI) {
        if (Array.isArray(result.ArrayOfEmployeeWSI.EmployeeWSI)) {
          employees = result.ArrayOfEmployeeWSI.EmployeeWSI;
        } else {
          employees = [result.ArrayOfEmployeeWSI.EmployeeWSI];
        }
      }

      // Transform data types
      employees = employees.map(employee => {
        // Convert numeric strings to numbers
        if (typeof employee.ID === 'string') {
          employee.ID = parseInt(employee.ID, 10);
        }

        // Convert date strings to Date objects
        if (employee.EmploymentDate && typeof employee.EmploymentDate === 'string') {
          employee.EmploymentDate = new Date(employee.EmploymentDate);
        }

        // @ts-ignore
        if (employee.TerminationDate && employee.TerminationDate !== 'nil' &&
          typeof employee.TerminationDate === 'string') {
          employee.TerminationDate = new Date(employee.TerminationDate);
        } else {
          employee.TerminationDate = null;
        }

        // Convert boolean strings to actual booleans
        for (const key in employee) {
          if (employee[key] === 'true' || employee[key] === 'false') {
            employee[key] = employee[key] === 'true';
          }
        }

        // Handle specific fields like email (could be in different fields)
        employee.Email = employee['eMail'] || employee['WorkEMail'] || '';

        return employee;
      });

      resolve(employees);
    });
  });
}

export async function getEmployeesFromXml(xmlString: string): Promise<IExelsysEmployee[]> {
  try {
    const employees = await parseXmlToEmployees(xmlString);
    return employees;
  } catch (error) {
    console.error('Error parsing employee XML:', error);
    return [];
  }
}


/**
 * Converts an Exelsys employee object to the format used by the Prisma User model
 * @param employee The source Exelsys employee data
 * @returns An object with properties matching the Prisma User model
 */
export function mapExelsysEmployeeToPrismaUser(employee: IExelsysEmployeeDetailedResponse): Partial<User> {
  // Extract values from nested properties
  const mainAddress = employee.MainAddress || {};

  // Convert date strings to Date objects where applicable
  const parseDate = (dateStr?: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? undefined : date;
    } catch (e) {
      return undefined;
    }
  };

  // Convert string numbers to integers
  const parseInteger = (value?: string): number | undefined => {
    if (!value) return undefined;
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
  };

  // Get email from various possible sources
  const email = employee.WorkEMail || employee.eMail || mainAddress.eMail || '';

  return {
    externalId: employee.ID,
    employeeCode: employee.EmployeeCode,
    namePrefix: employee.NamePrefix,
    firstName: employee.FirstName,
    lastName: employee.LastName,
    initials: employee.Initials,
    email: email,
    jobTitle: employee.JobTitle,
    gender: employee.Gender,
    birthDate: parseDate(employee.BirthDate),
    status: employee.Status,
    employmentDate: parseDate(employee.EmploymentDate),
    terminationDate: typeof employee.TerminationDate === 'object' ? undefined : parseDate(employee.TerminationDate as any),
    terminationReasonCode: employee.TerminationReasonCode,

    departmentCode: employee.DepartmentCode,
    department: employee.Department,
    departmentLocation: employee.DepartmentLocation,

    phoneNo: employee.PhoneNo || mainAddress.PhoneNo,
    phoneNo2: employee.PhoneNo2 || mainAddress.PhoneNo2,
    mobilePhone: employee.MobilePhone || mainAddress.MobilePhone,

    identityCardNo: employee.IdentityCardNo,
    employeeGrade: employee.EmployeeGrade,
    employeeManager: employee.EmployeeManager,
    employeeManagerCode: employee.EmployeeManagerCode,

    yearsOfService: parseInteger(employee.YearsOfService),
    age: parseInteger(employee.Age),
    pictureId: employee.PictureID,

    createdBy: employee.CreatedBy,
    updatedBy: employee.UpdatedBy
  };
}