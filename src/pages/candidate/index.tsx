import React from 'react';
import { 
  Table,
  Card,
  Tabs ,
  Space,
  message,
} from 'antd';
import {
} from '@ant-design/icons';

import 'style/candidate.css';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import ExamShow from 'public/components/examShow';
import { showPaper } from 'api/modules/interface';
import { getCookie, nowTime, } from 'src/public/utils';

const { TabPane } = Tabs;

export default class Candidate extends React.Component<any, any> {
  state = {
    allExam: [] = [],
    nodoExam: [] = [],
    doingExam: [] = [],
    doneExam: [] = [],

  };

  find = (event: any) => {
    console.log(event)
    // const nowtime = nowTime();
    // if (value.time_begin !== nowtime || value.time_end < nowtime) {
    //   message.error('不在答题时间范围之内无法进行答题');
    //   return;
    // }
  }

  componentDidMount() {
    const cookie = getCookie();
    showPaper({ cookie: cookie}).then(res => {
      this.setState({ allExam: res.data });
    });
  }


  render() {
    const columns = [
      { title: '试卷', dataIndex: 'paper', key: 'paper' },
      { title: '试卷描述', dataIndex: 'paper_description', key: 'paper_description' },
      { title: '开始时间', dataIndex: 'time_begin', key: 'time_begin' },
      { title: '截止时间', dataIndex: 'time_end', key: 'time_end' },
      { title: '剩余时间', dataIndex: 'remaining_time', key: 'remaining_time' },
      { title: '作答时长', dataIndex: 'answer_time', key: 'answer_time' },
      { 
        title: '试题数量', 
        dataIndex: 'tests_num', 
        key: 'tests_num',
        sorter: (a: any, b: any) => a.tests_num - b.tests_num,
      },
      { 
        title: '试卷总分数', 
        dadaIndex: 'paper_point', 
        key: 'paper_point',
        sorter: (a: any, b: any) => a.paper_point - b.paper_point,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: { paper: string; }) => (
          <Space size="middle">
            <a href={ `/candidate?paper=${ record.paper }` }>查看试卷</a>
          </Space>
        ),
      }
    ]
    const { allExam, nodoExam, doingExam, doneExam, } = this.state;
    console.log('====', allExam)

    return(
      <div>
        <Head />

        <div className="card-container">
          <Tabs type="card">
            <TabPane tab="全部" key="all">
              <Table
                columns={ columns }
                dataSource={ allExam }
                scroll={{ y: '100%' }}
              />
              {/* <ExamShow
                title='你好'
                description='okokok'
                tags={['双指针']}
                testsNum='2'
                time='2021-05-03~2021-09-10'
                status='未完成'
              >

              </ExamShow>*/}
            </TabPane>
            <TabPane tab="未开始" key="nodo">
              <Table
                columns={ columns }
                dataSource={ nodoExam }
                scroll={{ y: '100%' }}
              />
              <p>Content of Tab Pane 1</p>
              <p>Content of Tab Pane 1</p>
              <p>Content of Tab Pane 1</p>
            </TabPane>
            <TabPane tab="进行中" key="doing">
              <Table
                columns={ columns }
                dataSource={ doingExam }
                scroll={{ y: '100%' }}
              />
              <p>Content of Tab Pane 2</p>
              <p>Content of Tab Pane 2</p>
              <p>Content of Tab Pane 2</p>
            </TabPane>
            <TabPane tab="已结束" key="done">
              <Table
                columns={ columns }
                dataSource={ doneExam }
                scroll={{ y: '100%' }}
              />
              <p>Content of Tab Pane 3</p>
              <p>Content of Tab Pane 3</p>
              <p>Content of Tab Pane 3</p>
            </TabPane>
          </Tabs>
        </div>

        <Foot />
      </div>
    )
  }
}