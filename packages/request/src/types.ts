import type { AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

export interface RequestInterceptors<T> {
  // 请求拦截
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;

  requestInterceptorsCatch?: (err: any) => any;
  
  // 响应拦截
  responseInterceptors?: (res: T) => T;

  responseInterceptorsCatch?: (err: any) => any;
}

// 自定义传入的参数
export interface CreateRequestConfig<T = AxiosResponse> extends CreateAxiosDefaults {
  interceptors?: RequestInterceptors<T>;
}

// 重试配置
export type IRetryConfig = {
  retryCount?: number;        // 重试次数，默认2次
  retryDelay?: number;        // 重试延迟时间(毫秒)，默认1000ms
  retryCondition?: (error: any, attempt: number) => boolean; // 重试条件
}
export interface RequestConfig<T = AxiosResponse> extends InternalAxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
  noRepeatRequest?: boolean;
  retryConfig?: IRetryConfig | boolean;
}

export type { AxiosResponse, InternalAxiosRequestConfig };

