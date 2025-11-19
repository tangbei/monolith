import { Spin } from "antd";

export default function Loading() {
  console.log('Loading----->');
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <Spin size="large" />
      <div>页面加载中...</div>
    </div>
  );
}
