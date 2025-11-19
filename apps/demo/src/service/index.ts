import type { AxiosResponse, InternalAxiosRequestConfig, RequestConfig } from '@tanggoat/request';
import Request from '@tanggoat/request';

type TBResponse<T> = {
  code: number;
  message: string;
  data: T;
};

// 重写返回类型
interface TBRequestConfig<D, T> extends Omit<RequestConfig<TBResponse<T>>, 'headers'> {
  headers?: InternalAxiosRequestConfig['headers'],
  data?: D
}

const requestInterceptors = (config: RequestConfig) => {
  // console.log('实例请求拦截config', config);
  config.headers = {
    ...config.headers,
  } as unknown as InternalAxiosRequestConfig['headers'];
  return config;
}

const responseInterceptors = <T>(response: AxiosResponse<TBResponse<T>>) => {
  // console.log('实例响应拦截res', res);
  return response;
}

const request = new Request({
  baseURL: 'https://eolink.o.apispace.com',
  timeout: 10000,
  headers: {
    'X-Apispace-Token': 'vbik3r8q7nmm1pi08gtt0eppd3xhegdz'
  },
  // interceptors: {
  //   requestInterceptors,
  //   responseInterceptors,
  // }
});

// 使用动态设置拦截器方法
request.setRequestInterceptor(requestInterceptors);
request.setResponseInterceptor(responseInterceptors);

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
  return request.request<TBResponse<T>>({
    ...config,
    headers: config?.headers || {} as InternalAxiosRequestConfig['headers']
  });
};
 
export default TBRequest;