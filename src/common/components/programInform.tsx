import React from 'react';
import { Tabs } from 'antd';
import {
  ClockCircleOutlined,
  ProfileOutlined,
  CommentOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

// import 'style/code.css';
// import 'style/program.less'
import { getExamLevel, getUrlParam } from 'common/utils';
import { showTest } from 'api/modules/interface';
import Wangeditor from './wangeditor';
import { TEST_LEVEL } from '../const';

export default class ProgramInform extends React.Component {
  state = {
    testInform: {},
  }

  componentDidMount() {
    const url = getUrlParam('test');
    showTest({ test: url }).then(res => {
      this.setState({ testInform: res.data.show })
    })
  }

  callback = (key: any) => {
    console.log(key);
  }

  render() {
    const { testInform } = this.state;

    return(
      <>
        <Tabs onChange={ this.callback }>
          <Tabs.TabPane  
            tab={
              <span>
                <ProfileOutlined />
                题目描述
              </span>
            }
            key='test'
          >
            <div className="describe-top">
              <h3>{ testInform['num'] }. { testInform['test_name'] }</h3>
              <div className="describe-top-tag">
                难度：<span className={ getExamLevel(testInform['level']) }>{ testInform['level'] }</span>
              </div>
            </div>
            <div className="describe-content">
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
            <Wangeditor />
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