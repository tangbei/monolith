"use client";

import React from 'react';
import { Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { userInfoStore } from '@/client/stores/userInfo';

import style from './page.module.scss';

interface IToolsData {
  id: number;
  title: string;
  desc: string;
  url: string;
}

interface IToolsClientProps {
  tools: IToolsData[];
}

/**
 * 工具推荐客户端组件
 * 处理交互和状态管理
 */
export const ToolsClient = ({ tools }: IToolsClientProps) => {
  // 使用 zustand store
  // const count = userInfoStore((state) => state.count);
  // const increment = userInfoStore((state) => state.increment);
  // const clearCount = userInfoStore((state) => state.clear);
  const { count, increment, clear } = userInfoStore(({ count, increment, clear }) => ({ count, increment, clear }));

  const actions: React.ReactNode[] = [
    <EditOutlined key="edit" />,
    <SettingOutlined key="setting" />,
    <EllipsisOutlined key="ellipsis" />,
  ];

  return (
    <div className={style.toolsContainer}>
      <div className={style.toolsLabel}>推荐工具：<span>各种前端工具推荐</span></div>

      <div>{count}数量</div>
      <div onClick={increment}>aaaa</div>
      <div onClick={clear}>bbbb</div>
      <div className={style.gridContainer}>
        {
          tools.length > 0 && tools.map((item) => (
            <Card
              key={item.id}
              actions={actions}
            >
              <div>{item.title}</div>
            </Card>
          ))
        }
      </div>
    </div>
  );
};
