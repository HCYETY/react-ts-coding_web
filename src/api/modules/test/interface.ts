import { post } from 'api/index';

// 添加试题接口
export function addTest(data: any) {
  return post('/add_test', data);
}
// 获取试题接口
export function showTest(data: { paper?: string; test?: string; }) {
  return post('/show_test', data);
}