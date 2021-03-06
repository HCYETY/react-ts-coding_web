
import React from 'react';
import { Button, Tabs, Space, notification, Radio, Form, Input, Alert, message, Modal, } from 'antd';

import 'style/interviewer/interviewRoom.css';
import CodeEditor from 'common/components/candidate/codeEditor';
import ShowTest from 'pages/interviewer/interview/showTest';
import { testObj } from 'common/types';
import { showTest } from 'api/modules/test';
import { submitInterview } from 'api/modules/interview';
import { getCookie, nowTime } from 'common/utils';
import { searchEmail } from 'api/modules/user';
import Socket from 'common/components/Socket';
import Webrtc from 'common/components/Webrtc';
import { WS_TYPE } from 'src/common/const';

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
  test_name: string;
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
  type: WS_TYPE;
}
interface reqVideobj {
  showVideo: boolean;
  id: string;
  identity: string;
  type: WS_TYPE;
  sign: boolean;
}
interface resVideobj {
  canVideo: boolean;
  id: string;
  identity: string;
  type: WS_TYPE;
  sign: boolean;
}
interface resOffObj {
  offer: any;
  id: string;
  identity: string;
  type: WS_TYPE;
  sign: boolean;
}
interface resAnsObj {
  sdp: any;
  id: string;
  identity: string;
  type: WS_TYPE;
  sign: boolean;
}
interface resIceObj {
  candidate: any;
  id: string;
  identity: string;
  type: WS_TYPE;
  sign: boolean;
}
interface State {
  talk: websocketTalkMsg[];
  codeObj: websocketCodeMsg;
  showInterview: boolean;
  showTestSwitch: boolean;
  choiceTestSwitch: boolean;
  reqVideo: reqVideobj;
  resVideo: resVideobj;
  resOff: resOffObj;
  resAns: resAnsObj;
  resIce: resIceObj;
  // getVideo: videobj;
  showTest: showTestObj;
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
    reqVideo: { showVideo: false, id: '', type: null, identity: '', sign: false },
    resVideo: { canVideo: false, id: '', type: null, identity: '', sign: false },
    resOff: { offer: null, id: '', type: null, identity: '', sign: false },
    resAns: { sdp: null, id: '', type: null, identity: '', sign: false },
    resIce: { candidate: null, id: '', type: null, identity: '', sign: false },
    showTest: { test_name: '', test: '', language: '', sign: false},
    allTest: [],
  }

  async componentDidMount() {
    // ?????????????????????????????????????????????????????????
    await searchEmail({ cookie }).then(res => {
      this.identity = res.data.identity;
    })

    let talkArr = [];

    this.openNotificationWithIcon('success');
    this.socket = new Socket({ 
      socketUrl: 'ws://120.79.193.126:9090',
      identity: this.identity,
      openMsg: { cookie, identity: this.identity, type: WS_TYPE.CONNECT },
      retMsg: (receive: any) => {
        const type = receive instanceof Array ? receive[0].type : receive.type;
        switch (type) {
          case WS_TYPE.CONNECT:
          case WS_TYPE.TALK:
            // const { talk } = this.state;
            // const arr = [...talk, receive];
            // this.setState({ talk: arr });
            talkArr.push(receive);
            this.setState({ talk: talkArr });
            break;
          case WS_TYPE.CODE:
            this.setState({ codeObj: receive[0] });
            break;
          case WS_TYPE.REQ_VIDEO:
            this.setState({ reqVideo: receive });
            break;
          case WS_TYPE.RES_VIDEO:
            this.setState({ resVideo: receive });
            break;
          case WS_TYPE.VIDEO_OFFER:
            this.setState({ resOff: receive });
          case WS_TYPE.VIDEO_ANSWER:
            this.setState({ resAns: receive });
            break;
          case WS_TYPE.NEW_ICE_CANDIDATE:
            this.setState({ resIce: receive });
            break;
          case WS_TYPE.HANG_UP:
            break;
          default:
            return;
        }
        // if (receive instanceof Array && Object.keys(receive[0]).filter(item => item==='code').length !== 0) {
        //   this.setState({ codeObj: receive[0] });
        // } else if (receive.showVideo) {
        //   this.setState({ reqVideo: receive });
        // } else if (receive.canVideo) {
        //   this.setState({ resVideo: receive });
        // } else {
        //   this.setState({ talk: receive });
        // }
      }
    });

    try {
      this.socket.connection();
    } catch(e) {
      message.error(e);
    }
  }

  // ?????? websocket ????????????
  sendChat = (msg: any) => {
    msg.id = cookie;
    msg.identity = this.identity;
    msg.type = WS_TYPE.TALK;
    this.socket.sendMessage(msg);
  }
  // ????????????????????? websocket ??????
  sendCode = (msg: any) => {
    msg.type = WS_TYPE.CODE;
    this.socket.sendMessage(msg);
  }
  // ??????????????????
  sendVideo = (msg: any) => {
    msg.id = cookie;
    msg.identity = this.identity;
    this.socket.sendMessage(msg);
  }

  // ?????? antd ?????????
  openNotificationWithIcon = (type: string) => {
    notification[type]({
      message: ' ?????????',
      description:
        '?????????????????????????????????????????????'
    });
  };
  
  // ???????????????????????????
  addTest = () => {

  }
  // ???????????????????????????????????????
  choiceTest = () => {
    const { choiceTestSwitch } = this.state;
    showTest().then(res => {
      this.setState({ choiceTestSwitch: !choiceTestSwitch, allTest: res.data.show });
    })
  }
  // ???????????????????????????????????????????????????????????????????????????
  getTest = (val: any) => {
    this.setState({ showTestSwitch: true, choiceTestSwitch: false, showTest: val });
  }

  // ??????????????????????????????????????????
  submitEvaluation = (value: any) => {
    const interviewer_link = window.location.pathname + window.location.search;
    value.interviewer_link = interviewer_link;
    submitInterview({ submitArr: value }).then(res => {
      if (res.data.status === true) {
        message.success(res.msg);
      }
    })
  }

  handleEnter = (e) => {
    console.log('??????????????????????????????????????????', e, e.target, e.target.value)
    e.target.value = '';
  }

  render() {
    const { talk, codeObj, showTestSwitch, choiceTestSwitch, reqVideo, resVideo, resOff, resAns, showTest, allTest, resIce } = this.state;
    
    return(
      <div className="box">
        <div className="box-left">
          <Tabs defaultActiveKey="program">
            <Tabs.TabPane tab="????????????" key="program">
              <div className="program">
                <div className="program-left">
                  {
                    showTestSwitch === false ?
                    <div className="program-left-before">
                      <Space direction="vertical">
                        <Button onClick={ this.addTest }>???????????????</Button>
                        <Button onClick={ this.choiceTest }>
                          { choiceTestSwitch === false ? '??????????????????' : '????????????' }
                        </Button>
                      </Space>
                    </div> :
                    <div className="program-inform">
                      <div className="program-left-after">
                        <span>??????</span>
                        <Button onClick={ this.choiceTest }>
                          { choiceTestSwitch === false ? '????????????' : '????????????' }
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
            <Tabs.TabPane tab="????????????" key="resume">
              <div className="resume-left"></div>
              <div className="resume-right"></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="????????????" key="achievement">
              <div className="achievement-left"></div>
              <div className="achievement-right"></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="????????????" key="evaluation">
              <span>????????????</span>
              <span>?????????????????????????????????</span>
              <Form onFinish={ this.submitEvaluation }>
                <Form.Item
                  label="??????????????????"
                  name="evaluation"
                  key="evaluation"
                >
                  <Radio.Group>
                    <Radio value="??????">5????????????</Radio>
                    <Radio value="??????">4????????????</Radio>
                    <Radio value="??????">3????????????</Radio>
                    <Radio value="??????">2????????????</Radio>
                    <Radio value="??????">1????????????</Radio>
                  </Radio.Group>
                </Form.Item>
                <Alert message="?????????3-5???????????????1-2????????????" type="error" />

                <span>???????????????/??????/?????????????????????????????????</span>
                <Form.Item
                  name="comment"
                  key="comment"
                >
                  <Input.TextArea placeholder="??????????????????????????????????????????????????????"/>
                </Form.Item>

                <Form.Item >
                  <Button type="primary" htmlType="submit">??????</Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </div>

        <div className="box-right">
          {/* ?????????????????? */}
          <Webrtc 
            sendVideo={ this.sendVideo } 
            reqVideo={ reqVideo } 
            resVideo={ resVideo } 
            resOff={ resOff } 
            resAns={ resAns }
            resIce={ resIce }
          />

          {/* ?????????????????? */}
          <div className="box-right-show-inform">
            {
              talk.length > 0 && talk.map(item => {
                return (
                  <div>
                    <span>{ item.time }&nbsp;</span>
                    <span style={{ color: 'blue' }}>{ item.identity === '??????' || item.id !== cookie ? item.identity : '???' }&nbsp;</span>
                    <span>???{ !item.name ? null : item.id === cookie ? '???' : item.name }{ item.msg }</span>
                  </div>
                )
              })
            }
          </div>

          <Form onFinish={ this.sendChat }>
            <Form.Item name="msg" key="msg">
              <Input placeholder="?????????????????????" onPressEnter={ this.handleEnter }></Input>
            </Form.Item>
            <span>???????????????</span>
          </Form>
        </div>
      </div>
    )
  }
}