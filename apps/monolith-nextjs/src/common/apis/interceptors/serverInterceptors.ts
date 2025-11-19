import { request } from "../request";
import type { AxiosResponse, InternalAxiosRequestConfig, RequestConfig } from '@tanggoat/request';
import type { TBResponse } from "../types";

const requestInterceptors = (config: RequestConfig) => {
  // console.log('server实例请求拦截config', config);
  config.headers = {
    ...config.headers,
  } as unknown as InternalAxiosRequestConfig['headers'];
  return config;
}

const responseInterceptors = <T>(res: AxiosResponse<TBResponse<T>>) => {
  // console.log('server实例响应拦截res', res);
  return res;
}

/**
 * server层的网络请求拦截
 */
export const setupServerApiInterceptors = () => {

  request.setRequestInterceptor(requestInterceptors);
  request.setResponseInterceptor(responseInterceptors);
};