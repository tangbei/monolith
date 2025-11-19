import TBRequest from "@/common/apis/request";

export const request1 = (params: any) => {
  return TBRequest({
    url: '/tang/userInfo',
    method: 'get',
    data: params,
    retryConfig: true,
    noRepeatRequest: true,
  });
};