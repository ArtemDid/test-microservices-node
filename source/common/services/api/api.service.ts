/* eslint-disable @typescript-eslint/ban-types */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiService {
  protected instance: AxiosInstance;

  private host: string;

  constructor(host: string) {
    this.host = host;
    this.instance = axios.create();
  }

  protected async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.get(`${this.host}${url}`, config);
  }

  protected async post(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.post(`${this.host}${url}`, data, config);
  }

  protected async put(url: string, data?: object): Promise<AxiosResponse> {
    return this.instance.put(`${this.host}${url}`, data);
  }

  protected async delete(url: string, data?: object): Promise<AxiosResponse> {
    return this.instance.delete(`${this.host}${url}`, { data });
  }

  protected async patch(url: string, data?: object): Promise<AxiosResponse> {
    return this.instance.patch(`${this.host}${url}`, data);
  }
}
