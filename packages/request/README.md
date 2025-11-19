# @tanggoat/request

一个基于 Axios 的 TypeScript HTTP 请求库，提供强大的拦截器、自动重试、请求去重与取消能力，且对类型推断友好。

## ✨ 特性

- 🚀 基于 Axios，稳定可靠
- 🔧 完整 TypeScript 类型定义
- 🧱 拦截器链：全局 + 实例 + 单请求三级拦截
- ♻️ 自动重试：支持重试次数/延迟/自定义条件，或一键开启默认策略
- 🚫 请求去重：在窗口期内自动取消重复请求
- ⛔️ 请求取消：支持按 URL 取消与批量取消
- 📦 多格式输出：CJS + ESM + d.ts

## 📦 安装

```bash
# npm
npm install @tanggoat/request
# yarn
yarn add @tanggoat/request
# pnpm
pnpm add @tanggoat/request
```

## 🚀 快速开始

```ts
import Request from '@tanggoat/request';

const request = new Request({
  baseURL: 'https://api.example.com',
  timeout: 10000
});

// 基础请求
type User = { id: string; name: string };
request.request<User>({ url: '/users/1', method: 'GET' }).then(console.log);
```

## 🧱 拦截器

拦截器执行顺序（请求发起到响应返回）：
- 接口请求 → 实例请求 → 全局请求 → 实例响应 → 全局响应 → 接口响应

```ts
const request = new Request({
  baseURL: 'https://api.example.com',
  interceptors: {
    requestInterceptors: (config) => {
      // 实例级请求拦截
      return config;
    },
    responseInterceptors: (response) => {
      // 实例级响应拦截（在全局响应拦截之后）
      return response;
    },
  }
});

// 单请求拦截器
request.request({
  url: '/users',
  method: 'GET',
  interceptors: {
    requestInterceptors: (cfg) => ({ ...cfg }),
    responseInterceptors: (res) => res,
  }
});
```

## ♻️ 自动重试（retryConfig）

为单个请求开启自动重试：

```ts
// 方式一：使用默认策略（等价于 { retryCount: 2, retryDelay: 1000 }）
request.request({ url: '/unstable', method: 'GET', retryConfig: true });

// 方式二：自定义策略
request.request({
  url: '/unstable',
  method: 'GET',
  retryConfig: {
    retryCount: 3,            // 重试次数（默认 2）
    retryDelay: 1500,         // 重试间隔毫秒（默认 1000）
    retryCondition: (error, attempt) => {
      // 返回 true 才会继续重试
      return !error.response || error.response.status >= 500;
    }
  }
});
```

默认重试条件（当未提供 retryCondition 时）：
- 不是手动取消（非 axios.isCancel）
- 无响应（网络错误/超时）或 HTTP 5xx 或 429

库内默认值与默认条件由 `./util` 提供：
- `DEFAULT_RETRY_COUNT`、`DEFAULT_RETRY_DELAY`
- `defaultRetryCondition(error, attempt)`

## 🧯 请求去重（noRepeatRequest）

在指定时间窗口内取消重复请求（默认窗口 2000ms）：

```ts
request.request({ url: '/list', method: 'GET', noRepeatRequest: true });
```

说明：同一 URL 在窗口期内仅允许第一条通过，其余自动取消（内部通过 AbortController 实现）。

## ⛔️ 取消请求

```ts
// 取消指定 URL
request.cancelRequest('/tasks');
// 批量取消
request.cancelRequest(['/a', '/b']);
// 取消全部
request.cancelAllRequest();
```

## 🧩 API 文档

### 类型

```ts
import type { CreateRequestConfig, RequestConfig, RequestInterceptors } from '@tanggoat/request';

// 重试配置
export type IRetryConfig = {
  retryCount?: number;                                 // 默认 2
  retryDelay?: number;                                 // 默认 1000ms
  retryCondition?: (error: any, attempt: number) => boolean; // 返回 true 则继续重试
}

// 请求配置（节选）
export interface RequestConfig<T = AxiosResponse> extends InternalAxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
  noRepeatRequest?: boolean;
  retryConfig?: IRetryConfig | boolean;                // true 表示启用默认重试策略
}
```

### 类

```ts
new Request(config: CreateRequestConfig)
```

- 常用方法
  - `request<T>(config: RequestConfig<T>): Promise<T>`
  - `cancelRequest(url: string | string[]): void`
  - `cancelAllRequest(): void`

## 🧪 示例

### 1) 搭配实例拦截器与单请求拦截器
```ts
const request = new Request({
  baseURL: 'https://api.example.com',
  interceptors: {
    requestInterceptors: (cfg) => ({ ...cfg }),
    responseInterceptors: (res) => res,
  }
});

request.request({
  url: '/users',
  method: 'GET',
  interceptors: {
    requestInterceptors: (cfg) => ({ ...cfg, headers: { ...cfg.headers, 'X-Req': '1' } }),
    responseInterceptors: (res) => res,
  }
});
```

### 2) 自动重试
```ts
// 默认重试
request.request({ url: '/ping', method: 'GET', retryConfig: true });

// 自定义重试
request.request({
  url: '/ping',
  method: 'GET',
  retryConfig: { retryCount: 3, retryDelay: 2000 }
});
```

### 3) 请求去重 + 取消
```ts
request.request({ url: '/list', method: 'GET', noRepeatRequest: true });
// 稍后取消
request.cancelRequest('/list');
```

## 🏗️ 在 Monorepo 中实时联调

使用 pnpm workspace：

- 根目录 `pnpm-workspace.yaml`
```yaml
packages:
  - "packages/*"
  - "apps/*"
```

- 在 app 里声明依赖（例如 demo 应用）
```json
{
  "dependencies": {
    "@tanggoat/request": "workspace:*"
  }
}
```

- 在 request 包内提供脚本（示例）
```json
{
  "scripts": {
    "build": "rimraf dist && tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch --sourcemap",
    "clean": "rimraf dist"
  }
}
```

- 同时启动两个终端：
  - request 包：`pnpm --filter @tanggoat/request dev`
  - demo 应用：`pnpm --filter demo dev`

当你修改 `packages/request/src/**` 时，tsup 会增量编译到 `dist/`，apps 会实时感知更新。

## 📦 发布（建议）

- 入口与导出指向 dist 构建产物：
  - `main: dist/index.cjs`
  - `module: dist/index.mjs`
  - `types: dist/index.d.ts`
  - `files: ["dist"]`
- 使用 `prepublishOnly` 自动构建：`"prepublishOnly": "pnpm build"`
- 可引入 Changesets 管理版本（可选）

## 📝 许可证

MIT 