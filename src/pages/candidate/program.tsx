import React from 'react';
import { Button, Form, Input, Tabs } from 'antd';
import {
  EllipsisOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  CheckSquareOutlined,
  CommentOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

import 'style/program.less';
import CodeEditor from 'common/components/codeEditor';
import { getUrlParam } from 'common/utils';
import { showTest } from 'api/modules/interface';


export default class Program extends React.Component {
  state = {
    testInform: {},
  }

  componentDidMount() {
    const url = getUrlParam('test');
    showTest({ test: url }).then(res => {
      this.setState({ testInform: res.data })
    })
  }

  callback = (key: any) => {
    console.log(key);
  }

  submitProgram = (values: any) => {
    console.log(values)
  }
  
  render() {
    const url = getUrlParam('test');
    const { testInform } = this.state;
    console.log(testInform)
    

    return(
      <div className="whole">

        <div className="left">
          <Tabs onChange={ this.callback } type="card" tabBarGutter={0} size='large'>
            <Tabs.TabPane  
              tab={
                <span>
                  <ProfileOutlined />
                  题目描述
                </span>
              }
              key='test'
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
        </div>

        <div className="right">
          {/* <CodeEditor /> */}
          <Form  onFinish={ this.submitProgram }>
            <Form.Item name="program">
              <Input.TextArea ></Input.TextArea>
            </Form.Item>
            <Form.Item> 
              <Button >提交代码</Button>
            </Form.Item>
          </Form>
        </div>

      </div>
    )
  }
}