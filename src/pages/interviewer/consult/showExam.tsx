import React from 'react';
import { Link, Route, Router, } from 'react-router-dom';
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

export default class LookOver extends React.Component {

  state = {
    tableArr: [] = [],
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
    ];
    
    return(
      <div className="site-layout">
        <Navbar/>
        <Layout.Content>
          <Table
            bordered
            columns={ columns } 
            dataSource={ [...tableArr] } 
            onRow={record => {
              return {
                onClick: () => { 
                  // return(
                    // <Route>
                    //   <Link to={"/exam-inform?exam=" + record['paper']}></Link>
                    // </Route>
                  // )
                  window.location.href = `${ EXAM_INFORM }?exam=${ record['paper'] }` 
                }, // 点击行
                onMouseEnter: event => { console.log('xxxxx', record) }, // 鼠标移入行
              };
            }}
          />
        </Layout.Content>
      </div>
    )
  }
}