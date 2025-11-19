import fs from "fs";
import path from "path";
// gray-matter：获取元数据
import matter from "gray-matter";
// date-fns：处理日期
import { parseISO } from "date-fns";

export interface IMarkDown {
  order: number,
  title: string,
  date: string,
  keyword: string[],
  description: string,
  nav: string,
  group: {
    title: string,
    order: number
  }
}

interface MatterMark {
  data: IMarkDown;
  content: string;
  [key: string]: unknown;
}

// posts目录的路径
const postsDirectory = path.join(process.cwd(), "/src/docs");
// 获取posts目录下的所有文件名（带后缀）
const fileEntries = fs.readdirSync(postsDirectory, { withFileTypes: true });
const fileNames = fileEntries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name);
  
// console.log('postsDirectory', postsDirectory, 'fileNames', fileNames);

// 获取所有文章用于展示列表的数据
export function getSortedArticlesData() {
  // 获取所有md文件用于展示列表的数据，包含id，元素据（标题，时间）
  const allPostsData = fileNames.map((fileName) => {
    // 去除文件名的md后缀，使其作为文章id使用
    const id = fileName.replace(/\.md$/, "");

    // 获取md文件路径
    const fullPath = path.join(postsDirectory, fileName);

    // 读取md文件内容
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 使用matter提取md文件元数据：{data:{//元数据},content:'内容'}
    const matterResult = matter(fileContents);
    // console.log('matterResult', matterResult);

    return {
      id,
      ...(matterResult.data as MatterMark["data"]),
    };
  });

    // 按照日期从进到远排序
  return allPostsData.sort(({ date: a }, { date: b }) =>
    // parseISO：字符串转日期
    parseISO(a) < parseISO(b) ? 1 : -1
  );
}

// 获取格式化后的所有文章id（文件名）
export function getAllPostIds() {
  // 这是返回的格式:
  // [
  //   {
  //     params: {
  //       id: '......'
  //     }
  //   },
  //   {
  //     params: {
  //       id: '......'
  //     }
  //   }
  // ]

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

/**
 * 获取指定文章内容
 * @param id 
 * @returns 
 */
export const getArticlesContent = async (id: string) => {
  // 文章路径
  const fullPath = path.join(postsDirectory, `${id}.md`);

  // 读取文章内容
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 使用matter解析markdown元数据和内容
  const matterResult = matter(fileContents);
  return matterResult.content;
};
