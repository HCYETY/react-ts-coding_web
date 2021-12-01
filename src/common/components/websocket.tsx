import React from 'react';
import { Input, Form } from 'antd';
import { getCookie } from 'common/utils';
import { searchEmail } from 'api/modules/user';

const cookie = getCookie();

export default class Websocket extends React.Component {

  socket: WebSocket = null;
  identity: string = '候选人';

  state = {
    value: '',
  }
  
  componentDidMount() {
    // 检测当前浏览器是什么浏览器来决定用什么socket
    if ('WebSocket' in window) {
      this.socket = new WebSocket('ws://localhost:8080/koa/ws');
    } else if ('MozWebSocket' in window) {
      // this.socket = new MozWebSocket('ws:localhost:7656');
    } else {
      // this.socket = new SockJS('ws:localhost:7656');
    }

    // 查看当前用户的身份，是面试官还是候选人
    searchEmail({ cookie }).then(res => {
      this.identity = res.data.interviewer === true ? '面试官' : this.identity;
    })

    // 连接成功时触发
    this.socket.onopen = (evt) => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send('系统：您已连接到服务器!!!!!!!!!!!');
        this.socket.send('系统：' + this.identity + "已经进入房间!!!!!!!!!!!");
      }
    };
    this.socket.onmessage = function(event) {
      const p = document.getElementById('responseText');
      p.innerText = p.innerText + '\n' + event.data;
    };
  }
  send = (message: any) => {
    if (!window.WebSocket) {
      return;
    }
    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(this.identity + '：' + message.inputInform);
    } else {
      alert("连接没有开启.");
    }
  }
  componentWillUnmount() {
    this.socket.close();
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
          <p id="responseText"></p>
          {/* <p id="responseText">{ value }</p> */}
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