import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';

import axios, { AxiosError } from 'axios';
interface ExelsysConfig {
  host: string;
  Login: string;
  Password: string;
  BusinessEntityName: string;
  maxRetries?: number;
}

@Injectable()
export class ExelsysClientService {

  readonly config: ExelsysConfig;
  private readonly httpService: HttpService;

  constructor() {
    this.config = {
      host: process.env.EXELSYS_HOST || 'https://api.exelsys.com',
      Login: process.env.EXELSYS_LOGIN || '',
      Password: process.env.EXELSYS_PASSWORD || '',
      BusinessEntityName: process.env.EXELSYS_BUSINESS_ENTITY_NAME || '',
      maxRetries: 3
    };

    const axiosInstance = axios.create({
      baseURL: this.config.host,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    });


    this.httpService = new HttpService(axiosInstance);
  }

  async get<T>(url: string, params: any = {}): Promise<T|string> {
    const queryParamsObject = {...params, ...this.config};
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParamsObject)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    }

    const res = await fetch(`${this.config.host}${url}?${searchParams.toString()}`)
    // if there's no json body, return the text
    if (res.headers.get('content-type')?.includes('application/json')) {
      return await res.json();
    }

    return await res.text();
  }

  async post<T>(url: string, body: any, config?: any): Promise<T> {
    body = {...{
      Login: this.config.Login,
        Password: this.config.Password,
        BusinessEntityName: this.config.BusinessEntityName
      }, ...body}

    try {
      const res = await this.httpService.axiosRef.post(`${url}`, body, config);
      return res.data;
    }
    catch (e: any) {
      console.error(`Error calling POST ${url}:`, e);
      throw Error(e);
    }
  }

  async makeRequest<T>(endpoint: string, data: any = {}): Promise<T|null> {
    try {
      // Add authentication to payload
      const payload = {
        ...data,
        Login: this.config.Login,
        Password: this.config.Password,
        BusinessEntityName: this.config.BusinessEntityName
      };

      const response = await this.httpService.post<T>(endpoint, payload).toPromise();
      if (!response) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      throw error;
    }
  }
}
