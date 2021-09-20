import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import './style.less';
import Interviewer from 'src/pages/interviewer';
import Candidate from 'src/pages/candidate';
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
            {/* <Route path="/" exact component={Candidate}></Route> */}
            <Route path="/login" component={Login}></Route>
            <Route path="/interviewer" exact component={Interviewer}></Route>
            <Route path="/candidate" exact component={Candidate}></Route>
            <Redirect to='/'></Redirect>
          </Switch>
        </Router>
      )
    }
  }
}

export default App;