import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter, RouteComponentProps } from "react-router-dom";

import Head from 'common/components/header';
import Login from 'pages/login';

// import Interviewer from 'pages/interviewer';
import Edit from 'pages/interviewer/edit/show';
import Add from 'pages/interviewer/edit/add';
import Modify from 'pages/interviewer/edit/modify';

import ShowExamContainer from 'src/pages/interviewer/consult/showExam';
import ExamInformContainer from 'pages/interviewer/consult/examInform';
import LookOverContainer from 'pages/interviewer/consult/lookOver';

import InterviewManage from 'pages/interviewer/communicate/interviewManage';
import InterviewRoom from 'pages/interviewer/communicate/interviewRoom';

import Candidate from 'pages/candidate';
import ShowTests from 'pages/candidate/showTests';
import WatchTest from 'pages/candidate/WatchTest';
import Program from 'pages/candidate/program';

import { testLogin } from 'api/modules/user';
import { getCookie } from 'common/utils';
import { 
  TEST_ADD, 
  TEST_MODIFY, 
  CANDIDATE, 
  LOGIN, 
  CANDIDATE_SHOW_TESTS, 
  CANDIDATE_TEST, 
  CANDIDATE_WATCH_TEST,
  SHOW_EXAM,
  EXAM_INFORM,
  LOOK_OVER,
  TEST_MANAGE,
  INTERVIEW_ROOM,
  INTERVIEW_MANAGE,
} from 'common/const';


class App extends PureComponent {
  componentDidMount() {
    const cookie = getCookie();
    const url = window.location.pathname;
    testLogin({ cookie: cookie }).then(res => {
      if (url !== LOGIN && (res.data.isLogin === false || cookie === undefined)) {
        window.location.href = LOGIN;
      }
    })
  }
  
  render() {
      return (
        <>
          <Head/>
          <Router>
            <Switch>
              <Route path={ LOGIN } component={ Login } exact></Route>

              <Route path={ TEST_MANAGE } component={ Edit } exact></Route>
              <Route path={ TEST_ADD } component={ Add }></Route>
              <Route path={ TEST_MODIFY } component={ Modify }></Route>
              <Route path={ SHOW_EXAM } component={ ShowExamContainer } exact></Route>
              <Route path={ EXAM_INFORM } component={ ExamInformContainer }></Route> 
              <Route path={ LOOK_OVER } component={ LookOverContainer }></Route>
              <Route path={ INTERVIEW_MANAGE } component={ InterviewManage } exact></Route> 
              <Route path={ INTERVIEW_ROOM } component={ InterviewRoom } exact></Route> 

              <Route path={ CANDIDATE } component={ Candidate } exact></Route>
              <Route path={ CANDIDATE_SHOW_TESTS } component={ ShowTests }></Route> 
              <Route path={ CANDIDATE_WATCH_TEST } component={ WatchTest }></Route> 
              <Route path={ CANDIDATE_TEST } component={ Program }></Route>
              
              <Redirect to={ LOGIN }></Redirect>
            </Switch>
          </Router>
        </>
      )
    // }
  }
}

export default App;