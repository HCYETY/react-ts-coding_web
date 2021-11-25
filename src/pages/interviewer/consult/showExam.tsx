import React from 'react';
import { Link, BrowserRouter  as Router, Route, } from 'react-router-dom';
import { 
  Layout,
  Table,
  Tag,
} from 'antd';
import { 
} from '@ant-design/icons';
import { getCookie, transTime } from 'common/utils';
import { search } from 'api/modules/candidate';
import { CANDIDATE, EXAM_INFORM, LOOK_OVER, PAPER_CONSULT, PAPER_STATUS } from 'common/const';
import Navbar from 'common/components/navbar';
import { lookOver, showPaper } from 'api/modules/paper';
import ExamInformContainer from 'pages/interviewer/consult/examInform';

import { connect } from 'react-redux';
import store from 'useRedux/store';
import { GET_EXAM } from 'useRedux/constant';

interface Prop {
  exam: string;
  changeState: any;
  dispatch: any
}

class ShowExam extends React.Component<Prop> {

  state = {
    tableArr: [] = [],
    exam: '',
  }
  componentDidMount() {
    showPaper().then(result => {
      const res = result.data.show;
      const nowtime = new Date().getTime();
      res.map((item: any) => {
        const timeBegin = Number(item.time_begin);
        const timeEnd = Number(item.time_end);
        item.time_begin = transTime(timeBegin);
        item.time_end = transTime(timeEnd);
        item.ought_num = item.candidate.length + '人';
        // item.look_over === false ? item.look_over = PAPER_CONSULT.NO : item.look_over = PAPER_CONSULT.YES;
        // item.join_num = 
        item.status = timeEnd < nowtime ? PAPER_STATUS.END : timeBegin > nowtime ? PAPER_STATUS.WILL : PAPER_STATUS.ING;
      })
      this.setState({ tableArr: res });
    });
  }

  render() {
    const { tableArr } = this.state;
    const columns = [
      { 
        title: '状态', 
        dataIndex: 'status', 
        key: 'status',
        // render: (status: string) => {
        //   <span>
        //     {(status: string) => {
        //       let color = status === PAPER_STATUS.WILL ? 'yellow' : status === PAPER_STATUS.ING ? 'green' : 'red';
        //       return (
        //         <Tag color={ color } key={ status }>
        //           { status }
        //         </Tag>
        //       );
        //     }}
        //   </span>
        // }
      },
      { title: '试卷', dataIndex: 'paper', key: 'paper' },
      { title: '时长', dataIndex: 'answer_time', key: 'answer_time' },
      { title: '已参与', dataIndex: 'join_num', key: 'join_num' },
      { title: '应参与', dataIndex: 'ought_num', key: 'ought_num' },
      { title: '开放时间', dataIndex: 'time_begin', key: 'time_begin' },
      { title: '截止时间', dataIndex: 'time_end', key: 'time_end' },
      { title: '总题数', dataIndex: 'tests_num', key: 'tests_num' },
      { title: '是否批阅', dataIndex: 'look_over', key: 'look_over' },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text: any, record: any) => {
          return(
              // <a href={`${ MODIFY }?paper=${ record.paper }`}><FormOutlined/>修改试卷</a>
          <Link to={`${ EXAM_INFORM }?exam=${ record.paper }`}>
            跳转
          </Link>
          )
        }
      }
    ];
    const { exam, changeState } = this.props;

    return(
      <div className="site-layout">
        <Navbar/>
        <h1>当前求和为：{ exam }</h1>

        <Layout.Content>
          <Table
            bordered
            columns={ columns } 
            dataSource={ [...tableArr] } 
            onRow={record => {
              return {
                onClick: () => { 
                  this.setState({ exam: record['paper'] }, () => {
                    changeState(record['paper'])
                    // window.location.href = `${ EXAM_INFORM }?exam=${ record['paper'] }` 
                    
                    {
                      <Link to={`${ EXAM_INFORM }?exam=${ record['paper'] }` }/>
                    }

                    // return(
                    //   <a href={`${ EXAM_INFORM }?exam=${ record['paper'] }`}></a>
                    // )
                  });
                  // return(
                  //   <Router>
                  //     <Route path={ EXAM_INFORM } component={ ExamInformContainer }></Route>
                  //   </Router>
                  // )
                }, // 点击行
              };
            }}
          />
        </Layout.Content>
      </div>
    )
  }
}

function mapStateToProps(state: any) {
  return{
    exam: state.exam
  }
}
function mapDispatchToProps(dispatch: any, ownProps: any) {
  return{
    changeState: (exam: string) => {
      dispatch({
        type: GET_EXAM,
        exam: exam
      });
    }
  }
}
const ShowExamContainer = connect(mapStateToProps, mapDispatchToProps)(ShowExam)
export default ShowExamContainer;