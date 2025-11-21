# 发布脚本使用说明

该脚本用于在 Monorepo 中基于 Changesets 进行包发布，支持「正式发布」和「预发布(beta)」两种模式。

## 前置条件

- 已安装并使用 `pnpm`（版本 >= `10.0.0`）
- Node.js 版本 >= `20.0.0`
- 已在 npm 完成登录或配置好 token（需要具有发布权限）
- 仓库根目录 `.npmrc` 已指向官方源（已内置：`https://registry.npmjs.org/`）
- 依赖：
  - `@changesets/cli`、`execa`、`chalk`、`enquirer`（已在 `devDependencies` 中）

## 基本用法

- 通过包管理脚本运行：
  
  ```bash
  node scripts/publish.mjs
  ```
- 执行后会出现交互式菜单，选择发布模式：
* Production (正式发布)
* Prerelease (预发布beta)

## 模式说明
- 正式发布（Production）
* 用于发布稳定版本（通常对应 npm 的 latest 标签）
* 如当前处于预发布模式，会先自动退出：changeset pre exit
- 预发布（Prerelease / beta）
* 用于发布 beta 测试版本：changeset pre enter beta
* 预发布模式会生成标记文件：.changeset/pre.json
 
## 正式发布流程（Production）
1. 退出预发布模式（若存在）
```Bash
pnpm exec changeset pre exit
```
2. 交互创建 Changeset（选择要发布的包与版本等级）
```Bash
pnpm exec changeset
```
3. 生成版本号并写入各包
```Bash
pnpm exec changeset version
```
4. 提交变更到 Git
```Bash
git add .git commit -m "chore(release): publish new version" --author="Release Bot <release@example.com>"
```
5. 发布到 npm
```Bash
pnpm exec changeset publish
```

## 预发布流程（Prerelease / beta）
1. 进入预发布模式（如尚未进入）
```Bash
pnpm exec changeset pre enter beta
```
2. 交互创建 Changeset（选择要发布的包与版本等级）
```Bash
pnpm exec changeset
```
3. 生成版本号并写入各包
```Bash
pnpm exec changeset version
```
4. 提交变更到 Git
```Bash
git add .git commit -m "chore(release): beta version [skip ci]" --author="Release Bot <release@example.com>"
```
5. 发布到 npm
```Bash
pnpm exec changeset publish
```

## 注意事项
* 脚本运行时强制设置 `NPM_CONFIG_REGISTRY=https://registry.npmjs.org/`，确保发布到官方源。
* 需要发布的包应位于 `packages/` 下，并且 `package.json` 字段完整：
* * 必备字段：`name`、入口（如 `main/module/types`）、`files`、必要的 `publishConfig`
* 版本号由 Changesets 自动管理，请勿手动修改包的 version。
* 建议在发布前确保工作区无未提交变更（当前脚本未强制检查）。
* 预发布用于测试验证，正式发布会尝试退出预发布模式后再发布。
  
## 常见问题
* 未创建 Changeset 就尝试发布会被中止：
* * 提示信息：没有 changeset 创建. 中止并释放.
* 如何退出预发布模式？
* * 执行正式发布流程时脚本会自动运行 changeset pre exit。
* 发布失败的常见原因：
* * npm 权限不足或未登录；
* * 包 name 与 npm 现有包所有权不匹配；
* * 未设置 files 或入口文件导致发布内容为空。
  
## 脚本工作原理简述
* 使用 enquirer 交互选择模式（production / prerelease）。
* 通过 execa 调用 pnpm/git 命令，并统一设置 NPM_CONFIG_REGISTRY 环境变量。
* ensureChangesetExists 保证存在 Changeset，没有则中止流程。
* 根据模式进入/退出预发布，随后执行 version、commit、publish 完成发布。