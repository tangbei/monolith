#!/bin/bash

set -e

# ===========================
# 配置
# ===========================
NPM_REGISTRY="https://registry.npmjs.org/"

# ===========================
# 工具函数
# ===========================

log() {
  echo "ℹ️  $1"
}

success() {
  echo "✅ $1"
}

error() {
  echo "❌ $1" >&2
  exit 1
}

warn() {
  echo "⚠️  $1"
}

# ===========================
# 前置检查
# ===========================

# 检查未提交更改
if ! git diff --quiet; then
  error "You have uncommitted changes. Please commit or stash them first(检测到您有未提交的更改,请先提交后再操作)."
fi

# 检查 changeset
if [ -z "$(ls .changeset/*.md 2>/dev/null)" ]; then
  log "No changesets found. Nothing to release."
  exit 0
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
  error "pnpm is required but not found."
fi

# ===========================
# 用户选择模式
# ===========================

echo "🚀 Release Mode Selection"
echo "1) Production (正式发布)"
echo "2) Pre-release (预发布，如 beta)"
read -rp "请选择发布类型 [1/2]: " choice

case $choice in
  1)
    MODE="production"
    success "选择了：正式发布"
    ;;
  2)
    MODE="prerelease"
    success "选择了：预发布 (beta)"
    ;;
  *)
    error "无效选择，请输入 1 或 2"
    ;;
esac

# ===========================
# 执行流程
# ===========================

if [ "$MODE" = "production" ]; then
  # --- 正式发布流程 ---
  log "➡️  正在退出预发布模式（如果存在）..."
  pnpm exec changeset pre exit || log "（未处于预发布模式，跳过）"

  log "➡️  生成正式版本号..."
  pnpm exec changeset version

  log "➡️  提交版本变更..."
  git add .
  git config user.name "Release Bot"
  git config user.email "release@example.com"
  git commit -m "chore(release): publish new version"

  log "➡️  发布到官方 npm (latest tag)..."
  NPM_CONFIG_REGISTRY="$NPM_REGISTRY" pnpm exec changeset publish

  success "🎉 正式版本已成功发布！"

elif [ "$MODE" = "prerelease" ]; then
  # --- 预发布流程 ---
  # 智能处理 pre 模式：仅在未进入时 enter
  if [ -f ".changeset/pre.json" ]; then
    log "➡️  已处于预发布模式（$(jq -r '.tag // "unknown"' .changeset/pre.json)），跳过 'pre enter'"
  else
    log "➡️  进入 beta 预发布模式..."
    pnpm exec changeset pre enter beta
  fi

  log "➡️  生成 beta 版本号..."
  pnpm exec changeset version

  log "➡️  提交 beta 版本变更..."
  git add .
  git config user.name "Release Bot"
  git config user.email "release@example.com"
  git commit -m "chore(release): beta version [skip ci]"

  log "➡️  发布到官方 npm (beta tag)..."
  NPM_CONFIG_REGISTRY="$NPM_REGISTRY" pnpm exec changeset publish

  success "🎉 Beta 版本已成功发布！可通过 \`npm install your-pkg@beta\` 安装。"
fi