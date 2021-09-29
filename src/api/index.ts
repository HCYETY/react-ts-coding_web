import axios from 'axios';
import { REQUESTIP } from '../public/const';

axios.defaults.withCredentials = true;

export function generateHttpApi(method: 'get' | 'post') {
  return (url: string, params?: any) => {
    const data = method === 'get' ? {
      params
    } : {
      data: params
    };
    url = REQUESTIP + url;
    return axios({
      url,
      method,
      ...data,
    }).then(response => {
      return response.data;
    }).catch(error => {
      return Promise.reject(error);
    });
  }
}

export const get = generateHttpApi('get');
export const post = generateHttpApi('post');