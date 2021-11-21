export const REQUESTIP: string = 'http://localhost:8080/api';
export const LOGIN: string = '/login';

export const MANAGE: string = '/manage';
export const EDIT: string = '/edit';
export const SHOW_EXAM: string = '/show-exam';
export const COMMUNICATE: string = '/communicate';
export const ADD: string = '/add';
export const MODIFY: string = '/modify';
export const EXAM_INFORM: string = '/exam-inform';
export const LOOK_OVER: string = '/look-over';

export const CANDIDATE: string = '/candidate';
export const SHOW_TESTS: string = '/show-tests';
export const WATCH_TEST: string = '/watch-test';
export const TEST: string = '/test';

// 试题难度
export enum TEST_LEVEL {
  EASY = '简单',
  EASY_KEY = 'easy',
  MIDDLE = '中等',
  MIDDLE_KEY = 'middle',
  HARD = '困难',
  HARD_KEY = 'hard',
};
// 答题情况
export enum TEST_STATUS {
  NODO = '未做',
  NODO_KEY = 0,
  DONE = '已解答',
  DONE_KEY = -1,
  DOING = '尝试过',
  DOING_KEY = 1,
  WILL = '未开始',
  ING = '进行中',
  END = '已结束'
}
// 试卷状态
export enum PAPER_STATUS {
  NODO = '试卷未开放',
  DONE = '试卷已提交',
  OVER = '试卷已过期',
  WILL = '未开始',
  ING = '进行中',
  END = '已结束'
}
// 试卷批阅情况
export enum PAPER_CONSULT {
  YES = '已批阅',
  NO = '未批阅',
}
// 动态生成试卷标签
export const ARR = ['数组', '字符串', '排序', '矩阵', '模拟', '枚举', '字符串匹配', '桶排序', '计数排序', '基数排序', '双指针', '链表', '堆栈', '队列', '图'];
export const TAGS = [
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

// 代码编辑器的语言
export const PROGRAM_LANGUAGE = ['cpp', 'java', 'python', 'javascript', 'ruby', 'swift', 'go', 'rust', 'php', 'typescript'];
// 代码编辑器的主题
export enum PROGRAM_THEME {
  VS = 'vs',
  VS_DARK = 'vs-dark',
  HC_BLACK = 'hc-black',
};