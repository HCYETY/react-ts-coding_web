import { post } from 'api/index';

// 向邮箱发送验证码
export async function sendEmail(data?: any) {
  return post('/email', data);
}
// 登录接口
export async function testLogin(data: { email: string; cypher: string; }) {
  return post('/login', data);
}
// 注册接口
export async function testRegister(data: { email: string; cypher: string; captcha: string; identity: number}) {
  return post('/register', data);
}

// 获取试卷接口
export async function showPaper(data?: any) {
  return post('/paper', data);
}
// 新建试卷接口
export async function addPaper(data: any) {
  return post('/add_paper', data);
}
// 删除试卷接口
export async function deletePaper(data: number[]) {
  return post('/delete_paper', data);
}
// 修改试卷接口
export async function modifyPaper(data: any) {
  return post('/modify_paper', data);
}
// 候选人信息接口
export async function candidateInform(data?: any) {
  return post('/candidate_inform', data);
}

// 添加试题接口
export async function addTest(data: any) {
  return post('/add_test', data);
}
// 获取试题接口
export async function showTest(data?: any) {
  return post('/show_test', data);
}

// 提交编程答案接口
export async function saveCode(data: any) {
  return post('/save_code', data);
}