// "use client";

import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeRewrite from 'rehype-rewrite';
import rehypeHighlight from 'rehype-highlight';
import 'github-markdown-css/github-markdown-light.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; 
import style from './index.module.scss';

const MarkDownRenderer = ({ content }: { content: string }) => {

  return (
    <div className={style['markdown-body']}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw, rehypeRewrite, rehypeHighlight,
          remarkMath, rehypeKatex, rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        components={{
          img: async ({ src, alt, width, height, ...props }) => {
            // 处理 docs 目录下的图片引用
            let processedSrc = src;
            // 确保 src 是字符串后再调用 includes 方法
            if (src && typeof src === 'string' && src.includes('assets/')) {
              // 根据实际部署情况调整路径
              processedSrc = src.substring(src.lastIndexOf('/') + 1);
            }
            
            // 处理 width 和 height 类型转换
            const imageProps: any = { ...props };
            if (width) {
              imageProps.width = typeof width === 'string' ? parseInt(width, 10) : width;
            }
            if (height) {
              imageProps.height = typeof height === 'string' ? parseInt(height, 10) : height;
            }
            
            return <Image src={`/docs/assets/${processedSrc}`} alt={alt || '测试'} {...imageProps} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

  export default MarkDownRenderer;