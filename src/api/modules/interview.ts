import { post } from 'api/index';

// 创建面试间接口
export function createInterview(data: any) {
  return post('/create_interview', data);
}
// 查询面试间信息接口
export function findInterview(data?: { findArr: any }) {
  return post('/find_interview', data);
}
// 提交面试结构接口
export function submitInterview(data: { submitArr: any }) {
  return post('/submit_interview', data);
}