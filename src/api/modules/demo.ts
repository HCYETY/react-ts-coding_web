import { get } from '../index';

// This is a demo, and network requests in subsequent projects are divided into different files according to the module
export async function showDemo(ids: string):Promise<any> {
  return get('http://dangosky.com:3000/song/detail', { ids });  
}
