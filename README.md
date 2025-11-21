# Monolith 全能型项目仓库

一个集成了个人博客、NPM 包和测试项目的全能型 Monorepo 仓库。

## 项目结构

```
.
├── apps                    # 应用目录
│   ├── demo               # 基于 Vite 的 React 示例应用
│   └── monolith-nextjs    # 基于 Next.js 的 SSR 模板项目
├── packages               # NPM 包目录
│   └── request            # 基于 Axios 的 TypeScript HTTP 请求库
├── scripts                # 脚本目录
└── .changeset             # Changeset 配置和变更集
```

## 技术栈

- 包管理器: pnpm
- 构建工具: Vite (demo应用), 自定义构建脚本 (Next.js应用)
- 核心框架: React 19
- 语言: TypeScript
- 打包工具: tsup (用于 NPM 包)

## 项目组件

### 1. @tanggoat/request (NPM 包)

一个基于 Axios 的 TypeScript HTTP 请求库，提供以下特性：
- 统一的请求和响应拦截器
- TypeScript 类型支持
- 易于扩展的 API 设计

### 2. demo 应用

基于 Vite 和 React 19 的示例应用，用于演示和测试各种功能。

### 3. monolith-nextjs 应用

基于 Next.js 的服务端渲染(SSR)模板项目，包含：
- 多页面路由
- MDX 支持
- Ant Design 组件库集成
- 国际化(i18n)支持

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动应用

启动 demo 应用:
```bash
pnpm --filter demo dev
```

启动 Next.js 应用:
```bash
pnpm --filter monolith-nextjs dev
```

### 构建项目

构建 demo 应用:
```bash
pnpm --filter demo build
```

构建 Next.js 应用:
```bash
pnpm --filter monolith-nextjs build
```

构建 request 包:
```bash
pnpm --filter @tanggoat/request build
```

## 发布流程

项目采用 Changesets 管理版本和发布流程，通过自定义脚本简化发布操作：

```bash
pnpm published
```

该命令会引导您选择发布模式：
- Production (正式发布)
- Prerelease (预发布 beta 版本)

有关发布脚本的详细使用说明，请参阅 [scripts/scripts.md](./scripts/scripts.md)。

### 发布要求

1. Node.js >= 20.0.0
2. pnpm >= 10.0.0
3. npm registry 访问权限

## 许可证

本项目采用 MIT 许可证。