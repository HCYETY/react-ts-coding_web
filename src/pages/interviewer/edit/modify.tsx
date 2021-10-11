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
  Col,
  Row,
} from 'antd';
import { modifyPaper } from 'src/api/modules/interface';
import { showPaper } from 'src/api/modules/interface';
import { TAGS } from 'public/const';
import Navbar from 'public/components/navbar';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import {getUrlParam} from 'public/utils';
import 'style/modify.less';

export default class Modify extends React.Component{
  state = {
    loading: true,
    value: 0,
    inform: { 
      paper: '', 
      level: '', 
      status: '', 
      time: '', 
      pass: '', 
      paperNum: 1, 
      remaining_time: '', 
      check: '', 
      tags: '',
      candidate: ['']
    },
  }

  componentDidMount() {
    const url = getUrlParam('paper');
    const req = { paper: url };
    showPaper(req).then(res => {
      this.setState({
        inform: res.show,
        loading: false
      });
    })
  }

  render() {
    const { inform, loading } = this.state;

    const onChange = (e: any) => {
      this.setState({value: e.target.value})
    }

    const onFinish = async (values: any) => {
      console.log(values)
      values.oldPaper = inform.paper;
      const res = await modifyPaper(values);
      if (res.status) {
        message.success(res.msg);
        // window.location.href = '/edit';
      } else {
        message.error(res.msg);
      }
    };

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
                  onFinish={onFinish} 
                  initialValues={{ 
                    paper: inform.paper,
                    level: inform.level,
                    tags: inform.tags,
                    check: inform.check,
                    remaining_time: inform.remaining_time,
                    candidate: inform.candidate,
                    // time: inform.time,
                  }}
                >
                  <h3 className="site-card-divide">试卷信息</h3> 
                  <Row>
                    <Col>
                      <Form.Item
                        name="paper" 
                        label="试卷名称" 
                        validateStatus="validating"
                        className="paper"
                      >
                        <Input/>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item name="level" label="试卷难度" className="level">
                        <Select >
                          <Select.Option value="简单" className="easy">简单</Select.Option>
                          <Select.Option value="中等" className="middle">中等</Select.Option>
                          <Select.Option value="困难" className="hard">困难</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item name="time" label="试卷起始时间" className="time">
                        <DatePicker.RangePicker />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="tags" label="试卷标签" className="tags">
                    <Select 
                      mode="tags" 
                      style={{ width: '100%' }} 
                      placeholder="录入试卷标签" 
                    >
                      {
                        TAGS.map(x => (
                          <Select.Option key={x.key} value={x.value}>{x.value}</Select.Option>
                        ))
                      }
                    </Select>
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
                    <Radio.Group onChange={onChange} value={this.state.value}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <h3 className="site-card-divide">试题信息</h3> 
                  
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