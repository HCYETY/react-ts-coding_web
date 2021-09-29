import React, { PureComponent } from 'react';
import { HashRouter  as Router, Route, Switch, Redirect, withRouter } from "react-router-dom";

import './style.less';
import Interviewer from 'pages/interviewer';
import Candidate from 'pages/candidate';
import Login from 'pages/login';

const isHasAuth = document.cookie;

class App extends PureComponent {
  render() {
    if (!isHasAuth) {
      return (
        <Router>
          <Route path="/login" component={Login}></Route>
          <Redirect to='/login'></Redirect>
        </Router>
      )
    } else {
      return (
        <Router>
          <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/interviewer" component={Interviewer}></Route>
            <Route path="/candidate" component={Candidate}></Route>
            <Redirect to='/'></Redirect>
          </Switch>
        </Router>
      )
    }
  }
}

export default App;