import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Button, 
  Descriptions, 
  Layout, 
  Space, 
  Table, 
  Tabs, 
  Tag, 
  Divider, 
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  EditOutlined, 
  DeleteOutlined, 
} from '@ant-design/icons';

import 'style/interviewer/examInform.css';
import Navbar from 'common/components/navbar';
import TestAlone from 'src/common/components/candidate/testAlone';
import { LOOK_OVER, TEST_STATUS } from 'common/const';
import { getCookie, getUrlParam, transTime } from 'common/utils';
import { search } from 'api/modules/candidate';
import { showTest } from 'api/modules/test';
import { lookOver, showPaper } from 'api/modules/paper';

const paper = getUrlParam('exam');

export default class CandidateInform extends React.Component {

  state = {
    tableArr: [] = [],
    examContent: [] = [],
    examInform: {
      candidate: [] = [],
      answer_time: '',
      check: false,
      interviewer: '',
      time_begin: 0,
      time_end: 0,
    },
  }

  componentDidMount() {
    lookOver().then(result => {

    });
    PubSub.publish('getExam', { exam: paper });

    const cookie = getCookie();
    lookOver({ cookie, paper }).then(item => {
      this.setState({ tableArr: item.data.ret });
      // const ret = item.data.ret;
      // const arr: any[] = [];    // 存放试卷所属的候选人邮箱
      // const value: any[] = [];  // 存放候选人的试卷信息
      // ret.map((item: { email: string; status: TEST_STATUS; }) => {
      //   if (arr.indexOf(item.email) === -1 && item.status !== TEST_STATUS.NODO) {
      //     arr.push(item.email);
      //     value.push(item);
      //   }
      // })
      // this.setState({ tableArr: value });
    })
    showTest({ paper }).then(item => {
      this.setState({ examContent: item.data.show });
    })
    showPaper({ paper }).then(item => {
      this.setState({ examInform: item.data });
    })
  }

  // a 标签跳转至批阅界面
  jump = () => {
    // PubSub.publish('getExam', { exam: this.state.examInform });
    // window.location.href = `${ LOOK_OVER }?exam-email=${ record['email'] }`;
    // return(
    //   <Link to={LOOK_OVER}/>
    // )
  }

  render() {
    const { tableArr, examContent, examInform, } = this.state;
    const candidateColumns = [
      { title: '答题状态', dataIndex: 'test_status', key: 'test_status' },
      { title: '候选人', dataIndex: 'email', key: 'email' },
      { 
        title: '总分', 
        dataIndex: 'total_score', 
        key: 'total_score',
        sorter: (a: { total_score: number; }, b: { total_score: number; }) => a.total_score - b.total_score,
      },
      { 
        title: '排名', 
        dataIndex: 'rank', 
        key: 'rank',
        sorter: (a: { rank: number; }, b: { rank: number; }) => a.rank - b.rank,
      },
      { 
        title: '用时', 
        dataIndex: 'use_time', 
        key: 'use_time',
        sorter: (a: { use_time: number; }, b: { use_time: number; }) => a.use_time - b.use_time,
      },
      { 
        title: '操作', 
        dataIndex: 'action', 
        key: 'action',
        render: (text: any, record: any) => {
          return(
            <a href={ `${ LOOK_OVER }?exam-email=${ record['email'] }` }>前去批阅</a>
          )
        }
      }
    ]
    const testColumns = [
      { title: '试题号', dataIndex: 'num', key: 'num' },
      { title: '试题名', dataIndex: 'test_name', key: 'test_name' },
      {
        title: '标签', 
        dataIndex: 'tags', 
        key: 'tags',
        render: (tags: [string]) => (
          <span>
            {tags.map(tag => {
              let color = tag.length > 2 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </span>
        )
      },
      { title: '难易度', dataIndex: 'level', key: 'level' },
      { title: '分数', dataIndex: 'point', key: 'point' },
    ];
    const timeBegin = transTime(Number(examInform.time_begin));
    const timeEnd = transTime(Number(examInform.time_end));

    return(
      <div className="site-layout exam-inform-box">
        <Navbar/>

        <Layout>
          <div className="site-content-top">
            <div className="site-content-top-left">
              <h3> { paper } </h3>
              <div>
                <span>结束时间：</span>
              </div>
            </div>
            <div className="site-content-top-right">
              <span><CheckCircleOutlined />未参加</span>
              <Divider/>
              <span><ClockCircleOutlined />进行中</span>
              <Divider/>
              <span><CheckCircleOutlined />已结束</span>
              <Divider/>
            </div>
          </div>
          <Layout.Content>
            <Tabs defaultActiveKey="exam-report">
              <Tabs.TabPane tab="试卷报告" key="exam-report">
                Content of Tab Pane 1
              </Tabs.TabPane>
              <Tabs.TabPane tab="参与候选人" key="join-candidate">
                <Table
                  bordered
                  columns={ candidateColumns } 
                  dataSource={ [...tableArr] } 
                  // onRow={record => {
                  //   return {
                  //     onClick: () => { 
                  //       window.location.href = `${ LOOK_OVER }?exam-email=${ record['email'] }`;
                  //     }, // 点击行
                  //   };
                  // }}
                />
              </Tabs.TabPane>

              <Tabs.TabPane tab="试卷内容" key="exam-content">
                <Table
                  bordered
                  columns={ testColumns } 
                  dataSource={ [...examContent] } 
                  expandable={{
                    expandedRowRender: record => <p dangerouslySetInnerHTML={{ __html: record['test'] }} />,
                    rowExpandable: () => true,
                  }}
                />
              </Tabs.TabPane>

              <Tabs.TabPane tab="试卷信息" key="exam-inform">
                <Descriptions bordered>
                  <Descriptions.Item label="试卷开放时间">{ timeBegin }</Descriptions.Item>
                  <Descriptions.Item label="试卷截止时间">{ timeEnd }</Descriptions.Item>
                  <Descriptions.Item label="试卷作答时长">{ examInform.answer_time }</Descriptions.Item>
                  <Descriptions.Item label="应参与人数">{ examInform.candidate.length }</Descriptions.Item>
                  <Descriptions.Item label="试卷创建者">{ examInform.interviewer }</Descriptions.Item>
                  <Descriptions.Item label="试卷过期可否查看">{ examInform.check === true ? '可' : '否' }</Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>
            </Tabs>
          </Layout.Content>
        </Layout>
      </div>
    )
  }
}