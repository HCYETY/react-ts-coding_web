import React from 'react';
import { Input, Form, message } from 'antd';
import { getCookie, nowTime } from 'common/utils';
import { searchEmail } from 'api/modules/user';
import { v4 as uuidv4 } from 'uuid';

interface Prop {

}

interface websocketMsg {
  time: string;
  identity: string;
  msg: string;
  name: string;
}
interface State {
  value: websocketMsg[];
}
const cookie = getCookie();

export default class Websocket extends React.Component<Prop, State> {

  socket: WebSocket = null;
  identity: string = null;

  state = {
    value: [],
  }
  
  async componentDidMount() {
    // 查看当前用户的身份，是面试官还是候选人
    await searchEmail({ cookie }).then(res => {
      this.identity = res.data.identity;
    })

    // 检测当前浏览器是什么浏览器来决定用什么socket
    if ('WebSocket' in window) {
      this.socket = new WebSocket('ws://localhost:8888');
    } else if ('MozWebSocket' in window) {
      // this.socket = new MozWebSocket('ws:localhost:7656');
    } else {
      // this.socket = new SockJS('ws:localhost:7656');
    }

    this.socket.onopen = (evt) => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ cookie, interviewIdentity: this.identity }));
      }
    };
    // 接收消息时触发
    this.socket.onmessage = (event) => {
      this.setState({ value: JSON.parse(event.data) });
    };
  }
  // 发送 websocket 消息
  send = (msg: any) => {
    msg.id = cookie;
    msg.interviewIdentity = this.identity;
    this.socket.send(JSON.stringify(msg));
  }
  // 断开 websocket 连接
  componentWillUnmount() {
    this.socket.close();
    console.log("WebSocket onclose");
    this.socket.onclose = (event) => {
      var code = event.code;
      var reason = event.reason;
      var wasClean = event.wasClean;
      console.log('code',code)
      console.log('reason',reason)
      console.log('wasClean',wasClean)
      if (this.socket.readyState === WebSocket.CLOSING) {
        this.socket.send('系统：正在断开服务器');
      } else if (this.socket.readyState === WebSocket.CLOSED) {
        this.socket.send('系统：服务器已经断开');
      }
    };      
  }

  render() {
    const { value } = this.state;

    return(
      <div>
        <div className="box-right-show-inform">
          {
            value.length > 0 && value.map(item => {
              console.log(item)
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

        <Form onFinish={ this.send }>
          <Form.Item name="inputInform" key="inputInform">
            <Input placeholder="请输入聊天内容"></Input>
          </Form.Item>
          <span>回车键发送</span>
        </Form>
      </div>
    )
  }
}