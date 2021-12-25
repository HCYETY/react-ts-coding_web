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
  offerToReceiveVideo: true,
  offerToReceiveAudio: true
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

  // 视频通话呼叫
  localCall = async (data?: { type: string }) => {
    // const videoTracks = localStream.getVideoTracks();
    // const audioTracks = localStream.getAudioTracks();
    if (!localPeerConnection) {
      let configuration = {
        "iceServers": [{
          "urls": "stun:stun.l.google.com:19302"
        }]
      };
  
      // 创建 RTCPeerConnection 对象
      localPeerConnection = new RTCPeerConnection(configuration);
      localPeerConnection.onicecandidate = event => this.handleConnection(localPeerConnection, event);
      localPeerConnection.oniceconnectionstatechange = event => this.handleConnectionChange(localPeerConnection, event);
      localPeerConnection.ontrack = this.gotRemoteStream;

      // 遍历本地流的所有轨道
      localStream.getTracks().forEach((track: any) => {
        localPeerConnection.addTrack(track, localStream);
      });
      
      const { resVideo } = this.props;
      resVideo.sign = false;

      if (data && data.type === 'local') {
        this.createOffer();
      }
    }
  }

  createOffer = async () => {
    // 2.交换媒体描述信息
    const offer = await localPeerConnection.createOffer(offerOptions)
    console.log('A 创建offfer成功');
    // this.onCreateOfferSuccess(offer);
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
  onCreateOfferSuccess = (desc: any) => {
    localPeerConnection
      .setLocalDescription(desc)
      .then(
        () => console.log("A 保存offfer成功"),
        error => console.log("A 保存offer错误", error.toString())
      );
    remotePeerConnection
      .setRemoteDescription(desc)
      .then(
        async () => {
          console.log("B 保存offer成功");
          const answer = await remotePeerConnection.createAnswer();
          try{
            this.onCreateAnswerSuccess(answer);
          } catch{(err: any) => {
            console.log("B 创建answer错误", err.toString())
          }}
        },
        error => console.log("B 保存offer错误", error.toString())
      );
  }
  onCreateAnswerSuccess = (desc: any) => {
    localPeerConnection
      .setRemoteDescription(desc)
      .then(
        () => console.log("A 保存answer成功" ),
        error => console.log("A 保存answer错误", error.toString())
      );
    remotePeerConnection
      .setLocalDescription(desc)
      .then(
        () => console.log( "B 保存answer成功" ),
        error => console.log("B 保存answer错误", error.toString())
      );
    console.log('开始视频通话呼叫了', localPeerConnection, remotePeerConnection)
  }
  handleOffer = async (msg) => {
    const { resOff } = this.props;
    resOff.sign = false;

    // await this.openCamera();
    // await this.localCall();

    // const remoteDescription = new RTCSessionDescription(msg.offer);
    localPeerConnection.setRemoteDescription(msg.offer) 
    .then(async () => {
      console.log('B 保存offer成功');
      const answer = await localPeerConnection.createAnswer();
      console.log('B 创建answer成功');
      try{
          await localPeerConnection.setLocalDescription(answer); 
          // await remotePeerConnection.setLocalDescription(answer); 
          // console.log('B 保存answer成功');
          this.sendToWs({ sdp: answer, type: WS_TYPE.VIDEO_ANSWER, sign: true })
          console.log('B 发送answer成功');
          // this.createdAnswer(answer);
        } catch(err) {
          console.log('B 创建answer错误', err);
        }
        // this.sendToWs({ sdp: description, type: WS_TYPE.VIDEO_OFFER });
      }).catch((err: any) => {
        console.log('B 保存offer错误', err)
      });
  }
  handleAnswer = async (msg) => {
    console.log('处理接收到的answer......', msg)
    console.log(localPeerConnection, remotePeerConnection)
    // console.log(`local:\n${description.sdp}`)
    // const { resAns } = this.props;
    // resAns.sign = false;
    msg.sign = false;
    const remoteDescription = new RTCSessionDescription(msg.sdp);
    localPeerConnection.setRemoteDescription(remoteDescription)
      .then(() => {
        console.log('A 保存answer成功');
        // this.sendToWs({ sdp: description, type: WS_TYPE.VIDEO_ANSWER });
      }).catch((err: any) => {
        console.log('A 保存answer错误', err);
      });
  }

  // 3.端与端建立连接
  handleConnection = (PeerConnection: any, event: { candidate: any; }) => { 
    // let pc = PeerConnection === localPeerConnection ? remotePeerConnection : localPeerConnection;
    // pc.addIceCandidate(event.candidate)
    //   .then(
    //     () => {
    //       console.log('addIceCandidate success')
    //       // this.sendToWs({ candidate: event.candidate, type: WS_TYPE.NEW_ICE_CANDIDATE, sign: true });
    //     },
    //     error => console.log('failed to add ICE Candidate', error.toString())
    //   )
    if (event.candidate) {
      this.sendToWs({ type: WS_TYPE.NEW_ICE_CANDIDATE, candidate: event.candidate, sign: true });
    } 
  }
  handleIceCandidate = (msg: any) => {
    // localPeerConnection.addIceCandidate(msg.candidate);
    const candidate = new RTCIceCandidate(msg.candidate);
    localPeerConnection.addIceCandidate(candidate);
    const { resIce } = this.props;
    resIce.sign = false;
  }
  gotRemoteStream = event => {
    if (remoteVideo.srcObject !== event.streams[0]) {
      console.log('远端视频放置完毕', event.streams[0])
      remoteVideo.srcObject = event.streams[0];
    }
  };
  handleConnectionChange = (pc, event) => {
    console.log("ICE state:", pc.iceConnectionState);
  };











  // 挂断电话
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
    remoteVideo.removeAttribute("srcObject");
  
    this.setState({ beginVideo: false });
  }

  // 接受通话，告知对端建立连接
  videok = async () => {
    let { reqVideo } = this.props;
    reqVideo.showVideo = false;
    await this.openCamera();
    this.sendToWs({ canVideo: true, type: WS_TYPE.RES_VIDEO, sign: true });
    await this.localCall();
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
    this.hangup();
  }
  
  render() {
    const { beginVideo, } = this.state;
    const { reqVideo, resVideo, resOff, resAns, resIce } = this.props;
    console.log('两个全局变量：', localPeerConnection, remotePeerConnection);
    !resVideo.type ? null : resVideo.canVideo === true && resVideo.id !== cookie && resVideo.sign === true ? this.localCall({ type: 'local' }) : resVideo.canVideo === false && resVideo.id !== cookie ? this.handleRefuse() : null;
    !resOff.type ? null : resOff.id !== cookie && resOff.sign === true ? this.handleOffer(resOff) : null;
    !resAns.type ? null : resAns.id !== cookie && resAns.sign === true ? this.handleAnswer(resAns) : null;
    !resIce.type ? null : resIce.id !== cookie && resIce.sign === true ? this.handleIceCandidate(resIce) : null;

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