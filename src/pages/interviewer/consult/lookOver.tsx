import React from 'react';
import { Button, Layout } from 'antd';

import 'style/interviewer/examReport.css';
import Navbar from 'common/components/navbar';
import { getCookie, getUrlParam } from 'common/utils';
import { search } from 'api/modules/candidate';
import ExamReport from 'common/components/interviewer/examReport';
import { showTest } from 'api/modules/test';
import { submit } from 'api/modules/candidate';

const cookie = getCookie();

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
    search({ reqEmail, reqPaper }).then(item => {
      this.setState({ examInform: item.data.ret });
    })
    showTest({ paper: reqPaper  }).then(item => {
      this.setState({ test: item.data.show });
    })
  }

  submit({ cookie }).then(res => {

  })

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
          <Button onClick={ this.submit }>提交试卷评分</Button>
        </Layout.Content>
      </div>
    )
  }
}