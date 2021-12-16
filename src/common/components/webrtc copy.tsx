import React from 'react';
import { Button } from 'antd';
import { getCookie } from '../utils';

// 本地流和远端流
let localStream: MediaStream;
let remoteStream;

// 本地和远端连接对象
let localPeerConnection: RTCPeerConnection;
let remotePeerConnection: RTCPeerConnection;

// 本地视频和远端视频
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// 设置约束
const mediaStreamConstraints = {
  video: true
}

// 设置仅交换视频
const offerOptions = {
  offerToReceiveVideo: 1
}

export default class Webrtc extends React.Component {
  startHandle = () => {
    // 1.获取本地音视频流
    // 调用 getUserMedia API 获取音视频流
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      .then(this.gotLocalMediaStream)
      .catch((err) => {
        console.log('getUserMedia 错误', err);
      });
  }

  callHandle = () => {
    // 视频轨道
    const videoTracks = localStream.getVideoTracks();
    // 音频轨道
    const audioTracks = localStream.getAudioTracks();
    // 判断视频轨道是否有值
    if (videoTracks.length > 0) {
      console.log(`使用的设备为: ${videoTracks[0].label}.`);
    }
    // 判断音频轨道是否有值
    if (audioTracks.length > 0) {
      console.log(`使用的设备为: ${audioTracks[0].label}.`);
    }
    const servers: RTCConfiguration = null;

    // 创建 RTCPeerConnection 对象
    localPeerConnection = new RTCPeerConnection(servers);
    // 监听返回的 Candidate
    localPeerConnection.addEventListener('icecandidate', this.handleConnection);
    // 监听 ICE 状态变化
    localPeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange)

    remotePeerConnection = new RTCPeerConnection(servers);
    remotePeerConnection.addEventListener('icecandidate', this.handleConnection);
    remotePeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange);
    remotePeerConnection.addEventListener('track', gotRemoteMediaStream);

    // 将音视频流添加到 RTCPeerConnection 对象中
    // 注意：新的协议中已经不再推荐使用 addStream 方法来添加媒体流，应使用 addTrack 方法
    // localPeerConnection.addStream(localStream);
    // 遍历本地流的所有轨道
    localStream.getTracks().forEach((track: any) => {
      localPeerConnection.addTrack(track, localStream)
    })

    // 2.交换媒体描述信息
    localPeerConnection.createOffer(offerOptions)
    .then(this.createdOffer).catch((err) => {
      console.log('createdOffer 错误', err);
    });
  }

  hangupHandle = () => {
    // 关闭连接并设置为空
    localPeerConnection.close();
    remotePeerConnection.close();
    localPeerConnection = null;
    remotePeerConnection = null;
    // hangupBtn.disabled = true;
    // callBtn.disabled = false;
  }

  // getUserMedia 获得流后，将音视频流展示并保存到 localStream
  gotLocalMediaStream = (mediaStream: any) => {
    localVideo['srcObject'] = mediaStream; 
    localStream = mediaStream; 
    // callBtn.disabled = false;
  }

  createdOffer = (description: { sdp: any; }) => {
    console.log(`本地创建offer返回的sdp:\n${description.sdp}`)
    // 本地设置描述并将它发送给远端
    // 将 offer 保存到本地
    localPeerConnection.setLocalDescription(description) 
      .then(() => {
        console.log('local 设置本地描述信息成功');
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
    remotePeerConnection.createAnswer() 
      .then(this.createdAnswer())
      .catch((err: any) => {
        console.log('远端创建应答 answer 错误', err);
      });
  }
  
  createdAnswer = (description: { sdp: any; }) => {
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

  // 4.显示远端媒体流
  gotRemoteMediaStream = (event: { streams: any[]; }) => {
    if (remoteVideo['srcObject'] !== event.streams[0]) {
      remoteVideo['srcObject'] = event.streams[0];
      remoteStream = event.streams[0];
      console.log('remote 开始接受远端流')
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



  // pc: RTCPeerConnection = null;
  // configuration = {
  //   iceServers: [{
  //     urls: 'stun:stun.l.google.com:19302'
  //   }]
  // };

  // hangUpCall = (isOfferer: any) => {
  //   this.pc = new RTCPeerConnection(this.configuration);

  //   this.pc.onicecandidate = event => {
  //     console.log('查看pc的event时什么：', event);
  //     // if (event.candidate) {
  //     //   sendMessage({ 'candidate': event.candidate });
  //     // }

  //     if (isOfferer) {
  //       this.pc.onnegotiationneeded = () => {
  //         this.pc.createOffer()
  //           .then(this.localDescCreated)
  //           .catch(this.onError);  
  //       }
  //     }

  //     navigator.mediaDevices.getDisplayMedia({
  //       audio: true,
  //       video: true,
  //     }).then(stream => {
  //       console.log('查看navigator中then的stream', stream);
  //       // localVideo.srcObject = stream;
  //       // this.pc.addStream(stream);
  //     }, this.onError);
  //   }
  // }
  // onSuccess = () => {
  //   console.log('连接成功')
  // }
  // onError = (error: any) => {
  //   console.error('连接失败', error)
  // }
  // localDescCreated = (desc: RTCLocalSessionDescriptionInit) => {
  //   this.pc.setLocalDescription(
  //     desc,
  //     () => this.sendMessage({ 'sdp': this.pc.localDescription }),
  //     this.onError
  //   )
  // }

  render() {

    return(
      <div>
        {/* <video id="localVideo" autoPlay playsInline></video>
        <video id="remoteVideo" autoPlay playsInline></video>

        <div>
          <button id="startBtn">打开本地视频</button>
          <button id="callBtn">建立连接</button>
          <button id="hangupBtn">断开连接</button>
        </div> */}
        <video id="localVideo" autoPlay muted src=""></video>
        <video id="remoteVideo" autoPlay src=""></video>
        <Button id="hangup-button" onClick={ this.startHandle } disabled>
          Hang Up
        </Button>
      </div>
    )
  }
}