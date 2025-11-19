"use client";

import { ConfigProvider, App } from "antd";
import { ReactNode } from "react";

interface AntdProviderProps {
  children: ReactNode;
}

// Ant Design 主题配置
const theme = {
  token: {
    // 主色
    colorPrimary: '#1890ff',
    // 圆角
    borderRadius: 6,
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    },
  },
};

export const AntdProvider = ({ children }: AntdProviderProps) => {
  return (
    <ConfigProvider theme={theme}>
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
};


