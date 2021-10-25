import React, { PureComponent } from 'react';
import { BrowserRouter  as Router, Route, Switch, Redirect } from "react-router-dom";

import Head from 'common/components/header';
import Foot from 'common/components/footer';
import Login from 'pages/login';
import Candidate from 'pages/candidate';
import Interviewer from 'pages/interviewer';
import Edit from 'pages/interviewer/edit/show';
import Add from 'pages/interviewer/edit/add';
import Modify from 'pages/interviewer/edit/modify';
import ShowTests from 'pages/candidate/showTests';
import WatchTest from 'pages/candidate/WatchTest';
import Program from 'pages/candidate/program';

const isHasAuth = document.cookie;

class App extends PureComponent {
  render() {
    if (!isHasAuth) {
      return (
        <Router>
          <Route path="/login" component={ Login }></Route>
          <Redirect to='/login'></Redirect>
        </Router>
      )
    } else {
      return (
        <>
          <Head />

          <Router>
            <Switch>
              <Route path="/login" component={ Login }></Route>
              <Route path="/interviewer" component={ Interviewer }></Route>
              <Route path="/edit" component={ Edit }></Route>
              <Route path="/add" component={ Add }></Route>
              <Route path="/modify" component={ Modify }></Route>
              <Route path="/candidate" component={ Candidate }></Route>
              <Route path="/show-tests" component={ ShowTests }></Route>
              <Route path="/watch-test" component={ WatchTest }></Route>
              <Route path="/test" component={ Program }></Route>
              <Redirect to='/login'></Redirect>
            </Switch>
          </Router>
          
          <Foot />
        </>
      )
    }
  }
}

export default App;