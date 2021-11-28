import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
  Table,
  Tabs ,
  Space,
} from 'antd';
import {
} from '@ant-design/icons';

import 'style/candidate/candidateExam.css';
import { showPaper } from 'api/modules/paper';
import { getCookie, handleTime, } from 'common/utils';
import { PAPER_STATUS, CANDIDATE_SHOW_TESTS,  } from 'common/const';
import { GET_PROGRAM_EXAM } from 'src/useRedux/constant';

const { TabPane } = Tabs;

class Candidate extends React.Component<any, any> {

  state = {
    allExam: [] = [],
    nodoExam: [] = [],
    doingExam: [] = [],
    doneExam: [] = [],
  };
  timer: NodeJS.Timer;

  componentDidMount() {
    this.countdown();
  }
  countdown = () => {
    const cookie = getCookie();
    showPaper({ cookie: cookie }).then(ret => {
      const allArr = handleTime(ret.data.show);
      let nodoArr: any[] = [], doingArr: any[] = [], doneArr: any[] = [];

      allArr.map(item => {
        if (item['remaining_time'] === PAPER_STATUS.NODO) {
          nodoArr.push(item);
        } else if (item['remaining_time'] === PAPER_STATUS.DONE || item['remaining_time'] === PAPER_STATUS.OVER) {
          doneArr.push(item);
        } else {
          doingArr.push(item);
        }
      })

      this.setState({ 
        allExam: allArr, 
        nodoExam: nodoArr, 
        doingExam: doingArr, 
        doneExam: doneArr 
      });
    });
    this.timer = setTimeout(() => { this.countdown() }, 1000);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }


  render() {
    const { allExam, nodoExam, doingExam, doneExam, } = this.state;
    const { changeEmail } = this.props;
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
        render: (text: any, record: { paper: string; }) => {
          // changeEmail(record.paper);
          return(
            <Space size="middle">
              <Link to={ `${ CANDIDATE_SHOW_TESTS }?paper=${ record.paper }` }> 查看试卷 </Link>
            </Space>
          )
        }
      }
    ]

    return(
      <div className="card-container candidate-site-layout">
        <h1>你好，{this.props.programExam}</h1>
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

function mapStateToProps(state: any) {
  return{
    programExam: state.programExam
  }
}
function mapDispatchToProps(dispatch: any, ownProps: any) {
  return{
    changeEmail: (exam: string) => {
      dispatch({
        type: GET_PROGRAM_EXAM,
        programExam: exam
      });
    }
  }
}
const CandidateContainer = connect(mapStateToProps, mapDispatchToProps)(Candidate)
export default CandidateContainer;