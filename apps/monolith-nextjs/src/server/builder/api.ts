import { setupServerApiInterceptors } from "@/common/apis/interceptors/serverInterceptors";

// 是否初始化
let _isCreate = false;

/**
 * 初始化接口配置
 * @returns 
 */
export const builderAPI = () => {

  if (_isCreate) {
    return;
  }

  _isCreate = true;

  // TODO

  setupServerApiInterceptors();
};