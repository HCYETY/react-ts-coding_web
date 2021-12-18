import React from 'react';
import { Button } from 'antd';
import { getCookie } from '../utils';

// 本地流和远端流
let localStream;
let remoteStream;

// 本地和远端连接对象
let localPeerConnection: RTCPeerConnection;
let remotePeerConnection: RTCPeerConnection;

// 本地视频和远端视频
let localVideo;
let remoteVideo;

// 设置约束
const mediaStreamConstraints = {
  audio: true,
  video: true
}

// 设置仅交换视频
const offerOptions = {
  offerToReceiveVideo: 1
}

interface Prop {
  sendVideo,
}

interface State {

}

export default class Webrtc extends React.Component<Prop, State> {

  state = {
    beginVideo: false
  }

  componentDidMount(): void {
    localVideo = document.getElementById("localVideo");
    remoteVideo = document.getElementById("remoteVideo");
  }

  closeCamera = async () => {
    localVideo.onloadedmetadata = function(e) {
      localVideo.close();
    };
  }

  openCamera = async () => {
    // 1.获取本地音视频流（打开摄像头）
    // 调用 getUserMedia API 获取音视频流
    await navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      .then(function(mediaStream) {
        localVideo.srcObject = mediaStream;
        localStream = mediaStream;
        localVideo.onloadedmetadata = function(e) {
          localVideo.play();
        };
      })
      .catch((err) => {
        console.log('getUserMedia 错误', err);
      });
  }

  // 视频通话呼叫
  callHandle = async () => {
    // 先打开摄像头
    await this.openCamera();
    // 视频轨道
    const videoTracks = localStream.getVideoTracks();
    // // 音频轨道
    const audioTracks = localStream.getAudioTracks();
    // // 判断视频轨道是否有值
    if (videoTracks.length > 0) {
      console.log(`使用的设备为: ${videoTracks[0].label}.`);
    }
    // // 判断音频轨道是否有值
    if (audioTracks.length > 0) {
      console.log(`使用的设备为: ${audioTracks[0].label}.`);
    }
    const servers: RTCConfiguration = null;
    let configuration = {
      "iceServers": [{
        "urls": "stun:stun.l.google.com:19302"
      }]
    };

    // 创建 RTCPeerConnection 对象
    localPeerConnection = new RTCPeerConnection(configuration);
    // localPeerConnection = new RTCPeerConnection(servers);
    // 监听返回的 Candidate
    localPeerConnection.addEventListener('icecandidate', this.handleConnection);
    // 监听 ICE 状态变化
    localPeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange)

    // remotePeerConnection = new RTCPeerConnection(servers);
    // remotePeerConnection.addEventListener('icecandidate', this.handleConnection);
    // remotePeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange);

    // 4.显示远端媒体流
    // remotePeerConnection.addEventListener('track', event => {
    localPeerConnection.addEventListener('track', event => {
      if (remoteVideo['srcObject'] !== event.streams[0]) {
        remoteVideo['srcObject'] = event.streams[0];
        remoteStream = event.streams[0];
      }
    });
    // 遍历本地流的所有轨道
    localStream.getTracks().forEach((track: any) => {
      localPeerConnection.addTrack(track, localStream)
    })

    // 2.交换媒体描述信息
    const offer = await localPeerConnection.createOffer();
    // localPeerConnection.createOffer(offerOptions)
    try{
      this.createdOffer(offer);
    } catch(err) {
      console.log('createdOffer 错误', err);
    }

    this.setState({ beginVideo: true });
  }

  // getUserMedia 获得流后，将音视频流展示并保存到 localStream
  gotLocalMediaStream = (mediaStream: any) => {
    localVideo['srcObject'] = mediaStream; 
    localStream = mediaStream; 
  }

  createdOffer = async (description) => {
    console.log(`本地创建offer返回的sdp:\n${description.sdp}`)
    // 本地设置描述并将它发送给远端
    // 将 offer 保存到本地
    await localPeerConnection.setLocalDescription(description) 
      .then(() => {
        console.log('local 设置本地描述信息成功');
        const { sendVideo } = this.props;
        sendVideo({ sdp: description });
      }).catch((err: any) => {
        console.log('local 设置本地描述信息错误', err)
      });
    // 远端将本地给它的描述设置为远端描述
    // 远端将 offer 保存
    remotePeerConnection.setRemoteDescription(description) 
      .then(() => { 
        console.log('remote 设置远端描述信息成功');
      }).catch((err: any) => {
        console.log('remote 设置远端描述信息错误', err);
      });
    // 远端创建应答 answer
    const answer = await remotePeerConnection.createAnswer();
    try{
      this.createdAnswer(answer);
    } catch(err) {
      console.log('远端创建应答 answer 错误', err);
    }
  }
  
  createdAnswer = (description) => {
    console.log(`远端应答Answer的sdp:\n${description.sdp}`)
    // 远端设置本地描述并将它发给本地
    // 远端保存 answer
    remotePeerConnection.setLocalDescription(description)
      .then(() => { 
        console.log('remote 设置本地描述信息成功');
      }).catch((err: any) => {
        console.log('remote 设置本地描述信息错误', err);
      });
  // 本地将远端的应答描述设置为远端描述
  // 本地保存 answer
    localPeerConnection.setRemoteDescription(description) 
      .then(() => { 
        console.log('local 设置远端描述信息成功');
      }).catch((err: any) => {
        console.log('local 设置远端描述信息错误', err);
      });
  }

  // 3.端与端建立连接
  handleConnection = (event: { target: any; candidate: any; }) => {
    // 获取到触发 icecandidate 事件的 RTCPeerConnection 对象 
    // 获取到具体的Candidate
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if (iceCandidate) {
      const { sendVideo } = this.props;
      // 交换 ICE 候选，通过 WebSocket 发送
      // sendVideo({ candidate: iceCandidate });
      // 创建 RTCIceCandidate 对象
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      // 得到对端的 RTCPeerConnection
      const otherPeer = this.getOtherPeer(peerConnection);

      // 将本地获得的 Candidate 添加到远端的 RTCPeerConnection 对象中
      // 为了简单，这里并没有通过信令服务器来发送 Candidate，直接通过 addIceCandidate 来达到互换 Candidate 信息的目的
      otherPeer.addIceCandidate(newIceCandidate)
        .then(() => {
          this.handleConnectionSuccess(peerConnection);
        }).catch((error: any) => {
          this.handleConnectionFailure(peerConnection, error);
        });
    }
  }


  handleConnectionChange = (event: { target: any; }) => {
    const peerConnection = event.target;
    console.log('ICE state change event: ', event);
    console.log(`${this.getPeerName(peerConnection)} ICE state: ` + `${peerConnection.iceConnectionState}.`);
}

  handleConnectionSuccess = (peerConnection: any) => {
    console.log(`${this.getPeerName(peerConnection)} addIceCandidate 成功`);
  }

  handleConnectionFailure = (peerConnection: any, error: { toString: () => any; }) => {
    console.log(`${this.getPeerName(peerConnection)} addIceCandidate 错误:\n`+ `${error.toString()}.`);
  }

  getPeerName = (peerConnection: RTCPeerConnection) => {
    return (peerConnection === localPeerConnection) ? 'localPeerConnection' : 'remotePeerConnection';
  }

  getOtherPeer = (peerConnection: RTCPeerConnection) => {
    return (peerConnection === localPeerConnection) ? remotePeerConnection : localPeerConnection;
  }

  hangup = () => {
    localPeerConnection.close();
    remotePeerConnection.close();
    localPeerConnection = null;
    remotePeerConnection = null;
  }

  render() {

    const { beginVideo } = this.state;
    // const { getVideo } = this.props;
    const cookie = getCookie();

    return(
      <div>
        <video id="remoteVideo" autoPlay></video>
        <video id="localVideo" autoPlay muted></video>
        {
          beginVideo === false ? 
          <div>
            {/* <Button id="hangup-button" onClick={ this.openCamera }> 打开摄像头 </Button> */}
            <Button onClick={ this.callHandle }> 视频通话 </Button>
          </div> : 
          <div>
            <Button onClick={ this.closeCamera }>关闭摄像头</Button>
            <Button onClick={ this.hangup }>挂断视频通话</Button>
          </div>
        }
      </div>
    )
  }
}