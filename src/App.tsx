import React, { PureComponent } from 'react';
import { BrowserRouter  as Router, Route, Switch, Redirect } from "react-router-dom";

import Head from 'common/components/header';
import Login from 'pages/login';
import Candidate from 'pages/candidate';
import Interviewer from 'pages/interviewer';
import Edit from 'pages/interviewer/edit/show';
import Add from 'pages/interviewer/edit/add';
import Modify from 'pages/interviewer/edit/modify';
import ShowTests from 'pages/candidate/showTests';
import WatchTest from 'pages/candidate/WatchTest';
import Program from 'pages/candidate/program';
import { testLogin } from 'api/modules/interface';
import { getCookie } from 'common/utils';

class App extends PureComponent {
  state = {
    // 这里有个小问题：isHasAuth 的值只能设置为 true，如果设置为 false，登录拦截会出现问题
    // 原因是 this.state 的更新不同步，如果 isHasAuth 为 false ，那么会先重定向到 /login 。但当它通过 this.state 更新为 true 的时候，此时的 url 已经是 /login 了，无法跳转到登录页之外的页面
    // 目前的解决方法是将 isHasAuth 设置为 true ，这样一来就不会出现上述问题
    // 但这样的话，在执行登录拦截时，用户可以看到一瞬间的非登录页，感觉不是很好
    isHasAuth: true
  }

  async componentDidMount() {
    const cookie = getCookie();
    const res = await testLogin({ cookie: cookie });
    this.setState({ isHasAuth: res.data.isLogin });
  }
  
  render() {
    const { isHasAuth } = this.state;
    if (isHasAuth === false) {
      return (
        <Router>
          <Route path="/login" component={ Login }></Route>
          <Redirect to='/login'></Redirect>
        </Router>
      )
    } else {
      return (
        <>
          <Head/>
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
        </>
      )
    }
  }
}

export default App;