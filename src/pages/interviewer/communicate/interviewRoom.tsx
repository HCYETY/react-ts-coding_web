
import React from 'react';
import { Button, Tabs, Space, notification, Radio, Form, Input, Alert, message, } from 'antd';

import 'style/interviewer/interviewRoom.css';
import CodeEditor from 'common/components/candidate/codeEditor';
import ShowTest from 'pages/interviewer/communicate/showTest';
import { testObj } from 'common/types';
import { showTest } from 'api/modules/test';
import { submitInterview } from 'api/modules/interview';
import { getCookie } from 'common/utils';
import { searchEmail } from 'api/modules/user';
import Socket from 'common/components/Socket';
import Websocket from 'common/components/Socket';

interface Prop {

}

interface websocketTalkMsg {
  time: string;
  identity: string;
  msg: string;
  name: string;
}
interface websocketCodeMsg {
  code: string;
  isEditor: boolean;
}
interface showTestObj {
  testName: string;
  language: string;
  test: string;
}
interface State {
  talk: websocketTalkMsg[];
  codeArr: websocketCodeMsg[];
  showInterview: boolean;
  showTestSwitch: boolean;
  choiceTestSwitch: boolean;
  showTest: showTestObj[];
  allTest: testObj[];
}

const cookie = getCookie();

export default class InterviewRoom extends React.Component<Prop, State> {

  socket: Websocket = null;
  identity: string = null;

  state = {
    talk: [],
    codeArr: [],
    showInterview: false,
    showTestSwitch: false,
    choiceTestSwitch: false,
    showTest: [],
    allTest: [],
  }
  
  async componentDidMount() {
    // 查看当前用户的身份，是面试官还是候选人
    await searchEmail({ cookie }).then(res => {
      this.identity = res.data.identity;
    })

    this.openNotificationWithIcon('success');
    this.socket = new Socket({ 
      socketUrl: 'ws://localhost:8888',
      identity: this.identity,
      openMsg: { cookie, interviewIdentity: this.identity },
      returnMessage: (receive: any) => {
        const len = Object.keys(receive[0]).length;
        if (len === 2) {
          this.setState({ codeArr: receive });
        } else {
          this.setState({ talk: receive });
        }
      }
    });

    try{
      this.socket.connection();
    } catch(e) {
      message.error(e);
    }
  }

  // 发送 websocket 消息
  sendChat = (msg: any) => {
    msg.id = cookie;
    msg.interviewIdentity = this.identity;
    this.socket.sendMessage(msg);
  }
  // 编辑代码时发送 websocket 请求
  sendCode = (code: any) => {
    const codeObj = { code, isEditor: true };
    this.socket.sendMessage(codeObj);
  }

  // 弹出 antd 提醒框
  openNotificationWithIcon = (type: string) => {
    notification[type]({
      message: ' 号房间',
      description:
        '您已进入面试间，即将开始面试！'
    });
  };
  
  // 面试官自己编写试题
  addTest = () => {

  }
  // 面试官从已有题库中挑选试题
  choiceTest = () => {
    const { choiceTestSwitch } = this.state;
    showTest().then(res => {
      this.setState({ choiceTestSwitch: !choiceTestSwitch, allTest: res.data.show });
    })
  }
  // 面试官选择好试题之后，更改控制页面显示的按钮的状态
  getTest = (val: any) => {
    this.setState({ showTestSwitch: true, choiceTestSwitch: false, showTest: val });
  }

  // 面试官提交面试评价的回调函数
  submitEvaluation = (value: any) => {
    const interviewer_link = window.location.pathname + window.location.search;
    value.interviewer_link = interviewer_link;
    submitInterview({ submitArr: value }).then(res => {
      if (res.data.status === true) {
        message.success(res.msg);
      }
    })
  }

  render() {
    const { talk, codeArr, showTestSwitch, choiceTestSwitch, showTest, allTest } = this.state;

    return(
      <div className="box">
        <div className="box-left">
          <Tabs defaultActiveKey="program">
            <Tabs.TabPane tab="代码考核" key="program">
              <div className="program">
                <div className="program-left">
                  {
                    showTestSwitch === false ?
                    <div className="program-left-before">
                      <Space direction="vertical">
                        <Button onClick={ this.addTest }>新增试题</Button>
                        <Button onClick={ this.choiceTest }>从题库中选题</Button>
                      </Space>
                    </div> :
                    <div className="program-inform">
                      <div className="program-left-after">
                        <span>任务</span>
                        <Button onClick={ this.choiceTest }>
                          { choiceTestSwitch === false ? '再出一题' : '取消出题' }
                        </Button>
                      </div>
                      <div className="testName">{ showTest.testName }</div> 
                      <div className="proviso">{ showTest.language }</div> 
                      <div className="testInform" dangerouslySetInnerHTML={{ __html: showTest.test }}></div> 
                    </div>
                  }
                </div>
                <div className="program-right">
                  {
                    choiceTestSwitch === false ?
                    <CodeEditor sendCode={ this.sendCode } code={ codeArr }/> :
                    allTest.map(item => {
                      return(
                        <ShowTest inform={ item } getTest={ this.getTest }/>
                      )
                    })
                  }
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="简历查看" key="resume">
              <div className="resume-left"></div>
              <div className="resume-right"></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="笔试成绩" key="achievement">
              <div className="achievement-left"></div>
              <div className="achievement-right"></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="面试评价" key="evaluation">
              <span>面试评价</span>
              <span>候选人无法查看您的评价</span>
              <Form onFinish={ this.submitEvaluation }>
                <Form.Item
                  label="面试综合评价"
                  name="evaluation"
                  key="evaluation"
                >
                  <Radio.Group>
                    <Radio value="卓越">5（卓越）</Radio>
                    <Radio value="优秀">4（优秀）</Radio>
                    <Radio value="标准">3（标准）</Radio>
                    <Radio value="搁置">2（搁置）</Radio>
                    <Radio value="淘汰">1（淘汰）</Radio>
                  </Radio.Group>
                </Form.Item>
                <Alert message="注意：3-5分为通过，1-2分为淘汰" type="error" />

                <span>评语（优势/劣势/需下轮面试官关注点）：</span>
                <Form.Item
                  name="comment"
                  key="comment"
                >
                  <Input.TextArea placeholder="在此输入您的评语，输入内容将即时保存"/>
                </Form.Item>

                <Form.Item >
                  <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </div>

        <div className="box-right">
          {/* <Socket/> */}
          <div className="box-right-show-inform">
            {
              talk.length > 0 && talk.map(item => {
                return (
                  <div>
                    <span>{ item.time }&nbsp;</span>
                    <span style={{ color: 'blue' }}>{ item.identity === '系统' || item.id !== cookie ? item.identity : '我' }&nbsp;</span>
                    <span>：{ !item.name ? null : item.id === cookie ? '你' : item.name }{ item.msg }</span>
                  </div>
                )
              })
            }
          </div>

          <Form onFinish={ this.sendChat }>
            <Form.Item name="inputInform" key="inputInform">
              <Input placeholder="请输入聊天内容"></Input>
            </Form.Item>
            <span>回车键发送</span>
          </Form>
        </div>
      </div>
    )
  }
}