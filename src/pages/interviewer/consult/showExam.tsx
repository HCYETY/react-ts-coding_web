import React from 'react';
import { Link, } from 'react-router-dom';
import { 
  Layout,
  Table,
  Tag,
} from 'antd';
import { 
} from '@ant-design/icons';

import { EXAM_INFORM, LOOK_OVER, PAPER_CONSULT, PAPER_STATUS } from 'common/const';
import Navbar from 'common/components/navbar';
import { showPaper } from 'api/modules/paper';

import { connect } from 'react-redux';
import { GET_EXAM } from 'useRedux/constant';
import { getCookie, transTime } from 'common/utils';

interface Prop {
  lookExam: string;
  changeEmail: any;
  dispatch: any
}

class ShowExam extends React.Component<Prop> {

  state = {
    examArr: [] = [],
  }

  componentDidMount() {
    const cookie = getCookie();
    showPaper({ cookie, interviewer: true }).then(result => {
      const res = result.data.show;
      const nowtime = new Date().getTime();
      console.log('res', res)
      res.map((item: any) => {
        const timeBegin = Number(item.time_begin);
        const timeEnd = Number(item.time_end);
        item.time_begin = transTime(timeBegin);
        item.time_end = transTime(timeEnd);
        item.ought_num = item.candidate.length + '人';
        item.status = item.time_end < nowtime ? PAPER_STATUS.END : item.time_begin > nowtime ? PAPER_STATUS.WILL : PAPER_STATUS.ING;
        item.look_over = item.look_over === false ? PAPER_CONSULT.NO : PAPER_CONSULT.YES;
      })
      this.setState({ examArr: res });
    });
  }

  render() {
    const { changeEmail } = this.props;
    const { examArr } = this.state;
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
            <Link to={`${ EXAM_INFORM }?exam=${ record.paper }`}>
              查看试卷情况
            </Link>
          )
        }
      }
    ];

    return(
      <div className="site-layout">
        <Navbar/>

        <Layout.Content>
          <Table
            bordered
            columns={ columns } 
            dataSource={ [...examArr] } 
            onRow={record => {
              return {
                onClick: () => { changeEmail(record['paper']) }
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
    lookExam: state.lookExam
  }
}
function mapDispatchToProps(dispatch: any, ownProps: any) {
  return{
    changeEmail: (exam: string) => {
      dispatch({
        type: GET_EXAM,
        lookExam: exam
      });
    }
  }
}
const ShowExamContainer = connect(mapStateToProps, mapDispatchToProps)(ShowExam)
export default ShowExamContainer;