import { PAPER_STATUS } from "common/const";

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

// 求出日期之间的天数
export function getDays(start: string, end: string, diff?: number) {
  const left = new Date(start);
  const right = new Date(end);
  const ms = Math.abs(right.getTime() - left.getTime());
  const s = ms / 1000 % 60;
  const day = Math.floor(ms / 1000 / 60 / 60 / 24);
  const hour   = Math.floor(ms/ 1000 / 60 / 60 - (24 * day));
  const minute  = Math.floor(ms / 1000 /60 - (24 * 60 * day) - (60 * hour));
  
  if (diff === 4) {
    return s;
  } else if (diff === 3) {
    return minute;
  } else if (diff === 2) {
    return hour;
  } else if (diff === 1) {
    return day;
  }
  const retTime = '剩余 ' + day + ' 天 ' + hour + ' 小时 ' + minute + ' 分钟 ' + s + ' 秒'; 
  return retTime;
}
// 求出某一天的倒计时
export function residueTime(comp: any) {
  const endHour = comp.slice(12, 13);
  const endMinutes = comp.slice(15);
  const endSeconds = endHour * 60 *60 + endMinutes * 60;

  const nowtime = new Date();
  const nowHour = nowtime.getHours();
  const nowMinutes = nowtime.getMinutes();
  const nowSeconds = nowHour * 60 * 60 + nowMinutes * 60;
  const dataTime = endSeconds - nowSeconds;
  return dataTime;
}

// 获取当前时间，yyyy-mm-dd 格式
// 如果某个数字只有一位数，则在前面补 0
export function nowTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2,'0');
  const day = now.getDate().toString().padStart(2,'0');
  const hours = now.getHours().toString().padStart(2,'0');
  const minutes = now.getMinutes().toString().padStart(2,'0');
  const seconds = now.getSeconds();
  const nowTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  return nowTime;
}

// 获取后端返回的试卷数据，对试卷剩余答题时间进行处理
export function handleRemainingTime(arr: any, status: any) {
  let nodoArr: any[] = [], doingArr: any[] = [], doneArr: any[] = [], allArr: any[] = [];
  arr.map(async (item: any) => {
    const timeBegin = item.time_begin || item.paper.time_begin;
    const timeEnd = item.time_end || item.paper.time_end;
    // 获取当前时间，yyyy-mm-dd hh-mm-ss 格式
    const nowtime = nowTime();
    item.check = item.check === true ? '是' : '否';
    item.key = item.paper.key || item.paper;
    allArr.push(item);

    if (item.remaining_time === true || item.paper.remaining_time === true) {
      // 求出日期之间的天数
      const remaining_time = getDays(nowtime, timeEnd);
      item.remaining_time = remaining_time;
      doingArr.push(item);
    } else if (item.remaining_time === false && timeEnd > nowtime) {
      item.remaining_time = PAPER_STATUS.DONE;
      doneArr.push(item);
    } else if (timeEnd < nowtime) {
      item.remaining_time = PAPER_STATUS.OVERDUE;
      doneArr.push(item);
    } else if (nowtime < timeBegin) {
      item.remaining_time = PAPER_STATUS.NODO;
      nodoArr.push(item);
    }
  })
  // console.log('doneArr', doneArr)
  // console.log('doingArr', doingArr)
  // console.log('nodoArr', nodoArr)
  // console.log('allArr', allArr)
  if (status === 1) {
    return doingArr;
  } else if (status === 0) {
    return nodoArr;
  } else if (status === -1) {
    return doneArr;
  } else if (status === 2) {
    return allArr;
  }
}