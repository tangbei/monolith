import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { mergeUrlQuery } from "@/common/utils";

/** 导航选项 */
export interface INavigateOptions extends NavigateOptions {
  /** 路由路径 */
  path: string
  /** 查询参数 */
  query?: Record<string, any>
}

/** 导航参数 */
export type TNavigateParams = INavigateOptions | string;

/** 导航方法 */
export type TNavigate = (options: TNavigateParams) => void;

export const useNavigate = () => {
  /** HOOKS: 使用路由导航 */
  const { push: _push, replace: _replace, ...restMethods } = useRouter();

  /**
   * 使用路由导航
   * @param options 导航参数
   * @param replace 是否替换当前历史记录
   * @returns 
   */
  const _navigate = useCallback((options: TNavigateParams, replace: boolean) => {
    /** 导航方法 */
    const _navigateFn = replace ? _replace : _push;
    // 如果参数是字符串，直接导航
    if (typeof options === "string") {
      _navigateFn(options)
    } else {
      const { path, query = {}, ...rest } = options;
      _navigateFn(mergeUrlQuery(path, query), rest);
    }
  }, [_push, _replace]);

  /**
   * 导航至目标路由 新增一条历史记录
   */
  const push: TNavigate = useCallback((options) => {

    _navigate(options, false)

  }, [_navigate]);

  /**
   * 导航至目标路由 替换当前历史记录
   */
  const replace: TNavigate = useCallback((options) => {

    _navigate(options, true)

  }, [_navigate]);

  return {
    _navigate,
    push,
    replace
  }
};