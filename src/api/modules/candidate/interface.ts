import { post } from 'api/index';

// 查找候选人信息接口
export function search(data?: any) {
  return post('/search', data);
}
// 提交候选人信息接口
export function submit(data: any) {
  return post('/submit', data);
}