import React from 'react';
import { Tabs } from 'antd';

import 'style/interviewer/InterviewRoom.css';
import CodeEditor from 'src/common/components/candidate/codeEditor';
export default class InterviewRoom extends React.Component {



  render() {

    return(
      <div className="box">
        <div className="left">
          <Tabs defaultActiveKey="program">
            <Tabs.TabPane tab="代码考核" key="program">
              <div className="program-left"></div>
              <div className="program-right">
                <CodeEditor/>
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

        <div className="right">fffffff</div>
      </div>
    )
  }
}