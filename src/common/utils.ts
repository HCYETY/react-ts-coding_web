import { TEST_LEVEL, PAPER_STATUS } from "common/const";
import { searchEmail } from "api/modules/user";

// 以递归的方式展平数组
export function flattenRoutes(arr: any) {
  return arr.reduce(function(prev: any, item: any) {
    prev.push(item);
    return prev.concat(
      Array.isArray(item.children) ? flattenRoutes(item.children) : []
    );
  }, []);
}

// 获取地址栏的信息
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

// 获取当前时间戳：毫秒格式 或者 hh:mm:ss格式
// 不带参数是毫秒格式，否则为 hh:mm:ss 格式
export function nowTime(data?: { click: boolean }): number | string {
  if (data && data.click === true) {
    const time = new Date();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const timer = hour + ':' + minute + ':' + second + ' ';
    return timer;
  }
  const time = new Date().getTime();
  return time;
}

// 求出日期之间的天数
export function getDays(start: number, end: number, diff?: number) {
  // const left = new Date(start);
  // const right = new Date(end);
  // const ms = Math.abs(right.getTime() - left.getTime());
  const ms = Math.abs(end - start);
  const s = Math.floor(ms / 1000 % 60);
  const day = Math.floor(ms / 1000 / 60 / 60 / 24);
  const hour   = Math.floor(ms/ 1000 / 60 / 60 - (24 * day));
  const minute  = Math.floor(ms / 1000 /60 - (24 * 60 * day) - (60 * hour));
  const retTime = '剩余 ' + day + ' 天 ' + hour + ' 小时 ' + minute + ' 分钟 ' + s + ' 秒'; 
  return diff === 4 ? s : diff === 3 ? minute : diff === 2 ? hour : diff === 1 ? day : retTime;
}

// 获取后端返回的试卷数据，对试卷时间数据进行处理
export function handleTime(arr: any, status?: number) {
  let nodoArr: any[] = [], doingArr: any[] = [], doneArr: any[] = [], allArr: any[] = [];
  arr.map((item: any) => {
    // 毫秒数
    const timebegin = item.time_begin || item.paper.time_begin;
    const timend = item.time_end || item.paper.time_end;
    // yyyy-mm-dd hh:mm:ss 格式
    const timeBegin = transTime(timebegin);
    const timeEnd = transTime(timend);
    const nowtime = new Date().getTime();
    item.time_begin = timeBegin;
    item.time_end = timeEnd;
    item.check = item.check === true ? '是' : '否';
    item.key = item.paper.key || item.paper;
    allArr.push(item);

    if (item.remaining_time === true || item.paper.remaining_time === true){
      // 求出日期之间的天数
      const remaining_time = getDays(nowtime, timend);
      item.remaining_time = remaining_time;
      doingArr.push(item);
    } else if (item.remaining_time === false && timend > nowtime) {
      item.remaining_time = PAPER_STATUS.DONE;
      doneArr.push(item);
    } else if (item.remaining_time === false && timend < nowtime) {
      item.remaining_time = PAPER_STATUS.OVER;
      doneArr.push(item);
    } else if (nowtime < timebegin) {
      item.remaining_time = PAPER_STATUS.NODO;
      nodoArr.push(item);
    }
  })
  return status === 1 ? doingArr : status === 0 ? nodoArr : status === -1 ? doneArr : allArr;
}

// 转化日期控件时间值
export function transTime(time: number) {
  const timeDate = new Date(+time);
  const getTime = new Date(+new Date(timeDate) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g,' ')
    .replace(/\.[\d]{3}Z/,'');
  return getTime;
}

// 获取试卷难度
export function getExamLevel(difficulty: string) {
  if (difficulty === TEST_LEVEL.EASY) {
    return TEST_LEVEL.EASY_KEY;
  } else if (difficulty === TEST_LEVEL.MIDDLE) {
    return TEST_LEVEL.MIDDLE_KEY;
  } else if (difficulty === TEST_LEVEL.HARD) {
    return TEST_LEVEL.HARD_KEY;
  } 
}

// 获取以“小时”为单位的数字
export function getHour() {
  let ret = new Array(24);
  for (let i = 0; i < 24; i++) {
    ret[i] = i;
  }
  return ret;
}
// 获取以“分钟”为单位的数字
export function getMinute() {
  let ret = new Array(12);
  for (let i = 0; i <= 55; i += 5) {
    ret[i] = i;
  }
  return ret;
}

// 获取该项目中所有面试官和候选人的邮箱
export async function findEmail() {
  const result = await searchEmail();
  const res = result.data.ret;
  const candArr: string[] = [], interArr: string[] = [];
  res.map((item: { interviewer: boolean; email: string; }) => {
    if (item.interviewer === true) {
      interArr.push(item.email);
    } else if (item.interviewer === false) {
      candArr.push(item.email);
    }
  })
  const obj = {
    allInterview: interArr,
    allCandidate: candArr
  }
  return obj;
}