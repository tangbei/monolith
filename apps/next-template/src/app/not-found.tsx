import { Result } from 'antd';
import dayjs from 'dayjs';
import type { ResultProps } from 'antd';

/**
 * 全局404页面
 */
const NotFound = () => {

  const resultProps: ResultProps = {
    status: "error",
    title: "页面无法访问404",
    subTitle: `很抱歉，页面无法访问。时间：${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
    extra:
      <>
        <div>上一页</div>
      </>

  }

  return (
    <section className="not-found">
      <Result {...resultProps} />
    </section>
  );
};

export default NotFound;
