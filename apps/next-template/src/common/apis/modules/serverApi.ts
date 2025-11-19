import TBRequest from "@/common/apis/request";

export const request2 = <T>(params: any) => {
  return TBRequest<any, T>({
    url: '/tang/about',
    method: 'post',
    data: params
  });
};

export const request3 = <T>(params: any) => {
  return TBRequest<any, T>({
    url: '/tang/activity',
    method: 'post',
    data: params
  });
};

export const request4 = (params: any) => {
  return TBRequest<any, IMetaData>({
    url: '/tang/getToolsMeta',
    method: 'get',
    data: params
  });
};

export const request5 = <T>(params: any) => {
  return TBRequest<any, T>({
    url: '/tang/getTools',
    method: 'post',
    data: params
  });
};