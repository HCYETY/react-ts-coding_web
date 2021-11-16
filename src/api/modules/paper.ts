import { post } from 'api/index';

// 获取试卷接口
export function showPaper(data?: { paper?: string; cookie?: string; interviewer?: boolean }) {
  return post('/paper', data);
}
// 新建试卷接口
export function addPaper(data: { cookie: string; values: any; }) {
  return post('/add_paper', data);
}
// 删除试卷接口
export function deletePaper(data: number[]) {
  return post('/delete_paper', data);
}
// 修改试卷接口
export function modifyPaper(data: any) {
  return post('/modify_paper', data);
}
// 批阅试卷接口
export function lookOver(data?: any) {
  return post('/look_over', data);
}