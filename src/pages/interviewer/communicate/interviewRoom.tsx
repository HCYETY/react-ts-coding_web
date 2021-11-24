import React from 'react';
import { Button, Tabs, Space } from 'antd';

import 'style/interviewer/InterviewRoom.css';
import CodeEditor from 'common/components/candidate/codeEditor';
import ShowTest from 'pages/interviewer/communicate/showTest';
import { testObj } from 'common/types';
import { showTest } from 'src/api/modules/test';

interface Prop {

}

interface showTestObj {
  test_name: string;
  language: string;
  test: string;
}
interface State {
  showTestSwitch: boolean;
  choiceTestSwitch: boolean;
  showTest: showTestObj[];
  allTest: testObj[];
}

export default class InterviewRoom extends React.Component<Prop, State> {

  state = {
    showTestSwitch: false,
    choiceTestSwitch: false,
    showTest: [],
    allTest: [],
  }

  componentDidMount() {
    const ws = new WebSocket('ws:localhost:8080/api/communicate');
    ws.onopen = function(evt) { 
      console.log("正在连接 ..."); 
      ws.send("Hello WebSockets!");
    };
    
    ws.onmessage = function(evt) {
      console.log( "接收数据: " + evt.data);
      ws.close();
    };
    
    ws.onclose = function(evt) {
      console.log("连接关闭.");
    };      
  }

  addTest =() => {

  }
  choiceTest =() => {
    showTest().then(res => {
      this.setState({ choiceTestSwitch: true, allTest: res.data.show });
    })
  }
  getTest = (val: any) => {
    this.setState({ showTestSwitch: true, choiceTestSwitch: false, showTest: val });
  }

  render() {
    const { showTestSwitch, choiceTestSwitch, showTest, allTest } = this.state;

    return(
      <div className="box">
        <div className="box-left">
          <Tabs defaultActiveKey="program">
            <Tabs.TabPane tab="代码考核" key="program">
              <div className="program">
                <div className="program-left">
                  {
                    showTestSwitch === false ?
                    <>
                      <div className="program-left-bottom">
                        <Space direction="vertical">
                          <Button onClick={ this.addTest }>新增试题</Button>
                          <Button onClick={ this.choiceTest }>从题库中选题</Button>
                        </Space>
                      </div>
                    </> :
                    <div className="program-inform">
                      <div className="program-left-top">
                        <span>任务</span>
                        <Button onClick={ this.choiceTest }>再出一题</Button>
                      </div>
                      <div className="testName">{ showTest.test_name }</div> 
                      <div className="proviso">{ showTest.language }</div> 
                      <div className="testInform" dangerouslySetInnerHTML={{ __html: showTest.test }}></div> 
                    </div>
                  }
                </div>
                <div className="program-right">
                  {
                    choiceTestSwitch === false ?
                    <CodeEditor/> :
                    allTest.map(item => {
                      return(
                        <ShowTest inform={ item } getTest={ this.getTest }/>
                      )
                    })
                  }
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="简历查看" key="resume">
              <div className="resume-left"></div>
              <div className="resume-right"></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="笔试成绩" key="achievement">
              <div className="achievement-left"></div>
              <div className="achievement-right"></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="面试评价" key="evaluation">
              <div className="evaluation-left"></div>
              <div className="evaluation-right"></div>
            </Tabs.TabPane>
          </Tabs>
        </div>

        <div className="box-right">fffffff</div>
      </div>
    )
  }
}