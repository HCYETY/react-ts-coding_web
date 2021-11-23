import React from 'react';
import { 
  Card, 
  Form, 
  Button, 
  message,
  FormInstance, 
} from 'antd';
import moment from 'moment';

import { modifyPaper } from 'api/modules/paper';
import { showTest } from 'api/modules/test';
import { EDIT, MANAGE, TAGS } from 'common/const';
import { getUrlParam } from 'common/utils';
import Navbar from 'common/components/navbar';
import Foot from 'common/components/footer';
import Tabler from 'src/common/components/interviewer/tabler';
import Paper from 'src/common/components/interviewer/paper';
import 'style/interviewer/modify.less';

export default class Modify extends React.Component<any, any> {
  state = {
    loading: true,
    value: 0,
    tableArr: [] = [],
    visible: false,
    inform: { 
      paper: '', 
      paper_description: '',
      time_begin: '', 
      time_end: '', 
      answer_time: '', 
      candidate: [''],
      check: '', 
      paper_point: 0,
    },
    hour: 0,
    minute: 0,
  }

  componentDidMount() {
    const url = getUrlParam('paper');
    const req = { paper: url };
    showTest(req).then((testRes) => {
      const arr = [];
      for (let ch of testRes.data.show) {
        const obj = {
          key: ch.test_name,
          num: ch.num,
          testName: ch.test_name,
          description: ch.test,
          // ...ch
          tags: ch.tags,
          level: ch.level,
          point: ch.point,
        }
        arr.push(obj)
      }
      this.setState({
        tableArr: arr,
        loading: false,
        inform: testRes.data.show[0].paper
      });
    });
  }

  onChange = (e: any) => {
    this.setState({value: e.target.value})
  }

  // 提交修改信息
  onFinish = async (values: any) => {
    const { tableArr, inform, hour, minute } = this.state;
    values.answerTime = hour + '小时' + minute + '分钟';
    values.modifyTests = tableArr;
    values.oldPaper = inform.paper;
    console.log(values)
    const res = await modifyPaper(values);
    if (res.data.status) {
      message.success(res.msg);
      window.location.href = MANAGE;
    } else {
      message.error(res.msg);
    }
  };

  getTest = (val: any) => {
    this.setState({ tableArr: val });
  }
  getHour = (val: number) => {
    this.setState({ hour: val });
  }
  getMinute = (val: number) => {
    this.setState({ minute: val });
  }

  render() {
    const { inform, loading, tableArr } = this.state;
    const timeBegin = new Date(Number(inform.time_begin));
    const timeEnd = new Date(Number(inform.time_end));

    return(
      <div className="site-layout">
        <Navbar/>

        <div className="site-card-border-less-wrapper">
          <Card  bordered={false}>
            {!loading && (
              <Form 
                name="nest-messages" 
                onFinish={this.onFinish} 
                initialValues={{ 
                  paper: inform.paper,
                  paperDescription: inform.paper_description,
                  timeBegin: moment(timeBegin),
                  timeEnd: moment(timeEnd),
                  answerTime: inform.answer_time,
                  candidate: inform.candidate,
                  check: inform.check,
                }}
              >
                <h2 className="site-card-divide">试卷信息</h2> 
                <Paper getHour={ this.getHour.bind(this) } getMinute={ this.getMinute.bind(this) }/>

                <h2 className="site-card-divide">试题信息</h2> 
                <Tabler pushTests={ tableArr } getTest={ this.getTest.bind(this) }/>
                
                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            )}

          </Card>
        </div>

        <Foot/>
      </div>
    )
  }
}