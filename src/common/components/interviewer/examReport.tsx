import React from 'react';

import 'style/interviewer/examReport.css';

interface get{
  inform: [],
}

export default class ExamReport extends React.Component<get, any> {

  state = {
    tableArr: [] = [],
  }

  render() {
    const { tableArr } = this.state;
    const examInform = this.props.inform;

    return(
      <div className="report">
        <div className="report-top">{ examInform['test_name'] }</div>
        <div className="report-content">
          <div className="report-content-left">
            <span dangerouslySetInnerHTML = {{ __html: examInform['test']}}></span>
          </div>
          <div className="report-content-right">
            <div className="report-content-right-top">
              <span>用时</span>
              <span>语言</span>
            </div>
            <div className="report-content-right-content">
              <span dangerouslySetInnerHTML = {{ __html: examInform['program_answer']}}></span>
            </div>
            <div className="report-content-right-bottom">
              
            </div>
          </div>
        </div>
      </div>
    )
  }
}