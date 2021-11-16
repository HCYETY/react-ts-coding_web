import React from 'react';
import { Layout } from 'antd';

import 'style/interviewer/examReport.css';
import Navbar from 'common/components/navbar';
import { getUrlParam } from 'common/utils';
import { search } from 'api/modules/candidate';
import ExamReport from 'common/components/interviewer/examReport';
import { showTest } from 'api/modules/test';

export default class LookOver extends React.Component {

  state = {
    examInform: [] = [],
    exam: [] = [],
    test: [] = [],
  }
  token: string;
  componentDidMount() {
    const reqEmail = getUrlParam('exam-email');
    let reqPaper = null;
    this.token = PubSub.subscribe('getExam', (_, data) => {
      reqPaper = data.exam;
    });
    search({ reqEmail, reqPaper }).then(item => {
      this.setState({ examInform: item.data.ret });
    })
    showTest({ paper: reqPaper  }).then(item => {
      this.setState({ test: item.data.show });
    })
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  render() {
    const { examInform, exam, test } = this.state;

    return(
      <div className="site-layout">
        <Navbar/>
        <Layout.Content>
          <div className="top"></div>
          <div className="content">
            {
              examInform.map(item => {
                // test.map(tmp => {
                  // if (tmp['test_name'] === item['test_name']) {
                    return(
                      <ExamReport inform={ item } key={ item['test_name'] }/>
                    )
                  // }
                // })
              })
            }
          </div>
        </Layout.Content>
      </div>
    )
  }
}