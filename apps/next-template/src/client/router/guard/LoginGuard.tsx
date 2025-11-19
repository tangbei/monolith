import LoadingWrapper from "@/server/components/LoadingWrapper";
import { usePathname } from "next/navigation";
import { Navigate } from "@/client/components/Navigate";
import { getCurrentUrlQuery } from "@/common/utils";


const LOGIN_PATH_PERMISSIONS: string[] = [];

/**
 * 登录守卫
 * @returns 
 */
const LoginGuard = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const isLogin = false;
  // 使用当前路由
  const currentRoute = usePathname();

  const isCheckedLogin = () => {
    return true;
  }

  if (!isCheckedLogin()) {
    // 检查登录
    return <LoadingWrapper />;
  }

  // 如果当前路由是 需要登录 且 未登录
  if (LOGIN_PATH_PERMISSIONS.includes(currentRoute) && !isLogin) {
    return (
      <Navigate
        path={JSON.stringify(LOGIN_PATH_PERMISSIONS)}
        query={{
          ...getCurrentUrlQuery(),
          redirectRoute: currentRoute
        }}
        replace
      />
    );
  }

  return children;
};

export default LoginGuard;