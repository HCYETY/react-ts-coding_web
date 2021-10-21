import React from 'react';
import {
  Tag
} from 'antd';
import 'style/examShow.less';

export default class ExamShow extends React.Component<any, any> {


  render() {
    console.log(this.props)

    return(
      <a href='/interviewer'>
        <div className="exam-box">
          <div className="left">
            <h1>{ this.props.title }</h1>
            <h2>{ this.props.description }</h2>
            <span>
              {this.props.tags.map((tag: any) => {
                let color = tag.length > 2 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag}
                  </Tag>
                );
              })}
            </span>
          </div>

          <div className="content">
            <label >试题数量：{ this.props.testsNum }</label>
            <label>起止时间：{ this.props.time } </label>
            {/* <label>开始时间：{ this.props.time } </label> */}
            {/* <label>截止时间：{ this.props.time } </label> */}
          </div>

          <div className="right">
            <span className='exam-status'>
              { this.props.status}
            </span>
          </div>

        </div>
      </a>
    )
  }
}