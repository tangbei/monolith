// 'use client'

import Link from "next/link";
// import { useRouter } from "next/navigation";
import { Button } from "antd";
import styles from "./page.module.css";

import { request1 } from "@/common/apis/modules";

// export async function getStaticProps(context: any) {

//   console.log('执行getStaticProps');
//   return {
//     props: {
//       data: 'aaaaa'
//     }
//   };
// };

/**
 * 主页面
 * @returns 
 */
const Home = (props?: any) => {

  const onHandleClick = async () => {
    const res = await request1({});
    console.log('test - onHandleClickH', res);
  };

  return (
    <div className={styles.page}>
      我是主页面

      <div>
        <Link href="/products/11">products - Link跳转</Link>
        <div>
          <Button>products - useRouter跳转</Button>
        </div>
        <Link href="/person">Link跳转 - 路由组跳转</Link>

        <div>
          <Button>请求测试</Button>
        </div>
      </div>
    </div>
  );
}

export default Home;