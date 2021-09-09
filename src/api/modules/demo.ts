import { get, post } from '../index';

// This is a demo, and network requests in subsequent projects are divided into different files according to the module
export async function showDemo(ids: string):Promise<any> {
  return get('http://dangosky.com:3000/song/detail', { ids });  
}

// 测试接口
export async function test(data?: string):Promise<any>  {
  return get('http://localhost:3001/test', {data})
}
// export const test_login = (data = {}) => {
//   return get('http://localhost:3001/login', data)
// }