import React from 'react';
import { Modal, Button, message, Input } from 'antd';

import 'style/showTests.less';
import { getUrlParam, handleRemainingTime, nowTime } from 'common/utils';
import TestAlone from 'common/components/testAlone';
import { showTest, candidateInform } from 'api/modules/interface';
import { CANDIDATE } from 'common/const';

const url = getUrlParam('paper');
const obj = { paper: url, sign: false };

export default class ShowTests extends React.Component {
  state = {
    tableArr: [] = [],
    visible: false,
    isWatch: false,
    isOver: false,
    nowtime: '',
    secondTime: 10,
  }

  async componentDidMount() {
    const res = await showTest(obj);
    const ans = await candidateInform(obj);
    console.log(ans)
    const ret = ans.data.candidateInform[0];
    const nowtime = nowTime();
    this.setState({ 
      tableArr: res.data,
      isWatch: ret.watch,
      isOver: ret.over,
      nowtime,
      secondTime: window.setInterval(() => {this.state.secondTime-1}, 1000)
    });

    // if (this.state.nowtime === ret.time_end) {
    //   const id = document.getElementById('inform-box-time');
    //   let intervalID = setInterval(() => {
    //     id.innerText -= 1;
    //     //清除定时器
    //     if( id.innerText === '0') {
    //       clearInterval(intervalID);
    //       // 提交试卷
    //       this.submitPaper();
    //     }
    //   }, 1000);
    // }
  }
  componentWillUnmount() {
    window.clearInterval(this.state.secondTime)
  }


  showModal = () => {
    this.setState({ visible: true });
  };
  hideModal = () => {
    this.setState({ visible: false });
  }
  submitPaper = () => {
    obj.sign = true;
    candidateInform(obj).then(res => {
      if (res.data.status) {
        message.success(res.msg);
        window.location.href = CANDIDATE;
        this.setState({ visible: false });
      }
    })
  };


  render() {
    const { tableArr, visible, isWatch, isOver, nowtime, secondTime } = this.state;
    const arr = handleRemainingTime(tableArr, 1)[0];
    // const time = arr[0].remaining_time;
    // console.log('#',time)

    return(
      <div className="candidate-site-layout">
        <div className="test-box">
          {
            tableArr.map(item => {
              return(
                <TestAlone 
                  values={ item } 
                  watch={ isWatch } 
                  over={ isOver }
                />
              )
            })
          }
        </div>
        <div className="inform-box">
          <div className="inform-box-time">{ secondTime }</div>
          <Button 
            type="primary" 
            className="submit-button"
            onClick={ this.showModal } 
          >
            提交试卷
          </Button>
          <Modal
            title="提交试卷"
            visible={ visible }
            onOk={ this.submitPaper }
            onCancel={ this.hideModal }
            okText="确认"
            cancelText="取消"
          >
            {
              '距离试卷截止时间 ' + (nowtime) + ' ，如果你确定要提前交卷，请务必填写如下内容：'
            }
            本人已 <Input placeholder='完成该试卷'/> 现 <Input placeholder='确定提前交卷' />
          </Modal>
        </div>
      </div>
    )
  }
}