import React, { Component } from 'react';
import { HashRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import 'element-theme-default';

// 导入子组件
import Login from './components/login/Login.jsx'
import NotFound from './components/404/NotFound.jsx'
import Layout from './components/index/Layout.jsx'
import {userInfo} from './api/user'

class App extends Component {
  
  constructor(props){
    super(props)
    this.state={
      bIsLogin:false
    }
  }
  // bIsLogin=false
  async componentDidMount(){
      console.log(this)
    const res= await userInfo()
    if(res.code===200){
      // this.bIsLogin=true
      this.setState({
        bIsLogin:true
      },()=>{
        this.currentRouter()

      })
      // console.log(this.bIsLogin)
    }else if(res.code===206){
      // console.log(history)
      // this.props.history.push('/')
    }
  }
  componentWillReceiveProps(){
    console.log(this.props)
  }
  currentRouter(){
    if(this.state.bIsLogin){
      return <Layout/>
    }else{
      return <Login/>
    }
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/"   exact component={Login} />
            <Route path='/index' component={Layout}/>
            <Redirect  from="/sdsds" to="/" />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }

}

export default App;
