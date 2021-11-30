import React from 'react';
import { Input, Form } from 'antd';
import { getCookie } from 'common/utils';
import { searchEmail } from 'api/modules/user';

const ws = new WebSocket('ws:localhost:9090');

const cookie = getCookie();
let identity: string = '候选人';

export default class Websocket extends React.Component {

  componentDidMount() {
    searchEmail({ cookie }).then(res => {
      identity = res.data.interviewer === true ? '面试官' : identity;
    })
    ws.onopen = function(evt) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('系统：您已连接到服务器!!!!!!!!!!!');
        ws.send('系统：' + identity + "已经进入房间!!!!!!!!!!!");
      }
    };
    
    ws.onmessage = function(event) {
      const p = document.getElementById('responseText');
      p.innerText = p.innerText + '\n' + event.data;
    };
  }
  send = (message: any) => {
    if (!window.WebSocket) {
      return;
    }
    if (ws.readyState == WebSocket.OPEN) {
      ws.send(identity + '：' + message.inputInform);
    } else {
      alert("连接没有开启.");
    }
  }
  componentWillUnmount() {
    ws.close();
    ws.onclose = function(event) {
      var code = event.code;
      var reason = event.reason;
      var wasClean = event.wasClean;
      console.log('code',code)
      console.log('reason',reason)
      console.log('wasClean',wasClean)
      if (ws.readyState === WebSocket.CLOSING) {
        ws.send('系统：正在断开服务器');
      } else if (ws.readyState === WebSocket.CLOSED) {
        ws.send('系统：服务器已经断开');
      }
    };      
  }

  render() {

    return(
      <div>
        <div className="box-right-show-inform">
          <p id="responseText"></p>
        </div>

        <Form onFinish={ this.send }>
          <Form.Item name="inputInform">
            <Input placeholder="请输入聊天内容"></Input>
          </Form.Item>
          <span>回车键发送</span>
        </Form>
      </div>
    )
  }
}