export function getUrlParam(key: string) {
  // 获取参数
  const url = window.location.search;
  // 正则筛选地址栏
  const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  // 匹配目标参数
  const result = url.substr(1).match(reg);
  //返回参数值
  return result ? decodeURIComponent(result[2]) : null;
}

// 随机生成包含大小写字母和数字的6位数题号
export function getTestNum() {
  let str = '';
  for (let i = 0; i < 2; i++) {
    const num = Math.floor(Math.random() * 10);
    const az = String.fromCharCode(Math.random() * 26 + 65);
    const AZ = String.fromCharCode(Math.random() * 26 + 97);
    str += num + az + AZ;
  }
  return str;
}

// 获取 cookie
export function getCookie() {
  const str = document.cookie;
  const cookie = str.split('=');
  return cookie[1];
}

// 获取当前时间，yyyy-mm-dd 格式
// 如果某个数字只有一位数，则在前面补 0
export function nowTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2,'0');
  const day = now.getDate().toString().padStart(2,'0');
  const nowTime = year + '-' + month + '-' + day;
  return nowTime;
}