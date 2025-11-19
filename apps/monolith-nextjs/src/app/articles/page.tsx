import React from "react";
import type { ResolvingMetadata } from 'next';
import Link from 'next/link';
import Attachment from "@/client/components/Attachment";
import ArticlesItem from './components/ArticlesItem';
import { request2 } from "@/common/apis/modules";
import { getSortedArticlesData } from "@/common/utils/markdown";
import type { IMarkDown } from "@/common/utils/markdown";

import style from "./page.module.scss";

type IProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 定义数据类型
export interface IArticlesData extends IMarkDown {
  type?: string;
};

// getStaticProps 在 App Router 中不支持，使用 generateStaticParams 替代

// 获取服务端数据
async function getData(): Promise<IArticlesData[]> {
  // const res = await request2<IAboutData>({ id: 999 });
  const res = getSortedArticlesData();
  // console.log('getSortedArticlesData', res);
  return res || [];
}

/**
 * 动态元数据依赖于动态信息，例如当前路由参数、外部数据或父段中的 metadata，可以通过导出返回 Metadata 对象 的 generateMetadata 函数来设置。
 * @returns 
 */
export async function generateMetadata({ params, searchParams }: IProps, parent: ResolvingMetadata) {
  // console.log('generateMetadata--->');
  return {
    title: '我是文章列表',
    description: 'tang-nextjs',
  }
}

// 定义组件 props 类型
interface IAboutProps {
  data: IArticlesData[];
}

const ArticlesPage = async () => {
  const articles = await getData();

  return (
    <div className={style.articlesContainer}>
      <div className={style.articlesContent}>
        {
          articles && articles.length > 0 ? (
            articles.map((item) => (
              <Link
                key={item.order}
                href={`/articles/${item.title}`}
              >
                <ArticlesItem key={item.order} item={item} />
              </Link>
            ))
          ) : (
            <div>暂无文章</div>
          )
        }
      </div>
      <div className={style.articlesAttach}>
        <Attachment />
      </div>
    </div>
  );
};

export default ArticlesPage;
