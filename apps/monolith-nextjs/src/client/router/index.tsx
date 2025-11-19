'use client'

import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginGuard from "./guard/LoginGuard";
import { AntdProvider } from "../components/AntdProvider";
// import { Loading } from "@/client/components/Loading";

import style from "./index.module.scss";

interface IBuildRouterProps {
  children: React.ReactNode
}

/**
 * 初始化路由组件
 * @returns 
 */
export const BuildRouter = ({ children }: Readonly<IBuildRouterProps>) => {

  return (
    <AntdProvider>
      <div className={style.container}>
        <Header />
      
        {/* <Loading> */}
          <LoginGuard>
            <main className={style['main-container']}>
              {children}
            </main>
          </LoginGuard>
        {/* </Loading> */}

        <Footer />
      </div>
    </AntdProvider>
  );
};