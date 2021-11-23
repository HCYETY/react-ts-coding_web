import React from 'react';
import { message, Tag } from 'antd';
import { DoubleRightOutlined, CheckCircleOutlined } from '@ant-design/icons';

import 'style/interviewer/testAlone.less';
import { TEST, WATCH_TEST } from 'common/const';
import { getExamLevel } from 'common/utils';

export default class TestAlone extends React.Component<any, any> {
  render() {
    const watch = this.props.watch, over = this.props.over;
    const item = this.props.values;
    const num = item.num, 
      title = item.test_name, 
      level = item.level, 
      point = item.point, 
      tags = item.tags, 
      check = item.check, 
      timeBegin = item.paper.time_begin, 
      timeEnd = item.paper.time_end;
    const nowtime = new Date().getTime();

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
          <div className="exam-box-left">
            <div> <h3>{ num }. { title }</h3> </div>
            <div>
              {
                tags.map((tag: any) => {
                  let color = tag.length > 2 ? 'geekblue' : 'green';
                  if (tag === 'loser') {
                    color = 'volcano';
                  }
                  return (
                    <Tag color={ color } key={ tag }>
                      {tag}
                    </Tag>
                  );
                })
              }
            </div>
          </div>

          <div> <h3 className={ getExamLevel(level) }>{ level }</h3> </div>

          <div> <h3 >分数：{ point }</h3> </div>

          <div className="exam-box-right">
            {
              (watch === true && over === true) ?  
              <a className='exam-status' onClick={ nodoJump }>
                点击查看
                <DoubleRightOutlined />
              </a> :
              (watch === false && over === true) ? 
              <span className='exam-status exam-status-finish'>已完成<CheckCircleOutlined/></span> : 
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