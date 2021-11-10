import { post } from 'api/index';

// 向邮箱发送验证码
export function sendEmail(data: { email: any; }) {
  return post('/email', data);
}
// 登录接口
export function testLogin(data: { email?: string; cypher?: string; cookie?: string }) {
  return post('/login', data);
}
// 注册接口
export function testRegister(data: { email: string; cypher: string; captcha: string; identity: number}) {
  return post('/register', data);
}
// 退出登录接口
export function logout(data: { cookie: string }) {
  return post('/logout', data);
}

// 获取试卷接口
export function showPaper(data: { cookie: string; interviewer?: boolean }) {
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
// 候选人信息接口
export function candidateInform(data?: { paper?: string; cookie?: string; test?: string; filter?: string}) {
  return post('/candidate_inform', data);
}

// 添加试题接口
export function addTest(data: any) {
  return post('/add_test', data);
}
// 获取试题接口
export function showTest(data: { paper?: string; test?: string; }) {
  return post('/show_test', data);
}

// 提交编程答案接口
export function saveCode(data: any) {
  return post('/save_code', data);
}