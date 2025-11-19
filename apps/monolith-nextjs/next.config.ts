import type { NextConfig } from "next/types";
import path from "path";

const { NEXT_PUBLIC_BASE_PATH, OUT_DIR  } = process.env;

const nextConfig: NextConfig = {
  basePath: NEXT_PUBLIC_BASE_PATH,
  distDir: OUT_DIR,

  experimental: {
    // 选项将来自浏览器的控制台输出和运行时错误转发到开发服务器终端
    browserDebugInfoInTerminal: true,
  },


  // Scss 配置
  sassOptions: {
    // 指定 Scss 编译器的实现
    // implementation: "sass-embedded",
    // Scss 全局引入
    // additionalData: `
    //     @use "./src/common/styles/scss-var.scss" as *;
    //     @use "./src/common/styles/mixins/index.scss" as *;
    //     @use "./src/common/styles/funs/index.scss" as *;
    // `
  },
};

export default nextConfig;
