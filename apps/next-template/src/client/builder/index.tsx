'use client'

import { isClientEnv } from "@/common/utils";
import { builderAPI } from "./api";
import { BuildRouter } from "@/client/router";
import { AntdRegistry } from '@ant-design/nextjs-registry';

type IClientBuilderProps = {
  children: React.ReactNode
};

/**
 * 初始化客户端组件
 * @returns 
 */
const ClientBuilder = ({ children }: Readonly<IClientBuilderProps>) => {

  // 客户端初始化操作
  if (isClientEnv()) {

    builderAPI();

    // TODO
  }

  return (
    <AntdRegistry>
      <BuildRouter>
        {children}
      </BuildRouter>
    </AntdRegistry>
  );
};

export default ClientBuilder;