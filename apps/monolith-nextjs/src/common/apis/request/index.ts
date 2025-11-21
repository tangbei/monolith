import Request, { to } from '@tanggoat/request';
import type { InternalAxiosRequestConfig, RequestConfig } from '@tanggoat/request';
import type { TBResponse } from '../types';

// 重写返回类型
interface TBRequestConfig<D, T> extends Omit<RequestConfig<TBResponse<T>>, 'headers'> {
  headers?: InternalAxiosRequestConfig['headers'],
  data?: D
}

export const request = new Request({
  baseURL: 'https://m1.apifoxmock.com/m1/5839312-5525048-default',
  timeout: 20 * 1000,
  headers: {
    'X-Apispace-Token': 'vbik3r8q7nmm1pi08gtt0eppd3xhegdz'
  },
  // interceptors: {
  //   requestInterceptors,
  //   responseInterceptors,
  // }
});

/**
 * 请求方法
 * @param config 请求配置
 *  - D 请求数据
 *  - T 响应数据
 * @returns 请求结果
 */
const TBRequest = <D, T>(config: TBRequestConfig<D, T>) => {
  const method = config.method?.toLowerCase() || 'get';
  if (method === 'get' && config.data) {
    config.params = config.data;
  }
  return to<TBResponse<T>, Error>(request.request<TBResponse<T>>({
    ...config,
    headers: config?.headers || {} as InternalAxiosRequestConfig['headers']
  }));
};
 
export default TBRequest;