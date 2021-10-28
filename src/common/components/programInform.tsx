import React from 'react';
import { Tabs } from 'antd';
import {
  ClockCircleOutlined,
  ProfileOutlined,
  CommentOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

import { getUrlParam } from 'common/utils';
import { showTest } from 'api/modules/interface';

export default class ProgramInform extends React.Component {
  state = {
    testInform: {},
  }

  componentDidMount() {
    const url = getUrlParam('test');
    showTest({ test: url }).then(res => {
      console.log(res.data)
      this.setState({ testInform: res.data })
    })
  }

  callback = (key: any) => {
    console.log(key);
  }

  render() {
    const { testInform } = this.state;

    return(
      <>
        <Tabs onChange={ this.callback } type="card" tabBarGutter={0} size='large'>
          <Tabs.TabPane  
            tab={
              <span>
                <ProfileOutlined />
                题目描述
              </span>
            }
            key='test'
            // className="tabs-header"
          >
            <div className="left-top">
              <h3>{ testInform['num'] }. { testInform['test_name'] }</h3>
              <div className="left-top-tag">
                <span>难度：{ testInform['level'] }</span>
              </div>
            </div>
            <div className="left-content">
              <span dangerouslySetInnerHTML = {{ __html: testInform['test']}}></span>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <CommentOutlined />
                评论
              </span>
            }
            key='comments'
          >

          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <ExperimentOutlined />
                题解
              </span>
            }
            key='solution'
          >
            <span dangerouslySetInnerHTML = {{ __html: testInform['answer']}}></span>
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <ClockCircleOutlined />
                提交记录
              </span>
            } 
            key='submissions' 
          >

          </Tabs.TabPane>
        </Tabs>
      </>
    )
  }
}