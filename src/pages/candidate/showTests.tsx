import React from 'react';
import { Modal, Button, message, Input } from 'antd';

import 'style/showTests.less';
import { residueTime, getDays, getUrlParam, handleRemainingTime, nowTime, getCookie } from 'common/utils';
import TestAlone from 'common/components/testAlone';
import CountDown from 'common/components/countdown';
import { showTest, candidateInform } from 'api/modules/interface';
import { CANDIDATE } from 'common/const';

const url = getUrlParam('paper');
const cookie = getCookie();
const obj = { paper: url, sign: false, cookie: cookie };

export default class ShowTests extends React.Component {
  state = {
    tableArr: [] = [],
    visible: false,
    isWatch: false,
    isOver: false,
    endTime: '',
  }

  async componentDidMount() {
    const res = await showTest(obj);
    const ans = await candidateInform(obj);
    const ret = ans.data.candidateInform[0];
    this.setState({ 
      tableArr: res.data,
      isWatch: ret.watch,
      isOver: ret.over,
      endTime: ret.time_end,
    });
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
      }
    })
  };


  render() {
    const { tableArr, visible, isWatch, isOver, endTime, } = this.state;
    const arr = handleRemainingTime(tableArr, 1)[0];
    // const time = arr[0].remaining_time;
    // console.log('#',time)

    return(
      <div className="tests-box">
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
          <CountDown 
            over={ isOver }
            endTime={ endTime } 
            submitPaper={ this.submitPaper.bind(this) }
          />

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
              '距离试卷截止时间 ' + (endTime) + ' ，如果你确定要提前交卷，请务必填写如下内容：'
            }
            本人已 <Input placeholder='完成该试卷'/> 现 <Input placeholder='确定提前交卷' />
          </Modal>
        </div>
      </div>
    )
  }
}