import React from 'react';
import { Modal, Button, message, Input, Statistic } from 'antd';

import 'style/showTests.less';
import { getDays, getUrlParam, handleTime, getCookie } from 'common/utils';
import TestAlone from 'common/components/testAlone';
import CountDown from 'common/components/countdown';
import { showTest } from 'api/modules/test/interface';
import { search, submit } from 'api/modules/candidate/interface';
import { CANDIDATE } from 'common/const';

const url = getUrlParam('paper');
const cookie = getCookie();
const obj = { paper: url, cookie: cookie };

export default class ShowTests extends React.Component {
  state = {
    tableArr: [] = [],
    visible: false,
    isWatch: false,
    isOver: false,
    endTime: 0,
    time: '',
  }

  async componentDidMount() {
    const res = await showTest(obj);
    const ans = await search(obj);
    const ret = ans.data.candidateInform[0];
    this.setState({ 
      tableArr: res.data.show,
      isWatch: ret.watch,
      isOver: ret.over,
      endTime: Number(ret.time_end),
    });
  }

  // 显示“提交试卷”抽屉，并执行倒计时函数
  showModal = () => {
    this.setState({ visible: true });
    this.countdown(this.state.endTime);
  };
  hideModal = () => {
    this.setState({ visible: false });
    clearInterval(this.timer);
  }

  // “提交试卷”抽屉中剩余时间倒计时
  timer: NodeJS.Timer = null;
  countdown = (endTime: number) => {
    const arr = handleTime(this.state.tableArr, 1);
    console.log(arr)
    const time = arr && arr[0] ? arr[0].remaining_time : null;
    console.log('#',time)
    this.timer = setInterval(() => {
      this.countdown(this.state.endTime)
    }, 1000);
  }

  // 提交试卷事件
  submitPaper = () => {
    submit(obj).then(res => {
      if (res.data.status) {
        message.success(res.msg);
        window.location.href = CANDIDATE;
      }
    })
  };


  render() {
    const { tableArr, visible, isWatch, isOver, endTime, time, } = this.state;

    return(
      <div className="tests-box">
        <div className="test-box">
          {
            tableArr && tableArr.map(item => {
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
          {/* <CountDown 
            over={ isOver }
            endTime={ endTime } 
            submitPaper={ this.submitPaper.bind(this) }
          /> */}
          <div className="inform-box-countdown">
            <Statistic.Countdown 
              title="试卷剩余时间" 
              value={ endTime } 
              format="D 天 H 时 m 分 s 秒" 
            />
          </div>

          <Button 
            type="primary" 
            className="submit-button"
            onClick={ this.showModal } 
            disabled={ isOver === true ? true : false }
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
              '距离试卷截止时间 ' + (time) + ' ，如果你确定要提前交卷，请务必填写如下内容：'
            }
            本人已 <Input placeholder='完成该试卷'/> 现 <Input placeholder='确定提前交卷' />
          </Modal>
        </div>
      </div>
    )
  }
}