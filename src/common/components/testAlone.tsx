import React from 'react';
import {
  message,
  Tag,
} from 'antd';
import {
  DoubleRightOutlined,
} from '@ant-design/icons';

import 'style/testAlone.less';
import { handleRemainingTime } from 'common/utils';
import { nowTime } from 'common/utils';
import { SHOW_TESTS, TEST, WATCH_TEST } from 'common/const';

export default class TestAlone extends React.Component<any, any> {
  render() {
    const watch = this.props.watch,
      over = this.props.over;
    const item = this.props.values;
    const num = item.num, 
      title = item.test_name, 
      level = item.level, 
      point = item.point, 
      tags = item.tags, 
      check = item.check, 
      timeBegin = item.paper.time_begin, 
      timeEnd = item.paper.time_end;
    const nowtime = nowTime();

    function doJump() {
      if (nowtime < timeBegin || timeEnd < nowtime) {
        message.error('不在答题时间范围之内无法进行答题');
      } else if (timeBegin <= nowtime &&  nowtime <= timeEnd) {
        window.location.href = `${ TEST }?test=${ title }`;
      }
      console.log(nowtime, timeBegin, timeEnd)
    }
    function nodoJump() {
      PubSub.publish('isProgram', { status: false });
      window.location.href = `${ WATCH_TEST }?test=${ title }`;
    }

    return(
        <div className="exam-box">
          <div className="left">
            <div className="leftTop">
              <h3>{ num }. { title }</h3>
            </div>
            <div className="leftBottom">
              {
                tags.map((tag: any) => {
                  let color = tag.length > 2 ? 'geekblue' : 'green';
                  if (tag === 'loser') {
                    color = 'volcano';
                  }
                  return (
                    <Tag color={color} key={tag}>
                      {tag}
                    </Tag>
                  );
                })
              }
            </div>
          </div>

          <div className="content">
            <h3 className={ (level === '简单') ? 'easy' : (level === '中等') ? 'middle' : 'hard' }>{ level }</h3>
            {/* <span>
              {
                tags.map((tag: any) => {
                  let color = tag.length > 2 ? 'geekblue' : 'green';
                  if (tag === 'loser') {
                    color = 'volcano';
                  }
                  return (
                    <Tag color={color} key={tag}>
                      {tag}
                    </Tag>
                  );
                })
              }
            </span> */}
          </div>

          <div className="content">
            <h3 >分数：{ point }</h3>
          </div>

          <div className="right">
            {
              (watch === true && over === true) ?  
              <a className='exam-status' onClick={ nodoJump }>
                试卷已提交可点击查看
                <DoubleRightOutlined />
              </a> :
              (watch === false && over === true) ? 
              <span className='exam-status'>试卷已提交且无法查看</span> : 
              <a className='exam-status' onClick={ doJump }>
                去做题
                <DoubleRightOutlined />
              </a>
            }
          </div>

        </div>
    )
  }
}