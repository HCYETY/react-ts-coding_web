import React from 'react';
import { Input, Form, message } from 'antd';
import { getCookie, nowTime } from 'common/utils';
import { searchEmail } from 'api/modules/user';
import ReconnectingWebsocket from 'reconnecting-websocket';
import { Client, TextOperation,  } from 'ot';
// import sharedb from 'sharedb/lib/client';

interface Prop {
  socketUrl: string;   // 连接 websocket 的地址
  identity: string;    // 开启 websocket 的当前用户身份
  openMsg: any;        // 连接成功时要发送的数据
  returnMessage: any;  // 接收数据的函数
}

interface State {

}

export default class Webrtc extends React.Component<Prop, State> {

  socket: WebSocket = null;
  // identity: string = null;

  connection = async () => {
    // 查看当前用户的身份，是面试官还是候选人
    // await searchEmail({ cookie }).then(res => {
    //   this.identity = res.data.identity;
    // })

    // 检测当前浏览器是什么浏览器来决定用什么socket
    if ('WebSocket' in window) {
      // this.socket = new ReconnectingWebsocket(this.props.socketUrl);
      this.socket = new WebSocket(this.props.socketUrl);
    } else if ('MozWebSocket' in window) {
      // this.socket = new MozWebSocket('ws:localhost:7656');
    } else {
      // this.socket = new SockJS('ws:localhost:7656');
    }

    this.socket.onopen = this.onopen;
    this.socket.onmessage = this.onmessage;
    this.socket.onclose = this.onclose;
    this.socket.onerror = this.onerror;
  };
  // 连接成功触发
  onopen = () => {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(this.props.openMsg));
    }
  };
  // 后端向前端推得数据
  onmessage = (event: { data: string; }) => {
    let { returnMessage } = this.props;
    returnMessage && returnMessage(JSON.parse(event.data));
  };
  // 关闭连接触发
  onclose = (event: any) => {
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
  };
  onerror = (e: any) => {
    return e;
  };
  // 向后端发送数据
  sendMessage = (msg: any) => {
    this.socket.send(JSON.stringify(msg));
  };
}