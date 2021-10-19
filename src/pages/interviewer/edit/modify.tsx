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
  Tag,
  Space,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { modifyPaper } from 'src/api/modules/interface';
import { showTest } from 'src/api/modules/interface';
import { TAGS } from 'public/const';
import Navbar from 'public/components/navbar';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import Tabler from 'public/components/tabler';
import { getUrlParam } from 'public/utils';
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
      time: '', 
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

  // 添加试题
  addTest = () => {
  }

  // 提交修改信息
  onFinish = async (values: any) => {
    console.log(values)
    values.oldPaper = this.state.inform.paper;
    const res = await modifyPaper(values);
    if (res.status) {
      message.success(res.msg);
      // window.location.href = '/edit';
    } else {
      message.error(res.msg);
    }
  };

  render() {
    const { inform, loading, tableArr } = this.state;

    return(
      <Layout>
        <Navbar/>

        <Layout>
          <Head/>

          <div className="site-card-border-less-wrapper">
            <Card  bordered={false}>
              {!loading && (
                <Form 
                  name="nest-messages" 
                  onFinish={this.onFinish} 
                  initialValues={{ 
                    paper: inform.paper,
                    paperDescription: inform.paper_description,
                    moment: inform.time,
                    candidate: inform.candidate,
                    check: inform.check,
                  }}
                >
                  <h2 className="site-card-divide">试卷信息</h2> 
                  <Form.Item
                    name="paper" 
                    label="试卷名称" 
                    validateStatus="validating"
                    className="paper"
                  >
                    <Input/>
                  </Form.Item>

                  <Form.Item name="time" label="试卷起始时间" className="time">
                    <DatePicker.RangePicker />
                  </Form.Item>

                  <Form.Item
                    name="paperDescription" 
                    label="试卷描述" 
                    className="paperDescription"
                  >
                    <Input.TextArea/>
                  </Form.Item>

                  <Form.Item name="candidate" label="邀请候选人答卷（选填）">
                    <Select 
                      mode="tags" 
                      style={{ width: '100%' }} 
                      placeholder="输入想邀请的候选人的邮箱账号" 
                    >
                      {/* <Select.Option key={i.toString(36) + i}></Select.Option> */}
                    </Select>
                  </Form.Item>

                  <Form.Item  name="check"  label="试卷过期之后候选人/所有人是否可查看">
                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  </Form.Item>


                  <h2 className="site-card-divide">试题信息</h2> 
                  <Tabler getTests={ tableArr }/>
                  
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
        </Layout>
      </Layout>
    )
  }
}