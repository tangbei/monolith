import type { Metadata } from "next/types";
import ClientBuilder from "@/client/builder";
import ServerBuilder from "@/server/builder";
import '@ant-design/v5-patch-for-react-19';

import "@/common/styles/index.scss";

type IRootLayoutProps = {
  children: React.ReactNode
};

export const metadata: Metadata = {
  title: "tang-nextjs",
  description: "Next-SSR-Web-Template",
  keywords: ["Next-SSR-Web-Template"],
};

/**
 * app的根布局
 * 根布局必须包含 html 和 body标签，其他布局不能包含这些标签
 * @param param0 
 * @returns 
 */
const RootLayout = ({ children }: Readonly<IRootLayoutProps>) => {
  return (
    <html>
      <body>
          <ClientBuilder>
            <ServerBuilder>
              {children}
            </ServerBuilder>
          </ClientBuilder>
      </body>
    </html>
  );
}

export default RootLayout;
