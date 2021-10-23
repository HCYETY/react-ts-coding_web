import React from 'react';
import { 
  Table,
  Tabs ,
  Space,
} from 'antd';
import {
} from '@ant-design/icons';

import 'style/candidate.css';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import { showPaper } from 'api/modules/interface';
import { getCookie, handleRemainingTime, } from 'src/public/utils';

const { TabPane } = Tabs;

export default class Candidate extends React.Component<any, any> {
  state = {
    allExam: [] = [],
    nodoExam: [] = [],
    doingExam: [] = [],
    doneExam: [] = [],

  };


  componentDidMount() {
    const cookie = getCookie();
    showPaper({ cookie: cookie}).then(res => {
      console.log('res', res)
      const doingArr = handleRemainingTime(res.data, 1);
      const allArr = handleRemainingTime(res.data, 2);
      const nodoArr = handleRemainingTime(res.data, 0);
      const doneArr = handleRemainingTime(res.data, -1);
      this.setState({ 
        allExam: allArr, 
        nodoExam: nodoArr, 
        doingExam: doingArr, 
        doneExam: doneArr 
      });
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
            <a href={ `/show-test?paper=${ record.paper }` }>查看试卷</a>
          </Space>
        ),
      }
    ]
    const { allExam, nodoExam, doingExam, doneExam, } = this.state;

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
            </TabPane>
            <TabPane tab="未开始" key="nodo">
              <Table
                columns={ columns }
                dataSource={ nodoExam }
                scroll={{ y: '100%' }}
              />
            </TabPane>
            <TabPane tab="进行中" key="doing">
              <Table
                columns={ columns }
                dataSource={ doingExam }
                scroll={{ y: '100%' }}
              />
            </TabPane>
            <TabPane tab="已结束" key="done">
              <Table
                columns={ columns }
                dataSource={ doneExam }
                scroll={{ y: '100%' }}
              />
            </TabPane>
          </Tabs>
        </div>

        <Foot />
      </div>
    )
  }
}