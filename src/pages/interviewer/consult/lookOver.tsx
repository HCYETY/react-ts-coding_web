import React from 'react';
import { Button, Layout } from 'antd';

import 'style/interviewer/examReport.css';
import Navbar from 'common/components/navbar';
import { getCookie, getUrlParam } from 'common/utils';
import { search } from 'api/modules/candidate';
import ExamReport from 'common/components/interviewer/examReport';
import { showTest } from 'api/modules/test';
import { submit } from 'api/modules/candidate';
import store from 'useRedux/store';
import { connect } from 'react-redux';

const cookie = getCookie();

interface Prop {
  exam: string;
}

class LookOver extends React.Component<Prop> {

  state = {
    examInform: [] = [],
    exam: [] = [],
    test: [] = [],
  }

  token: string;
  componentDidMount() {
    const reqEmail = getUrlParam('exam-email');
    let reqPaper = this.props.exam;
    search({ reqEmail, reqPaper }).then(item => {
      this.setState({ examInform: item.data.ret });
    })
    showTest({ paper: reqPaper  }).then(item => {
      this.setState({ test: item.data.show });
    })
  }

  // submit({ cookie }).then(res => {

  // })

  render() {
    const { examInform, exam, test } = this.state;
console.log(this.props)
    return(
      <div className="site-layout">
        <Navbar/>
<h1>获取的试卷名为{this.props.exam}</h1>

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
          {/* <Button onClick={ this.submit }>提交试卷评分</Button> */}
        </Layout.Content>
      </div>
    )
  }
}

function mapStateToProps(state: any) {
  return{
    exam: state.exam
  }
}
export default connect(mapStateToProps)(LookOver);