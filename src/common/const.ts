import Add from "src/pages/interviewer/edit/add";
import Modify from "src/pages/interviewer/edit/modify";
import Edit from "src/pages/interviewer/edit/show";
import Login from "src/pages/login";
import ShowExam from 'pages/interviewer/consult/showExam';
import InterviewRoom from "src/pages/interviewer/interview/room";
import ExamInform from 'pages/interviewer/consult/examInform';
import LookOver from "src/pages/interviewer/consult/lookOver";
import { Route } from 'common/types';

export const REQUESTIP: string = 'http://120.79.193.126:8080/api';
export const LOGIN: string = '/login';

export const TEST_MANAGE: string = '/test-manage';
// export const TEST_EDIT: string = '/test-manage/edit';
export const TEST_ADD: string = '/test-manage/add';
export const TEST_MODIFY: string = '/test-manage/modify';

export const SHOW_EXAM: string = '/show-exam';
export const EXAM_INFORM: string = '/show-exam/exam-inform';
export const LOOK_OVER: string = '/show-exam/look-over';

export const INTERVIEW_MANAGE: string = '/interview-manage';
export const INTERVIEW: string = '/interview';
export const INTERVIEW_ENTRANCE: string = '/interview-entrance';

export const CANDIDATE: string = '/candidate';
export const CANDIDATE_SHOW_TESTS: string = '/candidate/show-tests';
export const CANDIDATE_WATCH_TEST: string = '/candidate/watch-test';
export const CANDIDATE_TEST: string = '/candidate/test';

// 路由栈
export const routes = [
  {
    path: INTERVIEW_ENTRANCE,
    breadcrumbName: '面试间入口',
    // component: InterviewRoom,
    children: [
      {
        path: INTERVIEW,
        breadcrumbName: '面试间',
      }
    ]
  },
  {
    path: INTERVIEW_MANAGE,
    breadcrumbName: '面试间管理',
  },
  {
    path: TEST_MANAGE,
    breadcrumbName: '试题管理',
    // component: Edit,
    children: [
      {
        path: TEST_ADD,
        breadcrumbName: '新建试卷',
        // component: Add,
      },
      {
        path: TEST_MODIFY,
        breadcrumbName: '修改试卷',
        // component: Modify,
      }
    ]
  },
  {
    path: SHOW_EXAM,
    breadcrumbName: '阅卷管理',
    // component: ShowExam,
    children: [
      {
        path: EXAM_INFORM,
        breadcrumbName: '展示阅卷信息',
        // component: ExamInform
      },
      {
        path: LOOK_OVER,
        breadcrumbName: '开始阅卷',
        // component: LookOver
      }
    ]
  }
]

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
  DOING = '尝试中',
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

// websocket 收到信息时的 type
export enum WS_TYPE {
  CONNECT = 'connect',
  TALK = 'talk',
  CODE = 'code',
  REQ_VIDEO = 'req-video',
  RES_VIDEO = 'res-video',
  VIDEO_OFFER = 'video-offer',
  VIDEO_ANSWER = 'video-answer',
  NEW_ICE_CANDIDATE = 'new-ice-candidate',
  HANG_UP = 'hang-up',
}