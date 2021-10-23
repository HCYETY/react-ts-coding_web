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
export function getDays(start: any, end: any) {
  const date1Str = start.split("-");//将日期字符串分隔为数组,数组元素分别为年.月.日
  //根据年 . 月 . 日的值创建Date对象
  const date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
  const date2Str = end.split("-");
  const date2Obj = new Date(date2Str[0],(date2Str[1]-1),date2Str[2]);
  const t1 = date1Obj.getTime();
  const t2 = date2Obj.getTime();
  const dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
  const minusDays = Math.floor(((t2 - t1) / dateTime));//计算出两个日期的天数差
  const days = Math.abs(minusDays);//取绝对值
  return days;
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

// 获取后端返回的试卷数据，对试卷剩余答题时间进行处理
export function handleRemainingTime(arr: any, status: any) {
  let nodoArr: any[] = [], doingArr: any[] = [], doneArr: any[] = [], allArr: any[] = [];
  arr.map((item: any) => {
    allArr.push(item);
    const timeBegin = item.time_begin.slice(0, 10);
    const timeEnd = item.time_end.slice(0, 10);
    // 获取当前时间，yyyy-mm-dd 格式
    const nowtime = nowTime();
    item.check = item.check === 1 ? '是' : '否';
    item.key = item.paper;

    if (item.remaining_time === true) {
      doingArr.push(item);
      // 求出日期之间的天数
      const remaining_time = getDays(timeBegin, timeEnd) - getDays(timeBegin, nowtime) + 1;
      item.remaining_time = '还剩' + remaining_time + '天';
    } else if (nowtime < timeBegin) {
      nodoArr.push(item);
      item.remaining_time = '试卷未开放';
    } else if (timeEnd < nowtime) {
      doneArr.push(item);
      item.remaining_time = '试卷已过期';
    }
  })
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

// 根据参数进行条件判断返回 true/false
export function judge() {

}