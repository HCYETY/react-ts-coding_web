
import React from 'react';
import { Button, Tabs, Space, notification, Radio, Form, Input, Alert, message, Modal, } from 'antd';

import 'style/interviewer/interviewRoom.css';
import CodeEditor from 'common/components/candidate/codeEditor';
import ShowTest from 'pages/interviewer/communicate/showTest';
import { testObj } from 'common/types';
import { showTest } from 'api/modules/test';
import { submitInterview } from 'api/modules/interview';
import { getCookie, nowTime } from 'common/utils';
import { searchEmail } from 'api/modules/user';
import Socket from 'common/components/Socket';
import Webrtc from 'common/components/Webrtc';

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
  cookie: string;
}
interface showTestObj {
  test_ame: string;
  language: string;
  test: string;
}
// interface showTestObj {
//   num: string;
//   test_name: string;
//   test: string;
//   level: string;
//   point: number;
//   tags: Array<string>;
// }
interface videobj {
  candidate: string;
  id: string;
}
interface State {
  talk: websocketTalkMsg[];
  codeObj: websocketCodeMsg;
  showInterview: boolean;
  showTestSwitch: boolean;
  choiceTestSwitch: boolean;
  showVideo: boolean;
  canVideo: boolean;
  // getVideo: videobj;
  showTest: showTestObj[];
  allTest: testObj[];
}

const cookie = getCookie();

export default class InterviewRoom extends React.Component<Prop, State> {

  socket: Socket = null;
  identity: string = null;

  state = {
    talk: [],
    codeObj: { code: '', cookie: '' },
    showInterview: false,
    showTestSwitch: false,
    choiceTestSwitch: false,
    showVideo: false,
    canVideo: false,
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
        if (Object.keys(receive[0]).filter(item => item==='code').length !== 0) {
          this.setState({ codeObj: receive[0] });
        } else if (receive.canVideo) {
          this.setState({ showVideo: true, canVideo: receive.canVideo });
        } else {
          this.setState({ talk: receive });
        }
      }
    });

    try {
      this.socket.connection();
    } catch(e) {
      message.error(e);
    }
  }

  // 发送 websocket 聊天消息
  sendChat = (msg: any) => {
    msg.id = cookie;
    msg.interviewIdentity = this.identity;
    this.socket.sendMessage(msg);
  }
  // 编辑代码时发送 websocket 请求
  sendCode = (operationObj: any) => {
    this.socket.sendMessage(operationObj);
  }
  // 发送本地视频流
  sendVideo = (val: any) => {
    console.log('查看视频流', val);
    val.id = cookie;
    this.socket.sendMessage(val);
  }
  // 接受通话，告知对端建立连接
  videok = () => {
    this.setState({ showVideo: false });
  }
  // 拒绝通话，告知对端断开连接
  handleCancel = () => {
    // this.socket.sendMessage({ candidate: '', msg: '对方拒绝视频通话'});
    this.setState({ showVideo: false });
    message.success("你已拒绝视频通话");
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
    const { talk, codeObj, showTestSwitch, choiceTestSwitch, showVideo, showTest, allTest } = this.state;
    
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
                        <Button onClick={ this.addTest }>自定义试题</Button>
                        <Button onClick={ this.choiceTest }>
                          { choiceTestSwitch === false ? '从题库中选题' : '取消选题' }
                        </Button>
                      </Space>
                    </div> :
                    <div className="program-inform">
                      <div className="program-left-after">
                        <span>任务</span>
                        <Button onClick={ this.choiceTest }>
                          { choiceTestSwitch === false ? '再出一题' : '取消出题' }
                        </Button>
                      </div>
                      <div className="testName">{ showTest.test_name }</div> 
                      <div className="proviso">{ showTest.language }</div> 
                      <div className="testInform" >
                        <span dangerouslySetInnerHTML={{ __html: showTest.test }}></span>  
                      </div> 
                    </div>
                  }
                </div>
                <div className="program-right">
                  {
                    choiceTestSwitch === false ?
                    <CodeEditor sendCode={ this.sendCode } codeObj={ codeObj }/> :
                    allTest.map(item => {
                      return(
                        <div className="program-right-after">
                          <ShowTest inform={ item } getTest={ this.getTest }/>
                        </div>
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
          {/* 视频通话部分 */}
          <Webrtc sendVideo={ this.sendChat } />

          {/* 文字聊天部分 */}
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

        <Modal 
          title="视频通话" 
          visible={ showVideo } 
          onOk={ this.videok } 
          onCancel={ this.handleCancel }
          cancelText="拒绝"
          okText="接受"
        >
          <p>收到一个视频通话，是否接通？</p>
        </Modal>
      </div>
    )
  }
}