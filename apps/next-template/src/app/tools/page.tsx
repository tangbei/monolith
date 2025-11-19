import { request4, request5 } from '@/common/apis/modules/serverApi';
import { ToolsClient } from './ToolsClient';

interface IToolsData {
  id: number;
  title: string;
  desc: string;
  url: string;
}

export async function generateMetadata() {
  try {
    const res = await request4({});
    return {
      title: res.data?.title,
      description: res.data?.desc,
    }
  } catch (error) {
    return {
      title: '工具推荐',
      description: '各种前端工具推荐',
    }
  }
}

/**
 * 获取列表数据
 * @returns 
 */
async function getData(): Promise<IToolsData[]> {
  const res = await request5<IToolsData[]>({});
  return res?.data || [];
}

/**
 * 工具推荐页面（服务端组件）
 * 负责数据获取，将数据传递给客户端组件
 * @returns 
 */
const ToolsPage = async () => {
  const tools = await getData() as IToolsData[];

  return <ToolsClient tools={tools} />;
};

export default ToolsPage;