import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
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
import { GET_EMAIL } from 'src/useRedux/constant';

interface Prop {
  lookExam: string;
  lookEmail: string;
  changeEmail: any;
  dispatch: any;
}

class ExamInform extends React.Component<Prop> {

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
    const cookie = getCookie(), paper = this.props.lookExam;
    lookOver({ cookie, paper }).then(item => {
      this.setState({ tableArr: item.data.ret }); 
    })
    showTest({ paper }).then(item => {
      this.setState({ examContent: item.data.show });
    })
    showPaper({ paper }).then(item => {
      this.setState({ examInform: item.data });
    })
  }

  render() {
    const { tableArr, examContent, examInform, } = this.state;
    const candidateColumns = [
      { title: '作答情况', dataIndex: 'test_status', key: 'test_status' },
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
            <Link to={ `${ LOOK_OVER }?exam-email=${ record['email'] }` }> 前往批阅 </Link>
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
    const timeBegin = transTime(+examInform.time_begin);
    const timeEnd = transTime(+examInform.time_end);

    return(
      <div className="site-layout exam-inform-box">
        <Navbar/>

        <Layout>
          <div className="site-content-top">
            <div className="site-content-top-left">
              <h1> { this.props.lookExam } </h1>
              <div>
                <span>结束时间：{ timeEnd }</span>
              </div>
            </div>
            <div className="site-content-top-right">
              <span className="nodo">
                <CheckCircleOutlined />
                &nbsp;未参加&nbsp;
              </span>
              <Divider type="vertical"/>
              <span className="doing">
                <ClockCircleOutlined />
                &nbsp;进行中&nbsp;
              </span>
              <Divider type="vertical"/>
              <span className="done">
                <CheckCircleOutlined />
                &nbsp;已结束&nbsp;
              </span>
              <Divider type="vertical"/>
            </div>
          </div>
          <Layout.Content>
            <Tabs defaultActiveKey="exam-report">
              <Tabs.TabPane tab="试卷报告" key="exam-report">
                试卷每道题的作答情况，比如正确率--用折线图、柱形图表示
              </Tabs.TabPane>

              <Tabs.TabPane tab="参与候选人" key="join-candidate">
                <Table
                  bordered
                  columns={ candidateColumns } 
                  dataSource={ [...tableArr] } 
                  onRow={record => {
                    return {
                      onClick: () => { this.props.changeEmail(record['email']); },
                    };
                  }}
                />
              </Tabs.TabPane>

              <Tabs.TabPane tab="试题内容" key="exam-content">
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

function mapStateToProps(state: any) {
  return{
    lookExam: state.lookExam,
    lookEmail: state.lookEmail
  }
}
function mapDispatchToProps(dispatch: any, ownProps: any) {
  return{
    changeEmail: (email: string) => {
      dispatch({
        type: GET_EMAIL,
        lookEmail: email
      });
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExamInform);