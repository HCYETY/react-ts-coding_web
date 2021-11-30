import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Select, message, InputNumber, } from 'antd';

import 'style/interviewer/interviewEntrance.less';

import { findInterview } from 'api/modules/interview';
import { findEmail } from 'common/utils';
import Navbar from 'common/components/navbar';

interface Prop {

}

interface State {
  arr: string[];
}
export default class InterviewRoom extends React.Component<Prop, State> {

  state = {
    arr: [];
  }

  async componentDidMount() {
    const res = await findEmail();
    const { allInterview } = res;
    this.setState({ arr: allInterview });
  }

  // 进入面试间的检验函数
  checkInterview = (value: any) => {
    console.log('dddddddddd', value)
    findInterview({ findArr: value }).then(res => {
      if (res.data.status === true) {
        message.success(res.msg);
        window.location.href = value['interviewer_link'];
      } else {
        message.error(res.msg);
      }
    })
    return value['interviewer_link'];
  }

  render() {
    const { arr } = this.state;
    
    return(
      <div>
        <Navbar/>
        <div className="interviewCheck">
          <Form onFinish={ this.checkInterview }>
            <Form.Item 
              label="面试官邮箱" 
              name="interviewer" 
              key="interviewer"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                mode="multiple"
                placeholder="选择参与面试的面试官邮箱账号"
              >
                { arr.map((item: any) => {
                    return(
                      <Select.Option value={ item } key={ item }>{ item }</Select.Option>
                    )
                  }) }
              </Select>
            </Form.Item>

            <Form.Item 
              label="面试间链接" 
              name="interviewer_link" 
              key="interviewer_link"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入要进入的面试间的链接"/>
            </Form.Item>

            <Form.Item 
              label="面试房间号" 
              name="interview_room" 
              key="interview_room"
              rules={[{ required: true }]}
            >
              <InputNumber min={100000} max={999999}/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">点击进入</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}