import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Select, message, InputNumber, } from 'antd';

import 'style/interviewer/interviewEntrance.less';

import { findInterview } from 'api/modules/interview';
import { findEmail } from 'common/utils';
import Navbar from 'common/components/navbar';
import { RefSelectProps } from 'antd/lib/select';

interface Prop {

}

interface State {
  interviewArr: string[];
  interviewRoomArr: string[];
  interviewLinkArr: string[];
}
export default class InterviewRoom extends React.Component<Prop, State> {

  state = {
    interviewArr: [],
    interviewRoomArr: [],
    interviewLinkArr: [],
  }

  async componentDidMount() {
    const res = await findEmail();
    const { allInterview } = res;
    this.setState({ interviewArr: allInterview });
  }

  changeSelect = async (value: any) => {
    const { interviewRoomArr, interviewLinkArr } = this.state;
    if (value) {
      const res = await findInterview({ interviewer: value });
      res.data.ret.map((item: { interview_room: any; interviewer_link: any; }) => {
        interviewRoomArr.push(item.interview_room);
        interviewLinkArr.push(item.interviewer_link);
      })
      this.setState({ interviewRoomArr, interviewLinkArr })
    }
  }
  choiceInterviewLink = async (value: any) => {
    console.log(value)
    const { interviewRoomArr } = this.state;
    interviewRoomArr.map(item => {
      item
    })
  }

  // 进入面试间的检验函数
  checkInterview = (value: any) => {
    findInterview({ findArr: value }).then(res => {
      if (res.data.status === true) {
        message.success(res.msg);
        window.location.href = value['interviewer_link'];
      } else {
        message.error(res.msg);
      }
    })
  }

  render() {
    const { interviewArr, interviewRoomArr, interviewLinkArr } = this.state;
    
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
                placeholder="选择参与面试的面试官邮箱账号"
                onChange={ this.changeSelect }
              >
                { interviewArr.map((item: any) => {
                    return(
                      <Select.Option  value={ item } key={ item }>{ item }</Select.Option>
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
              <Select
                showSearch
                placeholder="请输入要进入的面试间的链接"
                onFocus={ this.choiceInterviewLink }
              >
                { interviewLinkArr.map((item: any) => {
                    return(
                      <Select.Option value={ item } key={ item }>{ item }</Select.Option>
                    )
                  }) }
              </Select>
              {/* <Input onClick={ this.choice } placeholder="请输入要进入的面试间的链接"/> */}
            </Form.Item>

            <Form.Item 
              label="面试房间号" 
              name="interview_room" 
              key="interview_room"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="请输入要进入的面试房间号"
              >
                { interviewRoomArr.map((item: any) => {
                    return(
                      <Select.Option value={ item } key={ item }>{ item }</Select.Option>
                    )
                  }) }
              </Select>
              {/* <InputNumber onClick={ this.choice } min={100000} max={999999}/> */}
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