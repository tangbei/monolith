import { Spin } from "antd";
import type { SpinProps } from "antd";
import type { ReactNode } from "react";
import classNames from "classnames";

import style from "./index.module.scss";

export interface ILoadingWrapperProps extends Omit<SpinProps, "children"> {
  /**
   * 是否显示内容
   *
   * @default false
   */
  showContent?: boolean
  /**
   * 加载图标大小
   *
   * @default 'large'
   */
  size?: SpinProps["size"]
  /**
   * 子元素
   * - 支持 ReactNode 或返回 ReactNode 的函数
   */
  children?: ReactNode | (() => ReactNode)
}

/**
 * 加载中状态包装器
 * @returns 
 */
const LoadingWrapper = (props: ILoadingWrapperProps) => {
  const { showContent = false, children, className, size = "large", ...spinProps } = props

  // 如果不显示内容，渲染加载状态
  if (!showContent) {
    return (
      <div className={classNames(style['loading-wrapper'], className)}>
        <Spin {...spinProps} size={size} />
      </div>
    )
  };

  return typeof children === "function" ? children() : children;
};

export default LoadingWrapper;