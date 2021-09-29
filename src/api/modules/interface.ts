import { post } from '../index';

// 登录接口
export async function testLogin(data: object) {
  return post('/login', data);
}
// 注册接口
export async function testRegister(data: object) {
  return post('/register', data);
}
// 获取试卷接口
export async function showPaper() {
  return post('/paper')
}
// 新建试卷接口
export async function addPaper(data: any) {
  return post('/add_paper', data)
}
// 删除试卷接口
export async function deletePaper(data: any) {
  return post('/delete_paper', data)
}
// 修改试卷接口
export async function modifyPaper(data: any) {
  return post('/modify_paper', data)
}