import { setupClientApiInterceptors } from "@/common/apis/interceptors/clientInterceptors";

let _isCreate = false;

/** 初始化接口配置 */
export const builderAPI = () => {

  if (_isCreate) {
    return;
  }

  _isCreate = true;

  // TODO

  setupClientApiInterceptors();
  
};