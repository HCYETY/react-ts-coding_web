import React from 'react';
import { Button, Layout, message } from 'antd';

import 'style/interviewer/examReport.css';
import { search } from 'api/modules/candidate';
import { showTest } from 'api/modules/test';
import { submit } from 'api/modules/candidate';
import Navbar from 'common/components/navbar';
import ExamReport from 'common/components/interviewer/examReport';
import { connect } from 'react-redux';
import { lookOver } from 'src/api/modules/paper';

interface Prop {
  lookExam: string;
  lookEmail: string;
}

interface rateArrObj {
  testName: string;
  score: number;
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

  rateArr: rateArrObj[] = [];
  getRate = (testName: string, score: number) => {
    this.rateArr.push({ testName, score });
  }

  submitRate = () => {
    const { lookExam, lookEmail } = this.props;
    lookOver({ paper: lookExam, reqEmail: lookEmail, rate: this.rateArr }).then(res => {
      console.log('submitRate res', res)
      const { msg, data } = res;
      if (data.status === true) {
        message.success(msg);
      } else {
        message.error('试卷未完成批阅');
      }
    })
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
                return(
                  <ExamReport 
                    key={ item['test_name'] }
                    getRate={ this.getRate } 
                    examInform={ item } 
                  />
                )
              })
            }
          </div>
          <Button onClick={ this.submitRate }>提交试卷评分</Button>
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