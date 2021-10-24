import React from 'react';
import { Modal, Button } from 'antd';

import 'style/showTest.less';
import { getUrlParam, handleRemainingTime, nowTime } from 'common/utils';
import TestAlone from 'common/components/testAlone';
import { showTest } from 'api/modules/interface';

export default class ShowTest extends React.Component {
  state = {
    tableArr: [] = [],
    visible: false,
  }

  async componentDidMount() {
    const url = getUrlParam('paper');
    const res = await showTest({ paper: url });
    this.setState({ tableArr: res.data });
    console.log(this.state.tableArr);
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };


  render() {
    const { tableArr, visible } = this.state;
    const nowtime = nowTime();
    const time = handleRemainingTime(tableArr, 1);
    console.log(time)

    return(
      <>
        <div className="test-box">
          <Button type="primary" onClick={ this.showModal } className="submit-button">提交试卷</Button>
          <Modal
            title="提交试卷"
            visible={ visible }
            onOk={ this.hideModal }
            onCancel={ this.hideModal }
            okText="确认"
            cancelText="取消"
          >
            {
              '距离试卷截止时间还剩' + (nowtime)
            }
            <p>Bla bla ...</p>
          </Modal>

          {
            tableArr.map(item => {
              return(
                <TestAlone values={ item } />
              )
            })
          }
        </div>
        <div className="inform-box">
        </div>
      </>
    )
  }
}