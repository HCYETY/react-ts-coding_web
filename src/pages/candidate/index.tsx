import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
  Table,
  Tabs ,
  Space,
  message,
} from 'antd';
import {
  FileSearchOutlined,
} from '@ant-design/icons';
import copy from 'copy-to-clipboard';

import 'style/candidate/candidateExam.css';
import { showPaper } from 'api/modules/paper';
import { getCookie, handleTime, nowTime, transTime, } from 'common/utils';
import { PAPER_STATUS, CANDIDATE_SHOW_TESTS, INTERVIEW_STATUS,  } from 'common/const';
import { GET_PROGRAM_EXAM } from 'src/useRedux/constant';
import { findInterview } from 'src/api/modules/interview';

interface Prop {
  changeEmail;
  programExam;
}

interface State {

}

class Candidate extends React.Component<Prop, State> {

  state = {
    allExam: [] = [],
    nodoExam: [] = [],
    doingExam: [] = [],
    doneExam: [] = [],
    interviewInform: [] = [],
  };
  timer: NodeJS.Timer;

  componentDidMount() {
    this.findInterviewInform();
    this.reqExam();
    this.countdown();
  }
  
  findInterviewInform = async () => {
    const cookie = getCookie();
    const res = await findInterview({ cookie, isInterviewer: false });
    res.data.ret.map(item => {
      item['interview_begin_time'] = transTime(+item['interview_begin_time']);
      item['interview_status'] = nowTime() >= item['interview_status'] ? INTERVIEW_STATUS.ING : INTERVIEW_STATUS.ON;
    })
    this.setState({ interviewInform: res.data.ret });
  }

  reqExam = () => {
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
  
  countdown = () => {
    
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }


  render() {
    const { allExam, nodoExam, doingExam, doneExam, interviewInform } = this.state;
    const { changeEmail } = this.props;
    const columns = [
      { title: '??????', dataIndex: 'paper', key: 'paper' },
      { title: '????????????', dataIndex: 'paper_description', key: 'paper_description' },
      { title: '????????????', dataIndex: 'time_begin', key: 'time_begin' },
      { title: '????????????', dataIndex: 'time_end', key: 'time_end' },
      { title: '????????????', dataIndex: 'remaining_time', key: 'remaining_time' },
      { title: '????????????', dataIndex: 'answer_time', key: 'answer_time' },
      { 
        title: '????????????', 
        dataIndex: 'tests_num', 
        key: 'tests_num',
        sorter: (a: any, b: any) => a.tests_num - b.tests_num,
      },
      { 
        title: '???????????????', 
        dataIndex: 'paper_point',
        key: 'paper_point',
        sorter: (a: any, b: any) => a.paper_point - b.paper_point,
      },
      {
        title: '??????',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: { paper: string; }) => {
          return(
            <Space size="middle">
              <Link onClick={ () => changeEmail(record.paper) } to={ `${ CANDIDATE_SHOW_TESTS }?paper=${ record.paper }` }> ???????????? </Link>
            </Space>
          )
        }
      }
    ]
    const interviewColumns = [
      { title: '?????????', dataIndex: 'interviewer', key: 'interviewer' },
      { title: '???????????????', dataIndex: 'interview_room', key: 'interview_room' },
      { title: '??????????????????', dataIndex: 'interview_begin_time', key: 'interview_begin_time' },
      { 
        title: '????????????', 
        dataIndex: 'candidate_link', 
        key: 'candidate_link',
        render: (candidate_link: any) => {
          return(
            <div>
              <a onClick={ () => {
                copy(`${ window.location.origin }${ candidate_link }`)
                message.success('?????????????????????????????????'); 
              }}>
                <FileSearchOutlined />????????????
              </a>
            </div>
          )
        }
      },
      { title: '??????', dataIndex: 'interview_status', key: 'interview_status' },
      {
        title: '??????',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: { paper: string; }) => {
          return(
            <Space size="middle">
              <Link to={ record['candidate_link'] }> ????????? </Link>
            </Space>
          )
        }
      }
    ]

    return(
      <div className="card-container candidate-site-layout">
        <Tabs type="card">
          <Tabs.TabPane tab="??????" key="all">
            <Table
              columns={ columns }
              dataSource={ allExam }
              scroll={{ y: '100%' }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="?????????" key="nodo">
            <Table
              columns={ columns }
              dataSource={ nodoExam }
              scroll={{ y: '100%' }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="?????????" key="doing">
            <Table
              columns={ columns }
              dataSource={ doingExam }
              scroll={{ y: '100%' }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="?????????" key="done">
            <Table
              columns={ columns }
              dataSource={ doneExam }
              scroll={{ y: '100%' }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="?????????" key="room">
            <Table
              columns={ interviewColumns }
              dataSource={ interviewInform }
              scroll={{ y: '100%' }}
            />
          </Tabs.TabPane>
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