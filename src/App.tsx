import React, { PureComponent } from 'react';
import { BrowserRouter  as Router, Route, Switch, Redirect } from "react-router-dom";

import Head from 'common/components/header';
import Login from 'pages/login';
import Candidate from 'pages/candidate';
import Interviewer from 'pages/interviewer';
import Edit from 'pages/interviewer/edit/show';
import Add from 'pages/interviewer/edit/add';
import Modify from 'pages/interviewer/edit/modify';
import LookOver from 'pages/interviewer/consult/lookOver';
import ShowTests from 'pages/candidate/showTests';
import WatchTest from 'pages/candidate/WatchTest';
import Program from 'pages/candidate/program';
import { testLogin } from 'api/modules/interface';
import { getCookie } from 'common/utils';
import { 
  ADD, 
  CANDIDATE, 
  EDIT, 
  INTERVIEWER, 
  LOGIN, 
  MODIFY, 
  SHOW_TESTS, 
  TEST, 
  WATCH_TEST,
  LOOK_OVER,
} from './common/const';

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
              <Route path={ LOGIN } component={ Login }></Route>

              <Route path={ INTERVIEWER } component={ Interviewer }></Route>
              <Route path={ EDIT } component={ Edit }></Route>
              <Route path={ ADD } component={ Add }></Route>
              <Route path={ MODIFY } component={ Modify }></Route>
              <Route path={ LOOK_OVER } component={ LookOver }></Route>

              <Route path={ CANDIDATE } component={ Candidate }></Route>
              <Route path={ SHOW_TESTS } component={ ShowTests }></Route>
              <Route path={ WATCH_TEST } component={ WatchTest }></Route>
              <Route path={ TEST } component={ Program }></Route>
              
              <Redirect to={ LOGIN }></Redirect>
            </Switch>
          </Router>
        </>
      )
    // }
  }
}

export default App;