import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Login from './pages/login/login'

export default class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/' component={Login}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}