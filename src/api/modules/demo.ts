import { get, post } from '../index';

// 登录接口
export async function testLogin(data: object) {
  return post('http://localhost:3001/login', data);
}
// 注册接口
export async function testRegister(data: object) {
  return post('http://localhost:3001/register', data);
}

export async function testSubmit() {
  return post('http://localhost:3001/submit');
}