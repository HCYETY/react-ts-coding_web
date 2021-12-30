import React from 'react';
import { Button, Card, Form, Layout, message } from 'antd';

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
    const find = this.rateArr.find(item =>  item.testName === testName);
    find ? find['score'] = score : this.rateArr.push({ testName, score });
  }

  submitRate = () => {
    const { lookExam, lookEmail } = this.props;
    console.log(lookExam, lookEmail)
    lookOver({ paper: lookExam, reqEmail: lookEmail, rate: this.rateArr }).then(res => {
      console.log('submitRate res', res)
      if (res.data.status === true) {
        message.success(res.msg);
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

        <div className="content">
          {/* <Form onFinish={ this.submitRate }> */}
            { examInform.map(item => {
              return(
                <ExamReport 
                  key={ item['test_name'] }
                  getRate={ this.getRate } 
                  examInform={ item } 
                />
              )
            }) }
            {/* <Form.Item wrapperCol={{ offset: 10, span: 16 }}> */}
              <Button type="primary" onClick={ this.submitRate }>提交试卷评分</Button>
            {/* </Form.Item> */}
          {/* </Form> */}
        </div>
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