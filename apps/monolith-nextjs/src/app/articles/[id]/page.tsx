import React from "react";
import type { ResolvingMetadata } from 'next';
import MarkDownRenderer from "@/client/components/MarkDown";
import Link from 'next/link';
import { request2 } from "@/common/apis/modules";
import { getArticlesContent } from "@/common/mock/utils";

import style from "./page.module.scss";

type IProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 定义数据类型
interface IArticlesData {
  id: string;
  date: string;
  title?: string;
}

/**
 * 动态元数据依赖于动态信息，例如当前路由参数、外部数据或父段中的 metadata，可以通过导出返回 Metadata 对象 的 generateMetadata 函数来设置。
 * @returns 
 */
export async function generateMetadata({ params, searchParams }: IProps, parent: ResolvingMetadata) {
  const { id } = await params;
  console.log('generateMetadata--->', id);
  return {
    title: `文章${id}`,
    description: 'tang-nextjs',
  }
}

// 定义组件 props 类型
interface IAboutProps {
  data: IArticlesData[];
}

const getData = async (id: string) => {
  const res = await getArticlesContent(id);
  return res;
};

const ArticlesDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const res = await params;
  const data = await getData(res.id);
  // console.log('resssss---', data);

  return (
    <div className={style.articlesContainer}>
      <div className={style.articlesContainerLeft}>
        左侧菜单
      </div>
      <div className={style.articlesContainerRight}>
        <MarkDownRenderer content={data} />
      </div>
    </div>
  );
};

export default ArticlesDetailPage;
