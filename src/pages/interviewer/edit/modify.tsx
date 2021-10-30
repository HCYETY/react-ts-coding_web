import React from 'react';
import { 
  Layout, 
  Card, 
  Form, 
  Button, 
  message, 
  Input, 
  DatePicker, 
  Select,
  Radio,
} from 'antd';
import { modifyPaper } from 'api/modules/interface';
import { showTest } from 'api/modules/interface';
import { EDIT, TAGS } from 'common/const';
import { getUrlParam } from 'common/utils';
import Navbar from 'common/components/navbar';
import Foot from 'common/components/footer';
import Tabler from 'common/components/tabler';
import Paper from 'common/components/paper';
import 'style/modify.less';

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
  }

  componentDidMount() {
    const url = getUrlParam('paper');
    const req = { paper: url };
    showTest(req).then((testRes) => {
      const arr = [];
      for (let ch of testRes.data) {
        const obj = {
          key: ch.test_name,
          num: ch.num,
          testName: ch.test_name,
          description: ch.test,
          tags: ch.tags,
          level: ch.level,
          point: ch.point,
        }
        arr.push(obj)
      }
      this.setState({
        tableArr: arr,
        loading: false,
        inform: testRes.data[0].paper
      });
    });
  }

  onChange = (e: any) => {
    this.setState({value: e.target.value})
  }

  // 提交修改信息
  onFinish = async (values: any) => {
    console.log(values)
    const { tableArr, inform } = this.state;
    values.modifyTests = tableArr;
    values.oldPaper = inform.paper;
    console.log(values)
    const res = await modifyPaper(values);
    if (res.data.status) {
      message.success(res.msg);
      window.location.href = EDIT;
    } else {
      message.error(res.msg);
    }
  };

  getTest = (val: any) => {
    this.setState({ tableArr: val });
  }

  render() {
    const { inform, loading, tableArr } = this.state;

    return(
      <div className="site-layout">
        <Navbar/>

        {/* <Layout> */}
          <div className="site-card-border-less-wrapper">
            <Card  bordered={false}>
              {!loading && (
                <Form 
                  name="nest-messages" 
                  onFinish={this.onFinish} 
                  initialValues={{ 
                    paper: inform.paper,
                    paperDescription: inform.paper_description,
                    // timeBegin: inform.time_begin,
                    // timeEnd: inform.time_end,
                    answerTime: inform.answer_time,
                    candidate: inform.candidate,
                    check: inform.check,
                  }}
                >
                  <h2 className="site-card-divide">试卷信息</h2> 
                  <Paper />

                  <h2 className="site-card-divide">试题信息</h2> 
                  <Tabler getTests={ tableArr } getTest={ this.getTest.bind(this) }/>
                  
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
        {/* </Layout> */}
      </div>
    )
  }
}