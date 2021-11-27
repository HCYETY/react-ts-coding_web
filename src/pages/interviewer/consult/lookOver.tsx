import React from 'react';
import { Layout } from 'antd';

import 'style/interviewer/examReport.css';
import { search } from 'api/modules/candidate';
import { showTest } from 'api/modules/test';
import { submit } from 'api/modules/candidate';
import Navbar from 'common/components/navbar';
import ExamReport from 'common/components/interviewer/examReport';
import { connect } from 'react-redux';

interface Prop {
  lookExam: string;
  lookEmail: string;
}

class LookOver extends React.Component<Prop> {

  state = {
    examInform: [] = [],
    exam: [] = [],
    test: [] = [],
  }

  token: string;
  componentDidMount() {
    const { lookExam, lookEmail } = this.props;
    search({ paper: lookExam, reqEmail: lookEmail }).then(item => {
      this.setState({ examInform: item.data.ret });
    })
    showTest({ paper: lookExam }).then(item => {
      this.setState({ test: item.data.show });
    })
  }

  // submit({ cookie }).then(res => {

  // })

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
          {/* <Button onClick={ this.submit }>提交试卷评分</Button> */}
        </Layout.Content>
      </div>
    )
  }
}

function mapStateToProps(state: any) {
  return{
    lookExam: state.lookExam,
    lookEmail: state.lookEmail
  }
}
export default connect(mapStateToProps)(LookOver);