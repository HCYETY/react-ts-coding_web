import React from 'react';
import { Layout, Card, Form, Button, message, Input, DatePicker, Select } from 'antd';
import { modifyPaper } from 'src/api/modules/interface';
import { showPaper } from 'src/api/modules/interface';
import Navbar from 'public/components/navbar';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import {getUrlParam} from 'public/utils';
import 'style/modify.less';

export default class Modify extends React.PureComponent{
  state = {
    inform: {},
  }

  componentDidMount() {
    const url = getUrlParam('paper');
    const req = { paper: url };
    showPaper(req).then(res => {
      this.setState({inform: res.show});
      console.log('dddddddddd', res.show)
    })
    console.log(this.state.inform)
  }

  render() {
    const onFinish = async (values: any) => {
      console.log(values)
      const res = await modifyPaper(values);
      if (res.status) {
        message.success(res.msg);
        // window.location.href = '/edit';
      } else {
        message.error(res.msg);
      }
    };

    const { inform } = this.state;

    return(
      <Layout>
        <Navbar/>

        <Layout>
          <Head/>

          <div className="site-card-border-less-wrapper">
            <Card title="Card title" bordered={false}>
              <Form 
                name="nest-messages" 
                onFinish={onFinish} 
              >
                <Form.Item
                  name="paper" 
                  label="试卷名称" 
                  validateStatus="validating"
                  className="paper"
                >
                  <Input />
                </Form.Item>

                <Form.Item name="level" label="试卷难度" className="level">
                  <Select>
                    <Select.Option value="简单" className="easy">简单</Select.Option>
                    <Select.Option value="中等" className="middle">中等</Select.Option>
                    <Select.Option value="困难" className="hard">困难</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="time" label="试卷起始时间" className="time">
                  <DatePicker.RangePicker />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    提交修改
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>

          <Foot/>
        </Layout>
      </Layout>
    )
  }
}