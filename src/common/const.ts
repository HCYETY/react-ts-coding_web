export const REQUESTIP: string = "http://120.79.193.126:8080/api";
export const LOGIN: string = '/login';
export const INTERVIEWER: string = '/interviewer';
export const EDIT: string = '/edit';
export const ADD: string = '/add';
export const MODIFY: string = '/modify';
export const CANDIDATE: string = '/candidate';
export const SHOW_TESTS: string = '/show-tests';
export const WATCH_TEST: string = '/watch-test';
export const TEST: string = '/test';

export const FILTERS_LEVEL = [
  { text: '简单', value: '简单' },
  { text: '中等', value: '中等' },
  { text: '困难', value: '困难' },
];
export const FILTERS_STATUS = [
  { text: '未开始', value: '未开始' },
  { text: '开放中', value: '开放中' },
  { text: '已过期', value: '已过期' },
];
// 动态生成试卷标签
export const ARR = ['数组', '字符串', '排序', '矩阵', '模拟', '枚举', '字符串匹配', '桶排序', '计数排序', '基数排序', '双指针', '链表', '堆栈', '队列', '图'];
export const TAGS = [
  // ARR.map(char => {
  //   return (
  //     {
  //       key: i,
  //       value: char
  //     }
  //   )
  // })
  { key: 0, value: '数组'},
  { key: 1, value: '字符串'},
  { key: 2, value: '排序'},
  { key: 3, value: '矩阵'},
  { key: 4, value: '模拟'},
  { key: 5, value: '枚举'},
  { key: 6, value: '字符串匹配'},
  { key: 7, value: '桶排序'},
  { key: 8, value: '计数排序'},
  { key: 9, value: '基数排序'},
  { key: 10, value: '双指针'},
  { key: 11, value: '链表'},
  { key: 12, value: '堆栈'},
  { key: 13, value: '队列'},
  { key: 14, value: ''},
  { key: 15, value: '图'},
];
export const PROGRAM_LANGUAGE = ['cpp', 'java', 'python', 'javaccript', 'ruby', 'swift', 'go', 'rust', 'php', 'typescript'];
export const THEME = ['vs', 'vs-dark', 'hc-black'];
// export enum THEME {
//   VS = 'vs',
//   VS_DARK = 'vs-dark',
//   HC_BLACK = 'hc-black',
// };

export enum PAPER_STATUS {
  NODO = '试卷未开放',
  DONE = '试卷已提交',
  OVERDUE = '试卷已过期',
}