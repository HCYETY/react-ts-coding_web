import axios from 'axios';

axios.defaults.withCredentials = true

export function generateHttpApi(method: 'get' | 'post') {
  return (url: string, params?: any) => {
    const data = method === 'get' ? {
      params
    } : {
      data: params
    };
    return axios({
      url,
      method,
      ...data,
      // headers: {
      //   'X-Requested-With': 'XMLHttpRequest',
      //   // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      //   'Content-Type':"application/json",
      //   // 'Accept': 'application/json',
      //   // "charset":"utf-8"
      //   "withCredentials": true
      // }
    }).then(response => {
      // axios.defaults.withCredentials = true
      return response.data;
    }).catch(error => {
      return Promise.reject(error);
    });
  }
}

export const get = generateHttpApi('get');
export const post = generateHttpApi('post');