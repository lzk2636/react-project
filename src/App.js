import React, { Component } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import 'element-theme-default';

// 导入子组件
import Login from './components/login/Login.jsx'
import NotFound from './components/404/NotFound.jsx'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/"  component={Login} exact/>
            <Redirect  from="/sdsds" to="/" />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }

}

export default App;
