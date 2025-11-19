import queryString from "query-string";

/** 
 * 获取当前 URL 网址
 */
export const getCurrentUrl = (): string => location?.href || "http://localhost/";

/**
 * 获取 url 的 查询参数对象
 * @param url 需要解析的 URL
 * @returns {queryString.ParsedQuery<string>} query对象
 */
export const getUrlQuery = (url: string): queryString.ParsedQuery<string> => queryString.parseUrl(url).query;

/**
 * 获取当前 url 的 查询参数对象
 * @returns  当前 url 的查询参数对象
 */
export const getCurrentUrlQuery = (): queryString.ParsedQuery<string> => getUrlQuery(getCurrentUrl());

/**
 * 合并 URL 的查询参数，并返回更新后的 URL 字符串
 * @param url 完整的 URL 字符串
 * @param obj 需要合并到 URL 中的查询参数对象
 * @param options stringifyUrl 的 options
 * @returns {string} 更新后的 URL 字符串
 */
export const mergeUrlQuery = (
  url: string,
  obj: queryString.ParsedQuery<string>,
  options?: queryString.StringifyOptions
): string => {

  const _query = getUrlQuery(url)

  Object.assign(_query, obj)

  return queryString.stringifyUrl({ url: url, query: _query }, options)

}