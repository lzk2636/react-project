import React, { Component } from 'react';
import { Button, Menu } from 'element-react'
import './Layout.css'
import index_icon from '../../assets/index_icon.png'
import { Route, Switch } from 'react-router-dom'
// 导入组件
import Subject from '../subject/subject'
import User from '../user/user'
import Enterprise from '../enterprise'
import Question from '../question'
import { userInfo } from '../../api/user.js'
class Layout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfos: {}
        }
        // console.log('this.props :', this.props);

    }
    onSelect(e) {
        // console.log('e :', e);
        switch (e) {
            case 'chart':
                // console.log('this.props :', this.props);
                this.props.history.push('/index/chart')
                break
            case 'subject':
                this.props.history.push('/index/subject')
                break

            case 'user':
                this.props.history.push('/index/user')
                break
            case 'enterprise':
                this.props.history.push('/index/enterprise')
                break
            case 'question':
                this.props.history.push('/index/question')
                break    

        }
    }
    componentDidMount() {
        this.currentData()
    }
    async currentData() {
        const res = await userInfo()
        console.log(res)
        if (res.code === 200) {
            this.setState({
                userInfos: res.data
            })
        }



    }

    render() {
        let { avatar, username } = this.state.userInfos
        // console.log(avatar)

        return (
            <div className="Layout-continer">
                <header>
                    <div className="loginIcon">
                        <i className="el-icon-s-fold" />
                        <img src={index_icon} alt="" />
                        <span className="title">黑马面面</span>
                    </div>
                    <div className="userInfo">
                        {/* "http://127.0.0.1/heimamm/public/"+userInfo.avatar */}
                        <img src={avatar == undefined ? require('../../assets/avatar.png') : `http://127.0.0.1/heimamm/public/${avatar}`} />
                        <span className="userName">{username}</span>
                        <Button type="primary" size="mini">退出</Button>
                    </div>
                </header>
                <div className="aside">
                    <Menu className="el-menu-vertical-demo" onSelect={this.onSelect.bind(this)}>
                        <Menu.Item index="chart"><i className="el-icon-edit"></i>数据概览</Menu.Item>
                        <Menu.Item index="user"><i className="el-icon-setting"></i>用户列表</Menu.Item>
                        <Menu.Item index="question"><i className="el-icon-document"></i>题库列表</Menu.Item>
                        <Menu.Item index="enterprise"><i className="el-icon-message"></i>企业列表</Menu.Item>
                        <Menu.Item index="subject"><i className="el-icon-menu"></i>学科列表</Menu.Item>
                    </Menu>

                </div>
                <content>
                    <Switch>
                        <Route path="/index/chart" component={Subject} exact></Route>
                        <Route path='/index/subject' component={Subject} ></Route>
                        <Route path='/index/user' component={User}></Route>
                        <Route path='/index/enterprise' component={Enterprise}></Route>
                        <Route path='/index/question' component={Question}></Route>


                    </Switch>

                </content>
            </div>
        );
    }
}

export default Layout;