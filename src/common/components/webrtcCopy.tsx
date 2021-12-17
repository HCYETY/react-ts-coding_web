import React from 'react';
import { Button, message } from 'antd';
import { ProvidePlugin } from 'webpack';

interface Prop {

}

interface State {
  showVideoButton: boolean;
}

// 本地流和远端流
let localVideo;
let remoteVideo;
let localStream; // 本地流
let peerConnA; // 本地链接
let peerConnB; // 远端链接

const constraints = {
  audio: true,
  video: true
  // video: {
  //   width: 100%,
  //   height: 100
  // }
}

// 本地流和远端流
export default class Webrtc extends React.Component<ProvidePlugin, State> {

  state = {
    showVideoButton: true
  }

  componentDidMount(): void {
    localVideo = document.getElementById("localVideo");
    remoteVideo = document.getElementById("remoteVideo");
  }

  openCamera = async (e) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      localVideo['srcObject'] = mediaStream;
      localStream = stream;
      localVideo.onloadedmetadata = function(e) {
        localVideo.play();
      };
    }).catch(function(err) {
      this.handleError(err);
    })
  }

  call = async () => {
    // 创建视频轨道
    // 创建音频轨道
    
    let configuration = {
      "iceServers": [{
        "url": "stun:stun.l.google.com:19302"
      }]
    };
    peerConnA = new RTCPeerConnection(configuration);
    peerConnA.addEventListener('icecandidate', this.onIceCandidateA);

    peerConnB = new RTCPeerConnection(configuration);
    peerConnB.addEventListener('icecandidate', this.onIceCandidateB);

    peerConnA.addEventListener('iceconnectionstatechange', this.onIceStateChangeA);
    peerConnB.addEventListener('iceconnectionstatechange', this.onIceStateChangeB);

    // 远程客户获取到远端流后的事件
    peerConnB.addEventListener('track', this.gotRemoteStream);
    localStream.getTracks().forEach(track => {
      peerConnA.addTrack(track, localStream);
    });

    try{
      const offer = await peerConnA.createOffer();
      await this.onCreateOfferSuccess(offer);
    } catch(e) {
      console.log('创建会话描述SD失败：', e.toString());
    }
  }
  
  onCreateOfferSuccess = async (desc) => {
    try{
      await peerConnA.setLocalDescription(desc);
      this.onSetLocalSuccess(peerConnA);
    }catch(e) {
  
    }

    try{
      await peerConnB.setRemoteDescription(desc);
      this.onSetRemoteSuccess(peerConnB);
    }catch(e) {
  
    }

    try{
      const answer = await peerConnB.createAnswer();
      this.onCreateAnswerSuccess(answer);
    }catch(e) {
  
    }
  }
  
  onCreateAnswerSuccess = async (desc) => {
    try{
      await peerConnB.setLocalDescription(desc);
      this.onSetLocalSuccess(peerConnB);
    }catch(e) {
  
    }
  
    try{
      await peerConnA.setRemoteDescription(desc);
      this.onSetRemoteSuccess(peerConnA);
    }catch(e) {
  
    }
  
    try{
      const answer = await peerConnB.createAnswer();
      this.onCreateAnswerSuccess(answer);
    }catch(e) {
  
    }
  }

  onIceStateChangeA = async (event) => {
    try{
      if (event.candidate) {
        await peerConnB.addIceCandidate(event.candidate);
        this.onAddIceCandidateSuccess(peerConnB);
      }
    } catch (e) {

    }
  }
  onIceStateChangeB = async (event) => {
    try{
      if (event.candidate) {
        await peerConnA.addIceCandidate(event.candidate);
        this.onAddIceCandidateSuccess(peerConnA);
      }
    } catch (e) {
  
    }
  }

  onSetLocalSuccess = (pc) => {

  }
  onSetRemoteSuccess = (pc) => {

  }

  onIceCandidateA = async (event) => {
    try{
      if (event.candidate) {
        await peerConnB.addIceCandidate(event.candidate);
        this.onAddIceCandidateSuccess(peerConnB);
      }
    } catch(e) {

    }
  }
  onIceCandidateB = async (event) => {
    try{
      if (event.candidate) {
        await peerConnA.addIceCandidate(event.candidate);
        this.onAddIceCandidateSuccess(peerConnA);
      }
    } catch(e) {

    }
  }
  onAddIceCandidateSuccess = (pc) => {

  }

  gotRemoteStream = (e) => {
    if (remoteVideo.srcObject !== e.stream[0]) {
      remoteVideo.srcObject = e.stream[0];
    }
  }

  handleError = (err) => {
    if (err === 'ConstraintNotSatisfiedError') {
      const v = constraints.video;
      message.error(`宽：${ v.width.exact } 高：${ v.height.exact } 设备不支持`);
    } else if (err.name === 'PermissionDeniedError') {
      message.error('没有摄像头和麦克风的使用权限');
    }
    message.error('getUserMedia错误', err);
  }

  hangup = () => {
    peerConnA.close();
    peerConnB.close();
    peerConnA = null;
    peerConnB = null;
  }

  render() {

    return(
      <div className='container'>
        <video id="localVideo" autoPlay muted></video>
        <video id="remoteVideo" autoPlay></video>
        <Button id="hangup-button" onClick={ this.openCamera }>
          打开摄像头
        </Button>
        <Button onClick={ this.call }>呼叫</Button>
        <Button onClick={ this.hangup }>挂断</Button>
      </div>
    )
  }
}