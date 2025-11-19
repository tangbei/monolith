import axios from 'axios';

/**
 * 重试次数
 */
export const DEFAULT_RETRY_COUNT = 2;

/**
 * 延迟重试时机
 */
export const DEFAULT_RETRY_DELAY = 1000;

/**
   * 默认重试条件
   * @param error 错误对象
   * @param attempt 当前尝试次数
   * @returns 是否应该重试
   */
export const defaultRetryCondition = (error: any, attempt: number): boolean => {
  // 网络错误、超时、5xx服务器错误等可以重试
  if (axios.isCancel(error)) {

    
    return false; // 取消的请求不重试


  }

  // 检查是否是网络错误
  if (!error.response) {
    return true;
  }

  // 检查HTTP状态码
  const status = error.response?.status;
  if (status >= 500 && status < 600) {
    return true; // 服务器错误可以重试
  }

  if (status === 429) {
    return true; // 限流错误可以重试
  }

  // 其他错误不重试
  return false;
}