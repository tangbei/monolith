# Tang Next.js Template

一个基于 Next.js 15 的现代化 SSR 项目模板，集成了 Ant Design、TypeScript、Sass 等现代前端技术栈。

## ✨ 特性

- 🚀 **Next.js 15** - 最新的 App Router 架构
- ⚛️ **React 19** - 最新的 React 特性
- 🎨 **Ant Design 5** - 企业级 UI 组件库
- 📝 **TypeScript** - 类型安全的 JavaScript
- 🎯 **Sass** - CSS 预处理器
- 🔧 **自定义 CLI** - 基于 Node.js 的构建工具
- 🌐 **SSR/SSG** - 服务端渲染和静态生成
- 📱 **响应式设计** - 移动端适配
- 🎭 **主题定制** - 支持 Ant Design 主题定制
- 🔄 **智能 Loading** - 页面切换加载动画
- 🛡️ **路由守卫** - 登录状态管理
- 📦 **模块化架构** - 清晰的代码组织

## 🏗️ 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── about/             # 关于页面
│   ├── products/[id]/     # 动态路由
│   └── loading.tsx        # 全局加载组件
├── client/                # 客户端组件
│   ├── builder/           # 客户端构建器
│   ├── components/        # 客户端组件
│   ├── hooks/             # 自定义 Hooks
│   └── router/            # 路由相关
├── server/                # 服务端组件
│   ├── builder/           # 服务端构建器
│   └── components/        # 服务端组件
├── common/                # 公共模块
│   ├── apis/              # API 接口
│   ├── styles/            # 全局样式
│   ├── utils/             # 工具函数
│   └── images/            # 图片资源
└── styles/                # 样式文件
    └── globals.scss       # 全局样式
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0
- pnpm >= 10.0.0

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 访问应用
open http://localhost:3000
```

### 构建生产版本

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 代码检查

```bash
# 运行 ESLint
pnpm lint
```

## 🛠️ 技术栈

### 核心框架
- **Next.js 15.5.4** - React 全栈框架
- **React 19.2.0** - 用户界面库
- **TypeScript 5** - 类型安全的 JavaScript

### UI 组件
- **Ant Design 5.25.3** - 企业级 UI 组件库
- **Sass 1.89.0** - CSS 预处理器

### 开发工具
- **ESLint 9** - 代码质量检查
- **@types/node** - Node.js 类型定义
- **@types/react** - React 类型定义

### 自定义工具
- **@tanggoat/request** - 自定义 HTTP 请求库
- **classnames** - CSS 类名工具
- **query-string** - URL 查询参数解析

## 📖 使用指南

### 页面开发

```tsx
// app/page.tsx
"use client";

import { Button } from "antd";

export default function HomePage() {
  return (
    <div>
      <h1>欢迎使用 Tang Next.js Template</h1>
      <Button type="primary">开始使用</Button>
    </div>
  );
}
```

### API 接口

```typescript
// common/apis/modules/clientApi.ts
import TBRequest from "@/common/apis/request";

export const getUserInfo = (params: any) => {
  return TBRequest({
    url: '/api/user',
    method: 'get',
    data: params,
  });
};
```

### 样式编写

```scss
// styles/globals.scss
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// 使用 Sass 变量
$primary-color: #1890ff;
$border-radius: 6px;
```

### 路由配置

```typescript
// 静态路由
app/page.tsx          // /
app/about/page.tsx    // /about

// 动态路由
app/products/[id]/page.tsx  // /products/123
```

## 🎨 主题定制

### Ant Design 主题

```typescript
// client/builder/index.tsx
import { ConfigProvider } from "antd";

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
};

<ConfigProvider theme={theme}>
  {children}
</ConfigProvider>
```

### 全局样式

```scss
// styles/globals.scss
:root {
  --primary-color: #1890ff;
  --text-color: #333;
  --bg-color: #f5f5f5;
}
```

## 🔧 配置说明

### Next.js 配置

```typescript
// next.config.ts
import type { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  // 配置选项
};

export default nextConfig;
```

### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📱 功能特性

### 智能 Loading
- 页面切换时自动显示加载动画
- 智能检测页面加载完成
- 支持最小/最大加载时间配置

### 路由守卫
- 登录状态检查
- 权限控制
- 自动重定向

### 响应式设计
- 移动端适配
- 断点管理
- 弹性布局

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**TangGoat**
- GitHub: [@tanggoat](https://github.com/tanggoat)

## 🙏 致谢

感谢以下开源项目的支持：
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [TypeScript](https://www.typescriptlang.org/)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！