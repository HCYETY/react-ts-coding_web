import React from 'react';
import { Rate } from 'antd';

import { showTest } from 'api/modules/test';
import 'style/interviewer/examReport.css';
import { getDays, transTime } from 'common/utils';

interface Get {
  inform: [],
}

// interface programObj {
//   email: string;
//   paper: string;
//   program_answer: string;
//   watch: boolean;
//   test_name: string;
//   time_end: number;
//   test_level: string;
//   test_status: string;
//   score: number;
//   tags: string[];
//   program_language: string;
//   submit_num: number;
//   answer_time: number;
//   answer_end: number;
// }
interface State {
  tableArr: string[];
  testContent: string;
  testPoint: number;
  value: number;
}

export default class ExamReport extends React.Component<Get, State> {

  state = {
    tableArr: [],
    testContent: '',
    testPoint: 0,
    value: 3,
  }

  handleChange = (value: number) => {
    const { testPoint } = this.state;
    const step =  testPoint / 5;
    this.setState({ value: value * step });
  };
  
  componentDidMount() {
    showTest({ test: this.props.inform['test_name'] }).then(res => {
      const ret = res.data.show;
      this.setState({ testContent: ret.test, testPoint: ret.point });
    })
  }

  render() {
    const { tableArr, value, testContent, testPoint } = this.state;
    const examInform = this.props.inform;
    const step = testPoint / 5;
    const program_time = transTime(examInform['answer_end'] - examInform['answer_end']);

    return(
      <div className="report">
        <div className="report-top">{ examInform['test_name'] }</div>
        <div className="report-content">
          <div className="report-content-left">
            <span dangerouslySetInnerHTML={{ __html: testContent }}></span>
          </div>
          <div className="report-content-right">

            <div className="report-content-right-top">
              <span>用时{ program_time }</span>
              <span>语言{ examInform['program_language'] }</span>
              <span>提交次数{ examInform['submit_num'] }</span>
            </div>

            <div className="report-content-right-content">
              <p dangerouslySetInnerHTML={{ __html: examInform['program_answer'] }}></p>
            </div>

            <div className="report-content-right-bottom">
              <span>
                评分
                <Rate 
                  character={ ({ index }) => (index + 1) * step } 
                  onChange={this.handleChange} 
                  value={value} 
                />
              </span>
            </div>

          </div>
        </div>
      </div>
    )
  }
}