#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取当前工作目录
const rootDir = require('path').resolve(__dirname, '..');
process.chdir(rootDir);

const npmrcPath = path.join(rootDir, '.npmrc');

// 读取原始 .npmrc 内容
let originalNpmrc = '';
if (fs.existsSync(npmrcPath)) {
  originalNpmrc = fs.readFileSync(npmrcPath, 'utf8');
}

// npm 官方源
const officialRegistry = 'registry=https://registry.npmjs.org/';

function switchToOfficialRegistry() {
  console.log('正在切换到 npm 官方源...');
  
  // 备份原始 .npmrc 文件
  if (fs.existsSync(npmrcPath)) {
    fs.renameSync(npmrcPath, npmrcPath + '.backup');
  }
  
  // 创建新的 .npmrc 文件，设置官方源
  fs.writeFileSync(npmrcPath, officialRegistry);
  console.log('已切换到 npm 官方源');
}

function restoreOriginalRegistry() {
  console.log('正在恢复原始 npm 源设置...');
  
  // 删除当前的 .npmrc 文件
  if (fs.existsSync(npmrcPath)) {
    fs.unlinkSync(npmrcPath);
  }
  
  // 恢复原始 .npmrc 文件
  if (fs.existsSync(npmrcPath + '.backup')) {
    fs.renameSync(npmrcPath + '.backup', npmrcPath);
  }
  
  console.log('已恢复原始 npm 源设置');
}

function runChangeset() {
  console.log('执行 changeset...');
  execSync('npx changeset', { stdio: 'inherit' });
}

function runChangesetVersion() {
  console.log('执行 changeset version...');
  execSync('npx changeset version', { stdio: 'inherit' });
}

function runChangesetPublish(isBeta) {
  console.log('执行 changeset publish...');
  
  if (isBeta) {
    execSync('npx changeset publish --tag beta', { stdio: 'inherit' });
  } else {
    // 先退出预发布模式进入正式发布模式
    execSync('npx changeset pre exit', { stdio: 'inherit' });
    execSync('npx changeset publish', { stdio: 'inherit' });
  }
}

function enterBetaMode() {
  console.log('进入预发布模式...');
  execSync('npx changeset pre enter beta', { stdio: 'inherit' });
}

function getUserChoice() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('请选择发布模式:');
    console.log('1. 正式模式 (release)');
    console.log('2. 预发布模式 (beta)');
    
    rl.question('请输入选项 (1 或 2): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  try {
    // 切换到官方源
    switchToOfficialRegistry();
    
    // 获取用户选择的发布模式
    const choice = await getUserChoice();
    let isBeta = false;
    
    switch (choice) {
      case '1':
        console.log('选择了正式模式');
        isBeta = false;
        break;
      case '2':
        console.log('选择了预发布模式');
        isBeta = true;
        // 进入预发布模式
        enterBetaMode();
        break;
      default:
        console.log('无效选项，使用默认的正式模式');
        isBeta = false;
    }
    
    // 运行 changeset
    runChangeset();
    
    // 运行 changeset version
    runChangesetVersion();
    
    // 运行 changeset publish
    runChangesetPublish(isBeta);
    
    // 恢复原始源
    restoreOriginalRegistry();
    
    console.log('发布流程完成，npm 源已恢复');
  } catch (error) {
    // 发生错误时也尝试恢复原始设置
    try {
      restoreOriginalRegistry();
    } catch (restoreError) {
      console.error('警告：无法恢复原始 npm 源设置');
    }
    
    console.error('执行过程中发生错误:', error.message);
    process.exit(1);
  }
}

main();