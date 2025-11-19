import { request } from "../request";
import type { AxiosResponse, InternalAxiosRequestConfig, RequestConfig } from '@tanggoat/request';
import type { TBResponse } from "../types";

const requestInterceptors = (config: RequestConfig) => {
  console.log('client实例请求拦截config', config);
  config.headers = {
    ...config.headers,
  } as unknown as InternalAxiosRequestConfig['headers'];
  return config;
}

const responseInterceptors = <T>(res: AxiosResponse<TBResponse<T>>) => {
  console.log('client实例响应拦截res', res);
  return res;
}

/**
 * client层网络拦截
 */
export const setupClientApiInterceptors = () => {
  
  // 使用 @tanggoat/request 库的正确方式设置拦截器
  request.setRequestInterceptor(requestInterceptors);
  
  request.setResponseInterceptor(
    responseInterceptors,
      (error: any) => {
      console.log('client实例响应拦截error', error);
    }
  );
};