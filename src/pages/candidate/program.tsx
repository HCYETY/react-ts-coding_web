import React from 'react';
import { Tabs } from 'antd';

import 'style/program.less';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
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
          <div className="left"></div>
            <Tabs onChange={ this.callback } type="card">
              <Tabs.TabPane tab='题目描述' key='test'>
                <div className="left-top">
                  <h4>{ testInform['num'] }、{ testInform['test_name'] }</h4>
                  <div className="left-top-tag">nihao</div>
                </div>
                <div className="left-content">
                  <span dangerouslySetInnerHTML = {{ __html: testInform['test']}}></span>
                </div>
              </Tabs.TabPane>

              <Tabs.TabPane tab='评论' key='comments'>

              </Tabs.TabPane>

              <Tabs.TabPane tab='题解' key='solution'>

              </Tabs.TabPane>

              <Tabs.TabPane tab='提交记录' key='submissions'>

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
          <div className="right"></div>
        </div>

        <Foot />
      </div>
    )
  }
}