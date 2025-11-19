import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import type { CreateRequestConfig, IRetryConfig, RequestConfig, RequestInterceptors } from './types';
import { DEFAULT_RETRY_COUNT, DEFAULT_RETRY_DELAY, defaultRetryCondition } from './util';

class Request {
  instance: AxiosInstance;

  interceptors: RequestInterceptors<AxiosResponse>;
  // 记录每次请求的对象
  abortControllerMap: Map<string, AbortController>;
  // 记录每个 URL 最近一次被允许通过的时间戳（毫秒）
  private lastAcceptedAt: Map<string, number>;
  // 重复请求的限制时间,单位为毫秒
  private REPEAT_LIMIT_TIME = 2000;

  constructor(config: CreateRequestConfig) {
    this.instance = axios.create(config);
    // 初始化存放取消请求控制器Map
    this.abortControllerMap = new Map();
    this.lastAcceptedAt = new Map();
    this.interceptors = config.interceptors || {};

    // 拦截器执行顺序:接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
    this.requestInterceptors();
    this.responseInterceptors();
  }

  /**
   * 接口请求拦截器
   */
  requestInterceptors() {
    // 清除现有的实例拦截器（保留全局拦截器）
    this.instance.interceptors.request.clear();
    
    // 全局请求拦截器
    this.instance.interceptors.request.use((requestConfig: RequestConfig) => {
      // console.log('全局请求拦截器request', request);
      const abortController = new AbortController();
      const url = requestConfig.url || '';
      requestConfig.signal = abortController.signal;
      this.abortControllerMap.set(url, abortController);
      // 重复请求处理
      this.cancelRepeatRequest(requestConfig);
      return requestConfig;
    }, error => {
      return Promise.reject(error);
    });

    // 实例请求拦截器
    if (this.interceptors?.requestInterceptors) {
      this.instance.interceptors.request.use(
        this.interceptors.requestInterceptors,
        this.interceptors?.requestInterceptorsCatch
      );
    }
  }

  /**
   * 接口响应拦截器
   */
  responseInterceptors() {
    // 清除现有的实例拦截器（保留全局拦截器）
    this.instance.interceptors.response.clear();
    
    // 实例响应拦截器
    if (this.interceptors?.responseInterceptors) {
      this.instance.interceptors.response.use(
        this.interceptors.responseInterceptors,
        this.interceptors?.responseInterceptorsCatch
      );
    }

    // 全局响应拦截器
    this.instance.interceptors.response.use((response: AxiosResponse) => {
      // console.log('全局响应拦截器response', response);
      const url = response.config.url || '';
      this.abortControllerMap.delete(url);
      return response.data;
    }, (error: any) => {
      // 响应异常时候就从pendingRequest对象中移除请求
      const url = error.config?.url || '';
      this.abortControllerMap.delete(url);
      
      return Promise.reject(error);
    });
  }

  request<T>(config: RequestConfig<T>): Promise<T> {
    // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
    if (config.interceptors?.requestInterceptors) {
      config = config.interceptors.requestInterceptors(config as any)
    }
    // 检查是否需要自动重试
    if (config.retryConfig) {
      return this.executeWithRetry(config);
    } else {
      // 不需要重试，直接执行请求
      return this.executeRequest(config);
    }
  }

  /**
   * 执行单次请求
   */
  private executeRequest<T>(config: RequestConfig<T>): Promise<T> {
    return this.instance
      .request<any, T>(config)
      .then(res => {
        // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
        if (config.interceptors?.responseInterceptors) {
          return config.interceptors.responseInterceptors(res);
        }
        return res;
      })
      .catch(err => {
        console.log('executeError:', err);
        throw err;
      });
  }

  /**
   * 执行带重试的请求
   */
  private executeWithRetry<T>(config: RequestConfig<T>): Promise<T> {
    const { retryCount = DEFAULT_RETRY_COUNT, retryDelay = DEFAULT_RETRY_DELAY, retryCondition } = config.retryConfig! as IRetryConfig;
    let attempt = 0;
    const attemptRequest = (): Promise<T> => {
      attempt++;
      return this.executeRequest(config)
        .then(result => result)
        .catch(error => {
          // 检查是否应该重试，如果有配置重试条件则优先，否则使用默认重试条件
          const shouldRetry = retryCondition 
            ? retryCondition(error, attempt)
            : defaultRetryCondition(error, attempt);

          if (shouldRetry && attempt < retryCount) {
            console.log(`请求失败，${retryDelay}ms后进行第${attempt + 1}次重试...`);
            // 延迟重试
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(attemptRequest());
              }, retryDelay);
            });
          } else {
            // 重试次数用完或不需要重试，抛出错误
            console.log(`重试${attempt}次后仍然失败，停止重试`);
            throw error;
          }
        });
    };

    return attemptRequest();
  }

  /**
   * 取消重复请求
   * @param requestConfig 
   * 前提有配置: noRepeatRequest = true
   */
  cancelRepeatRequest(requestConfig: RequestConfig) {
    // 若显式要求不允许重复请求，则应用在指定毫秒窗口：窗口期内仅允许第一条，其余取消
    if (requestConfig.noRepeatRequest && requestConfig?.url) {
      const now = Date.now();
      const last = this.lastAcceptedAt.get(requestConfig.url) || 0;
      if (now - last < this.REPEAT_LIMIT_TIME) {
        // 在 指定秒内 的重复请求：取消当前这次
        this.cancelRequest(requestConfig.url);
        throw new axios.CanceledError(`${requestConfig.url} 在 2 秒内重复请求，已取消`);
      }
      // 记录放行时间
      this.lastAcceptedAt.set(requestConfig.url, now);
    }
  }

  /**
   * 取消指定请求
   * @param url 请求地址
   */
  cancelRequest(url: string | string[]) {
    const urlList = Array.isArray(url) ? url : [url];
    for (const _url of urlList) {
      this.abortControllerMap.get(_url)?.abort();
      this.abortControllerMap.delete(_url);
    }
  }

  /**
   * 取消全部请求
   */
  cancelAllRequest() {
    this.abortControllerMap.forEach(abortController => {
      abortController.abort();
    });
    this.abortControllerMap.clear();
  }

  /**
   * 动态设置请求拦截器
   * @param onFulfilled 请求成功拦截器
   * @param onRejected 请求失败拦截器
   */
  setRequestInterceptor(
    onFulfilled?: (config: RequestConfig) => RequestConfig,
    onRejected?: (error: any) => any
  ) {
    if (onFulfilled) {
      this.interceptors.requestInterceptors = onFulfilled;
    }
    if (onRejected) {
      this.interceptors.requestInterceptorsCatch = onRejected;
    }
    
    // 重新设置拦截器
    this.requestInterceptors();
  }

  /**
   * 动态设置响应拦截器
   * @param onFulfilled 响应成功拦截器
   * @param onRejected 响应失败拦截器
   */
  setResponseInterceptor(
    onFulfilled?: (response: AxiosResponse) => AxiosResponse,
    onRejected?: (error: any) => any
  ) {
    if (onFulfilled) {
      this.interceptors.responseInterceptors = onFulfilled;
    }
    if (onRejected) {
      this.interceptors.responseInterceptorsCatch = onRejected;
    }
    
    // 重新设置拦截器
    this.responseInterceptors();
  }

  /**
   * 清除所有拦截器
   */
  clearInterceptors() {
    this.interceptors = {};
    // 重新设置拦截器（只保留全局拦截器）
    this.requestInterceptors();
    this.responseInterceptors();
  }
}

export default Request;
