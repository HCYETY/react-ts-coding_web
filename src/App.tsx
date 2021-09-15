import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './style.less';
import Home from 'pages/home'
import Login from 'pages/login';

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/login" component={Login}></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;