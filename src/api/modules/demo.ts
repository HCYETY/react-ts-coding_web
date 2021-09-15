import { get, post } from '../index';
// import axios from 'axios'
// import qs from 'qs'

// This is a demo, and network requests in subsequent projects are divided into different files according to the module
export async function showDemo(ids: string):Promise<any> {
  return get('http://dangosky.com:3000/song/detail', { ids });  
}

// 登录接口
export async function test_login(data: object) {
  return post('http://localhost:3001/login', data)
}
// 注册接口
export async function test_register(data: object) {
  return post('http://localhost:3001/register', data)
}