import React from "react";
import Image from "next/image";
import type { IArticlesData } from '../../page';

import style from './index.module.scss';

interface ArticlesItemProps {
  item: IArticlesData;
}

const ArticlesItem = ({ item }: ArticlesItemProps) => {
  console.log('ArticlesItem--->', item);

  if (!item) {
    console.warn('ArticlesItem: item is undefined or null');
    return null;
  }

  return (
    <div className={style.articlesLiWrapper}>
      <div className={style.articlesLi}>
        <div className={style.articlesLiContent}>
          <div className={style.title}>{item.title || '无标题'}</div>
          <div className={style.desc}>{item.description || '无描述'}</div>
          <div className={style.articlesLiFooter}>
            <div className={style.articlesLiFooterLeft}>
              <span>{item.nav || '未分类'}</span>
              <span>{item.date || '未知日期'}</span>
            </div>
            <div>
              {
                (item?.keyword || []).map((child) => (
                  <div
                    className={style.articlesLiFooterRightLi}
                    key={child}
                  >
                    {child}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <Image className={style.articlesLiImg} src="/images/icon_github.svg" alt={item.title || '文章图片'} />
      </div>
    </div>
  );
};

export default ArticlesItem;