import React from 'react';
import { 
  Table,
  Tabs ,
  Space,
} from 'antd';
import {
} from '@ant-design/icons';

import 'style/candidateExam.css';
import { showPaper } from 'api/modules/paper/interface';
import { getCookie, handleTime, } from 'common/utils';
import { SHOW_TESTS,  } from 'common/const';

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
    showPaper({ cookie: cookie }).then(ret => {
      const res = ret.data.show;
      const allArr = handleTime(res, 2);
      const doingArr = handleTime(res, 1);
      const doneArr = handleTime(res, -1);
      const nodoArr = handleTime(res, 0);

      console.log('===========doneArr', doneArr)
      console.log('===========doingArr', doingArr)
      console.log('===========allArr', allArr)
      console.log('===========nodoArr', nodoArr)

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
        dataIndex: 'paper_point',
        key: 'paper_point',
        sorter: (a: any, b: any) => a.paper_point - b.paper_point,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: { paper: string; }) => (
          <Space size="middle">
            <a href={ `${ SHOW_TESTS }?paper=${ record.paper }` }>查看试卷</a>
          </Space>
        ),
      }
    ]
    const { allExam, nodoExam, doingExam, doneExam, } = this.state;

    return(
      <div className="card-container candidate-site-layout">
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
    )
  }
}