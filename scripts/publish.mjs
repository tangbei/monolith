#!/usr/bin/env node

import { execa } from 'execa';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import enquirer from 'enquirer';
import chalk from 'chalk';

const { select } = enquirer;

// ===========================
// 配置
// ===========================
const NPM_REGISTRY = 'https://registry.npmjs.org/';
const CHANGESET_DIR = resolve('.changeset');
const PRE_JSON_PATH = resolve(CHANGESET_DIR, 'pre.json');

// ===========================
// 工具函数
// ===========================

const log = (msg) => console.log(chalk.dim('ℹ️  ') + msg);
const success = (msg) => console.log(chalk.green('✅ ') + msg);
const error = (msg) => {
  console.error(chalk.red('❌ ') + msg);
  process.exit(1);
};
const warn = (msg) => console.warn(chalk.yellow('⚠️  ') + msg);

async function run(cmd, args = [], opts = {}) {
  const defaultOpts = {
    stdio: 'inherit',
    env: {
      ...process.env,
      NPM_CONFIG_REGISTRY: NPM_REGISTRY,
      ...opts.env,
    },
  };
  try {
    await execa(cmd, args, { ...defaultOpts, ...opts });
  } catch (err) {
    error(`Command failed: ${cmd} ${args.join(' ')}`);
  }
}

function hasPendingChangesets() {
  if (!existsSync(CHANGESET_DIR)) return false;
  const files = readdirSync(CHANGESET_DIR).filter(
    (f) => f.endsWith('.md') && f !== 'README.md'
  );
  return files.length > 0;
}

// ===========================
// 主流程
// ===========================

async function main() {
  // 检查未提交更改
  // const { stdout: gitStatus } = await execa('git', ['status', '--porcelain']);
  // if (gitStatus.trim()) {
  //   error('You have uncommitted changes. Please commit or stash them first.');
  // }

  // 检查 changeset
  if (!hasPendingChangesets()) {
    log('No pending changesets found. Run `pnpm exec changeset` first.');
    return;
  }

  // 用户选择模式
  const mode = await select({
    message: '🚀 选择发布模式',
    choices: [
      { name: 'production', message: 'Production (正式发布)' },
      { name: 'prerelease', message: 'Prerelease (预发布beta)' },
    ],
  });

  success(`Selected: ${mode === 'production' ? '正式发布' : '预发布 (beta)'}`);

  // ===========================
  // 正式发布流程
  // ===========================
  if (mode === 'production') {
    log('➡️  Exiting pre-release mode (if any)...');
    try {
      await run('pnpm', ['exec', 'changeset', 'pre', 'exit']);
    } catch {
      log('(Not in pre mode, skipped)');
    }

    log('➡️  Generating new version...');
    await run('pnpm', ['exec', 'changeset', 'version']);

    log('➡️  Committing changes...');
    await run('git', ['add', '.']);
    await run('git', [
      'commit',
      '-m',
      'chore(release): publish new version',
      '--author=Release Bot <release@example.com>',
    ]);

    log('➡️  Publishing to official npm (latest tag)...');
    await run('pnpm', ['exec', 'changeset', 'publish']);

    success('🎉 Production release completed!');
  }

  // ===========================
  // 预发布流程
  // ===========================
  else if (mode === 'prerelease') {
    if (existsSync(PRE_JSON_PATH)) {
      log('➡️  Already in pre-release mode, skipping `pre enter`');
    } else {
      log('➡️  Entering beta pre-release mode...');
      await run('pnpm', ['exec', 'changeset', 'pre', 'enter', 'beta']);
    }

    log('➡️  Generating beta version...');
    await run('pnpm', ['exec', 'changeset', 'version']);

    log('➡️  Committing beta version...');
    await run('git', ['add', '.']);
    await run('git', [
      'commit',
      '-m',
      'chore(release): beta version [skip ci]',
      '--author=Release Bot <release@example.com>',
    ]);

    log('➡️  Publishing to official npm (beta tag)...');
    await run('pnpm', ['exec', 'changeset', 'publish']);

    success('🎉 Beta release completed! Install with `npm install your-pkg@beta`');
  }
}

// ===========================
// 启动
// ===========================

// 判断当前文件是否作为主模块运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error);
}