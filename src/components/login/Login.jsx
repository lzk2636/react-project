import React, { Component } from 'react';
import { Form, Input, Checkbox, Button,Message  } from 'element-react';

// import {Button} from 'element-react'
import 'element-theme-default';
import './login.css'
import { login } from '../../api/login'
import store from '../../store'
import Resgister from './components/Register'
class Login extends Component {
    regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/


    constructor(props) {
        // console.log(store)
        super(props);
        this.state = {
            dialogVisible:false,
            form: {
                phone: '',
                checkPass: '',
                code: ''
            },
            rules: {
                phone: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (!this.regPhone.test(value)) {
                                callback(new Error('手机号不匹配'));
                            } else {

                                callback();
                            }
                        }
                    }
                ],
                checkPass: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 6, max: 12, message: "密码长度为6~12个字符" }


                ],
                code: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' },
                    { min: 4, max: 4, message: "验证码4个字符" }
                ]
            },
            codeUrl: `http://127.0.0.1/heimamm/public/captcha?type=login`,
            bIsChecked: false
        };
     this.Listener=store.subscribe(this.fnListener)
    }

    componentWillUnmount(){
        this.Listener()
    }
    fnListener=()=>{
        
    }

    handleSubmit(e) {
        e.preventDefault();
        let { phone, code } = this.state.form
        if(!this.state.bIsChecked){
            Message({
                showClose: true,
                message: '必须先选中协议',
                type: 'error'
              });
            return
        }
        this.refs.form.validate(async (valid) => {
            if (valid) {
                // alert(this.state.form.code);
                // console.log(this.state.checkPass)
                let res = await login({ phone, code, password: this.state.form.checkPass })
                console.log(res)
                if(res.code===200){
                    localStorage.setItem('my_token',JSON.stringify(res.data))
                    store.dispatch({
                        type:'token',
                        value:res.data
                    })

                }

            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }

    handleReset(e) {
        e.preventDefault();

        this.refs.form.resetFields();
    }

    onChange(key, value) {
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value })
        });
    }
    fnChangeUrl = () => {
        let codeUrl = `http://127.0.0.1/heimamm/public/captcha?type=login&${Date.now()}`
        this.setState({
            codeUrl
        })
    }
    fnChangeStatus = (e) => {
        // console.log(e)
        this.setState({
            bIsChecked: e
        })

    }
    fnResgister=()=>{
        this.refs.myRef.setInfo(true)
    }

    render() {
        return (
            <div className="login-container">
                {/* <!-- 左侧表单 --> */}
                <div className="left">
                    <div className="title-box">
                        <img src={require('../../assets/login_icon.png')} alt="" />
                        <span className="title">黑马面面</span>
                        <span className="line"></span>
                        <span className="sub-title">用户登录</span>
                    </div>
                    {/* 表单提交 */}
                    <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="100px" className="login-form">
                        <Form.Item prop="phone" label="用户名" labelWidth="80">
                            <Input

                                type="text" value={this.state.form.phone} onChange={this.onChange.bind(this, 'phone')} autoComplete="off" />
                        </Form.Item>
                        <Form.Item prop="checkPass" label={"密码"} labelWidth="80">
                            <Input type="password" value={this.state.form.checkPass} onChange={this.onChange.bind(this, 'checkPass')} autoComplete="off" />
                        </Form.Item>
                        <Form.Item prop="code" label="验证码" className="code" labelWidth="80">
                            <Input value={this.state.form.code} onChange={this.onChange.bind(this, 'code')} ></Input>
                            <img src={this.state.codeUrl} alt="" style={{ width: "80px" }} onClick={this.fnChangeUrl} />
                        </Form.Item>
                        <Form.Item labelWidth="0">
                            <Checkbox onChange={this.fnChangeStatus} checked={this.state.bIsChecked}>  我已阅读并同意和隐私条款</Checkbox>

                        </Form.Item>
                        <Form.Item labelWidth="0">
                            <Button style={{ "width": "100%" }} type="primary" onClick={this.handleSubmit.bind(this)}>登录</Button>
                            {/* <Button onClick={this.handleReset.bind(this)}>重置</Button> */}
                        </Form.Item>
                        <Form.Item labelWidth="0">
                            <Button style={{ "width": "100%" }} onClick={this.fnResgister}>注册</Button>
                            {/* <Button onClick={this.handleReset.bind(this)}>重置</Button> */}
                        </Form.Item>

                    </Form>
                </div>
                <div className="right">
                    <img src={require('../../assets/login_bg.png')} alt="" />
                </div>
                <Resgister name={this.state.dialogVisible} ref="myRef"/>
            </div>
        );
    }
}

export default Login;