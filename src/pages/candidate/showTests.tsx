import React from 'react';
import { Modal, Button, message, Input, Statistic } from 'antd';

import 'style/candidate/showTests.less';
import { getDays, getUrlParam, handleTime, getCookie, transTime } from 'common/utils';
import TestAlone from 'src/common/components/candidate/testAlone';
import CountDown from 'src/common/components/candidate/countdown';
import { showTest } from 'api/modules/test';
import { search, submit } from 'api/modules/candidate';
import { CANDIDATE, TEST_STATUS } from 'common/const';

export default class ShowTests extends React.Component {
  url = getUrlParam('paper');
  cookie = getCookie();
  obj = { paper: this.url, cookie: this.cookie };

  state = {
    tableArr: [] = [],
    visible: false,
    isWatch: true,
    isOver: false,
    endTime: 0,
    time: '',
    inputInfo: '',
    count: 0,
    updateTime: '',
  }

  async componentDidMount() {
    const res = await showTest(this.obj);
    const ans = await search(this.obj);
    const ret = ans.data.ret[0];
    ret.test_status = ret.test_status === TEST_STATUS.DONE ? true : false;
    this.setState({ 
      tableArr: res.data.show,
      isWatch: ret.watch,
      isOver: ret.test_status,
      endTime: +ret.time_end,
      count: ret.time_end,
    });
    this.countdown();
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // 显示“提交试卷”抽屉，并执行倒计时函数
  showModal = () => {
    this.setState({ visible: true });
  };
  hideModal = () => {
    this.setState({ visible: false });
  }

  // “提交试卷”抽屉中剩余时间倒计时
  timer: NodeJS.Timer = null;
  countdown = () => {
    const { count } = this.state;
    const nowtime = new Date().getTime();
    const time = getDays(nowtime, count);
    this.setState({ count: count - 1000, updateTime: time });
    this.timer = setTimeout(() => {
      this.countdown()
    }, 1000);
  }

  // 获取输入框的内容
  saveInput = (e: any) => {
    this.setState({ inputInfo: e.target.value});
  }
  // 提交试卷事件
  submitPaper = () => {
    if (this.state.inputInfo === '确定提前交卷') {
      submit(this.obj).then(res => {
        if (res.data.status) {
          message.success(res.msg);
          window.location.href = CANDIDATE;
        }
      })
    } else {
      message.error('请输入正确的信息，以确认提交！')
    }
  };


  render() {
    const { tableArr, visible, isWatch, isOver, endTime, count, updateTime, } = this.state;
    const nowtime = new Date().getTime();

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
              onFinish={ this.submitPaper }
            />
          </div>

          <Button 
            type="primary" 
            className="submit-button"
            onClick={ this.showModal } 
            disabled={ endTime < nowtime }
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
              '距离试卷截止时间 ' + (updateTime) + ' ，如果你确定要提前交卷，请务必填写如下内容：'
            }
            <Input onChange={ this.saveInput } placeholder='确定提前交卷' />
          </Modal>
        </div>
      </div>
    )
  }
}