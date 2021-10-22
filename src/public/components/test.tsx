import React from 'react';
import {
  Tag
} from 'antd';
import 'style/test.less';

import { nowTime } from 'public/utils';

export default class Test extends React.Component<any, any> {


  render() {
    const { title, num, level, tags, point, timeBegin } = this.props;
    const nowtime = nowTime();
    console.log(nowtime < timeBegin)

    return(
        <div className="exam-box">
          <div className="left">
            <div className="leftTop">
              <h3>{ num } 、 { title }</h3>
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
            <a className='exam-status' href={ nowtime < timeBegin === true ? `javascription:#;` : `/test?test=${ title }` }>
              { nowtime < timeBegin === true ? '未开始' : '去做题' }
            </a>
          </div>

        </div>
    )
  }
}