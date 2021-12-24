import React from 'react';
import { Button, message, Modal } from 'antd';
import { getCookie } from '../utils';
import { WS_TYPE } from '../const';

// 本地流和远端流
let localStream: MediaStream;
let remoteStream: MediaStream;

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
  sendVideo;
  reqVideo;
  resVideo;
  resOff;
  resAns;
  resIce;
}

interface State {
  beginVideo: boolean;
  showVideo: boolean;
}

let myPeerConnection = null;
const cookie = getCookie();

export default class Webrtc extends React.Component<Prop, State> {

  state = {
    beginVideo: false,
    showVideo: false
  }

  sendToWs = (data: any) => {
    const { sendVideo } = this.props;
    sendVideo(data);
  }

  componentDidMount(): void {
    localVideo = document.getElementById("localVideo");
    remoteVideo = document.getElementById("remoteVideo");
    // const { reqVideo, resVideo } = this.props;
    // if (resVideo.canVideo === true) {
    //   this.callHandle();
    // } else if (reqVideo.showVideo === true) {
    //   this.setState({ showVideo: reqVideo.showVideo });
    // }
  }

  componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any): void {
      
  }

  // 关闭摄像头
  closeCamera = async () => {
    localStream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  // 1.获取本地音视频流（打开摄像头）
  openCamera = async () => {
    // .catch(handleGetUserMediaError);

    await navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      .then(function(mediaStream) {
        localVideo.srcObject = mediaStream;
        localStream = mediaStream;
        console.log('local 放置本地视频流成功')
        console.log('localStream', localStream)
        // myPeerConnection = mediaStream;
        localVideo.onloadedmetadata = function(e) {
          localVideo.play();
        };
      })
      .catch((err) => {
        console.log('getUserMedia 错误', err);
      });
  }
  
  // 发送视频请求，等待对方通过
  call = async (data: { type: any }) => {
    if (myPeerConnection) {
      alert("你正处于视频通话中，无法再打开一个视频通话!");
    } else {
      const type = data.type === 'click' ? WS_TYPE.REQ_VIDEO : WS_TYPE.RES_VIDEO;
      await this.openCamera();
      this.sendToWs({ showVideo: true, type });
    }
  }

  createPeerConnection = () => {
    myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        }
      ]
    });

    // myPeerConnection.onicecandidate = this.handleICECandidateEvent;
    // myPeerConnection.ontrack = this.handleTrackEvent;
    myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent();
    // myPeerConnection.onremovetrack = this.handleRemoveTrackEvent;
    // myPeerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    // myPeerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    // myPeerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
  }

  handleNegotiationNeededEvent = () => {
    myPeerConnection.createOffer().then(function(offer) {
      return myPeerConnection.setLocalDescription(offer);
    })
    .then(() => {
      this.sendToWs({
        name: '面试官',
        target: '候选人',
        type: WS_TYPE.VIDEO_OFFER,
        sdp: myPeerConnection.localDescription
        // sdp: description.sdp
      });
    })
    // .catch(reportError);
  }

  handleGetUserMediaError = (e) => {
    switch(e.name) {
      case "NotFoundError":
        alert("Unable to open your call because no camera and/or microphone" + "were found.");
        break;
      case "SecurityError":
      case "PermissionDeniedError":
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        alert("Error opening your camera and/or microphone: " + e.message);
        break;
    }
  
    this.closeVideoCall();
  }
  
  // 关闭视频通话
  closeVideoCall = () => {
    if (myPeerConnection) {
      myPeerConnection.ontrack = null;
      myPeerConnection.onremovetrack = null;
      myPeerConnection.onremovestream = null;
      myPeerConnection.onicecandidate = null;
      myPeerConnection.oniceconnectionstatechange = null;
      myPeerConnection.onsignalingstatechange = null;
      myPeerConnection.onicegatheringstatechange = null;
      myPeerConnection.onnegotiationneeded = null;
  
      if (remoteVideo.srcObject) {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      }
  
      if (localVideo.srcObject) {
        localVideo.srcObject.getTracks().forEach(track => track.stop());
      }
  
      myPeerConnection.close();
      myPeerConnection = null;
    }
  
    remoteVideo.removeAttribute("srcObject");
    remoteVideo.removeAttribute("srcObject");
  
    this.setState({ beginVideo: false });
  }

  handleNewICECandidateMsg = (msg) => {
    var candidate = new RTCIceCandidate(msg.candidate);
    // // 得到对端的 RTCPeerConnection
    // const otherPeer = this.getOtherPeer(localPeerConnection);
    localPeerConnection.addIceCandidate(candidate)
      .catch((err)=>{
        console.log('handleNewICECandidateMsg 报错：'+err);
      });
    // // 创建 RTCIceCandidate 对象
    // const newIceCandidate = new RTCIceCandidate(iceCandidate);

    // // 将本地获得的 Candidate 添加到远端的 RTCPeerConnection 对象中
    // // 为了简单，这里并没有通过信令服务器来发送 Candidate，直接通过 addIceCandidate 来达到互换 Candidate 信息的目的
    // otherPeer.addIceCandidate(newIceCandidate)
    //   .then(() => {
    //     this.handleConnectionSuccess(localPeerConnection);
    //   }).catch((error: any) => {
    //     this.handleConnectionFailure(localPeerConnection, error);
    //   });
  }
  

  // 视频通话呼叫
  localCall = async (data: { type: string }) => {
    // const videoTracks = localStream.getVideoTracks();
    // const audioTracks = localStream.getAudioTracks();
    console.log('开始视频通话呼叫了，localPeerConnection是什么：', localPeerConnection)
    if (!localPeerConnection) {
      let configuration = {
        "iceServers": [{
          "urls": "stun:stun.l.google.com:19302"
        }]
      };
  
      // 创建 RTCPeerConnection 对象
      localPeerConnection = new RTCPeerConnection(configuration);
      remotePeerConnection = new RTCPeerConnection(configuration);
  // localPeerConnection.onicecandidate = event => {
  //   if (event.candidate) {
  //     this.sendToWs({ candidate: event.candidate, type: WS_TYPE.NEW_ICE_CANDIDATE, sign: true });
  //   }
  // }
  localPeerConnection.onicecandidate = event => this.handleConnection(localPeerConnection, event);
  localPeerConnection.oniceconnectionstatechange = event => this.handleConnectionChange(localPeerConnection, event);

  remotePeerConnection.onicecandidate = event => this.handleConnection(remotePeerConnection, event);
  remotePeerConnection.oniceconnectionstatechange = event => this.handleConnectionChange(remotePeerConnection, event);
  remotePeerConnection.ontrack = this.gotRemoteStream;

      // localPeerConnection.addEventListener('icecandidate', event => {
      //   if (event.candidate) {
      //     // localPeerConnection.addIceCandidate(event.candidate);
      //     this.sendToWs({ candidate: event.candidate, type: WS_TYPE.NEW_ICE_CANDIDATE, sign: true });
      //   }
      // });
      // localPeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange)
      // 4.显示远端媒体流
      // localPeerConnection.addEventListener('track', event => {
      //   console.log('track', event, event.streams)
      //   if (remoteVideo.srcObject !== event.streams[0]) {
      //     remoteVideo.srcObject = event.streams[0];
      //     remoteStream = event.streams[0];
      //   }
      // });
      // 遍历本地流的所有轨道
      localStream.getTracks().forEach((track: any) => {
        console.log('看看本地流的所有轨道', track)
        localPeerConnection.addTrack(track, localStream);
      });
      
      const { resVideo } = this.props;
      resVideo.sign = false;

      if (data.type === 'local') {
        this.createOffer();
      }
    }
  }

  createOffer = async () => {
    // 2.交换媒体描述信息
    const offer = await localPeerConnection.createOffer();
    console.log('A 创建offfer成功');
    try{
      await localPeerConnection.setLocalDescription(offer);
      console.log('A 保存offfer成功');
      this.sendToWs({ offer, type: WS_TYPE.VIDEO_OFFER, sign: true });
      console.log('A 发送offfer成功');
      this.setState({ beginVideo: true });
    } catch(err) {
      console.log('A 保存offer错误', err);
    }
  }
  handleOffer = async (description) => {
    const { resOff } = this.props;
    resOff.sign = false;
    await remotePeerConnection.setRemoteDescription(description) 
    .then(async () => {
      console.log('B 保存offer成功');
      const answer = await remotePeerConnection.createAnswer();
      console.log('B 创建answer成功');
      try{
          await remotePeerConnection.setLocalDescription(answer); 
          console.log('B 保存answer成功');
          this.sendToWs({ sdp: answer, type: WS_TYPE.VIDEO_ANSWER, sign: true })
          console.log('B 发送answer成功');
          // this.createdAnswer(answer);
        } catch(err) {
          console.log('B 创建answer错误', err);
        }
        // this.sendToWs({ sdp: description, type: WS_TYPE.VIDEO_OFFER });
      }).catch((err: any) => {
        console.log('B 设置远程offer信息错误', err)
      });
  }
  handleAnswer = async (description) => {
    // console.log(`local:\n${description.sdp}`)
    const { resAns } = this.props;
    resAns.sign = false;
    await localPeerConnection.setRemoteDescription(description)
      .then(() => { 
        console.log('A 保存answer成功', description);
        // this.sendToWs({ sdp: description, type: WS_TYPE.VIDEO_ANSWER });
      }).catch((err: any) => {
        console.log('A 保存answer错误', err);
      });
  }

  // 3.端与端建立连接
  handleConnection = (event: { candidate: any; }) => {
    // 获取到触发 icecandidate 事件的 RTCPeerConnection 对象 
    // 获取到具体的Candidate
    if (event.candidate) {
      remoteVideo.addIceCandidate(event.candidate);
    }
  }
  gotRemoteStream = () => {
    
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
    if (localPeerConnection) {
      localPeerConnection.ontrack = null;
      localPeerConnection.onicecandidate = null;
      localPeerConnection.oniceconnectionstatechange = null;
  
      if (remoteVideo.srcObject) {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      }
  
      if (localVideo.srcObject) {
        localVideo.srcObject.getTracks().forEach(track => track.stop());
      }
  
      localPeerConnection.close();
      localPeerConnection = null;
    }
  
    localVideo.removeAttribute("srcObject");
    localVideo.removeAttribute("srcObject");
    remoteVideo.removeAttribute("srcObject");
    remoteVideo.removeAttribute("srcObject");
  
    this.setState({ beginVideo: false });
    // localPeerConnection.close();
    // remotePeerConnection.close();
    // localPeerConnection = null;
    // remotePeerConnection = null;
  }

  // 接受通话，告知对端建立连接
  videok = async () => {
    let { reqVideo } = this.props;
    reqVideo.showVideo = false;
    await this.openCamera();
    this.sendToWs({ canVideo: true, type: WS_TYPE.RES_VIDEO, sign: true });
    await this.localCall({ type: 'remote' });
  }
  // 拒绝通话，告知对端断开连接
  handleCancel = () => {
    let { reqVideo } = this.props;
    reqVideo.showVideo = false;
    this.sendToWs({ canVideo: false, type: WS_TYPE.RES_VIDEO });
    this.hangup();
    message.success("你已拒绝视频通话");
  }
  judgeShowVideo = () => {
    const { reqVideo } = this.props;
    const cookie = getCookie();
    const showVideo = reqVideo.showVideo === true && reqVideo.id !== cookie ? true : false;
    return showVideo;
  }

  handleRefuse = () => {
    message.error("对方拒绝了你的视频通话");
    this.closeVideoCall();
  }
  
  render() {
    const { beginVideo, } = this.state;
    const { reqVideo, resVideo, resOff, resAns, resIce } = this.props;
    console.log('五个属性：', reqVideo, resVideo, resOff, resAns, resIce);
    console.log('两个全局变量：', localPeerConnection, remotePeerConnection);
    !resVideo.type ? null : resVideo.canVideo === true && resVideo.id !== cookie && resVideo.sign === true ? this.localCall({ type: 'local' }) : resVideo.canVideo === false && resVideo.id !== cookie ? this.handleRefuse() : null;
    !resOff.type ? null : resOff.id !== cookie && resOff.sign === true ? this.handleOffer(resOff.offer) : null;
    !resAns.type ? null : resAns.id !== cookie && resAns.sign === true ? this.handleAnswer(resAns.sdp) : null;
    !resIce.type ? null : resIce.id !== cookie && resIce.sign === true ? this.handleNewICECandidateMsg(resIce) : null;

    return(
      <div>
        <video id="remoteVideo" autoPlay></video>
        <video id="localVideo" autoPlay muted></video>
        {
          beginVideo === false ? 
          <div>
            <Button onClick={ this.call }> 视频通话 </Button>
          </div> : 
          <div>
            <Button onClick={ this.closeCamera }>关闭摄像头</Button>
            <Button onClick={ this.hangup }>挂断视频通话</Button>
          </div>
        }
        <Modal
          title="视频通话" 
          visible={ this.judgeShowVideo() } 
          onOk={ this.videok } 
          onCancel={ this.handleCancel }
          cancelText="拒绝"
          okText="接受"
        >
          <p>你收到一个来自{ reqVideo.identity }视频通话，是否接通？</p>
        </Modal>
      </div>
    )
  }
}

// 综合训练
// 85、 109、 157、 181