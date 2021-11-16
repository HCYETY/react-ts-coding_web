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