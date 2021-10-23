import React from 'react';
import { Tabs } from 'antd';
import {
  EllipsisOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  CheckSquareOutlined,
  CommentOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

import 'style/program.less';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import CodeEditor from 'public/components/codeEditor';
import { getUrlParam } from 'src/public/utils';
import { showTest } from 'src/api/modules/interface';


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
  
  render() {
    // const initialPanes = [
    //   { title: '题目描述', content: 'Content of Tab 1', key: 'test' },
    //   { title: '评论', content: 'Content of Tab 2', key: 'comments' },
    //   { title: '题解', content: 'Content of Tab 3', key: 'solution' },
    //   { title: '提交记录', content: 'Content of Tab 2', key: 'submissions' },
    // ];
    const url = getUrlParam('test');
    const { testInform } = this.state;
    console.log(testInform)
    

    return(
      <div>
        <Head />

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
              {/* {
                initialPanes.map(pane => {
                  return(
                    <Tabs.TabPane tab={ pane.title } key={ pane.key }>
                      { pane.content }
                    </Tabs.TabPane>
                  )
                })
              } */}
            </Tabs>
          </div>
          <div className="right">
            niho
            <CodeEditor />
          </div>
        </div>

        <Foot />
      </div>
    )
  }
}