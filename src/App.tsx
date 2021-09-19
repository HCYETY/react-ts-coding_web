import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies'

import './style.less';
import Home from 'pages/home'
import Login from 'pages/login';

const isHasAuth = cookie.load('session')
console.log(isHasAuth)

class App extends PureComponent {
  render() {
    if (!isHasAuth) {
      console.log(isHasAuth)
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
            <Route path="/" exact component={Home}></Route>
            <Route path="/login" component={Login}></Route>
            <Redirect to='/'></Redirect>
          </Switch>
        </Router>
      )
    }
  }
}

export default App;