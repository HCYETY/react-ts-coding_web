import React from 'react';
import { Form, InputNumber, } from 'antd';

import { showTest } from 'api/modules/test';
import 'style/interviewer/examReport.css';
import { getDays, transTime } from 'common/utils';

interface Prop {
  examInform: [],
  getRate: any,
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
}

export default class ExamReport extends React.Component<Prop, State> {

  state = {
    tableArr: [],
    testContent: '',
    testPoint: 0,
  }
  
  componentDidMount() {
    showTest({ test: this.props.examInform['test_name'] }).then(res => {
      const ret = res.data.show;
      this.setState({ testContent: ret.test, testPoint: ret.point });
    })
  }

  returnNumber = (score: number) => {
    const { examInform, getRate } = this.props;
    getRate(examInform['test_name'], score);
  }

  render() {
    const { tableArr, testContent, testPoint } = this.state;
    const { examInform, getRate } = this.props;
    const use_time = transTime(examInform['answer_end'] - examInform['answer_begin']);
    const show = JSON.stringify(examInform['program_answer'], undefined, 2);

    return(
      <div className="report">
        <div className="report-content-left">
          <h2 className="report-content-top">{ examInform['test_name'] }</h2>
          <span dangerouslySetInnerHTML={{ __html: testContent }}></span>
        </div>


        <div className="report-content-right">

            <div className="report-content-right-top">
              <span>用时：{ use_time }</span>
              <span>语言：{ examInform['program_language'] }</span>
              <span>提交次数：{ examInform['submit_num'] }</span>
            </div>

            <div className="report-content-right-content">
              <p>{ JSON.parse(show) }</p>
              {/* <p dangerouslySetInnerHTML={{ __html: examInform['program_answer'] }}></p> */}
            </div>

            <div className="report-content-right-bottom">
              <div>
                <div>满分：{ testPoint }</div>
                <div>
                  评分：
                  <InputNumber 
                    min={ 0 } 
                    max={ testPoint } 
                    size="small" 
                    onChange={ this.returnNumber }
                  />
                </div>
                {/* <Form.Item 
                  label="评分"
                  name="testRate"
                  key="testRate"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={ 0 } max={ testPoint } size="small"/>
                </Form.Item> */}
              </div>
            </div>

        </div>
      </div>
    )
  }
}