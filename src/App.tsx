import React, { PureComponent } from 'react';
import { BrowserRouter  as Router, Route, Switch, Redirect } from "react-router-dom";

import Login from 'pages/login';
import Candidate from 'pages/candidate';
import Interviewer from 'pages/interviewer';
import Edit from 'pages/interviewer/edit/show';
import Add from 'pages/interviewer/edit/add';
import Modify from 'pages/interviewer/edit/modify';

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
        <Router>
          <Switch>
            <Route path="/login" component={ Login }></Route>
            <Route path="/interviewer" component={ Interviewer }></Route>
            <Route path="/edit" component={ Edit }></Route>
            <Route path="/add" component={ Add }></Route>
            <Route path="/modify" component={ Modify }></Route>
            <Route path="/candidate" component={ Candidate }></Route>
            <Redirect to='/login'></Redirect>
          </Switch>
        </Router>
      )
    }
  }
}

export default App;