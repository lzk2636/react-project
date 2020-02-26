import React, { Component } from 'react';
import {
    Button, Dialog, Form, Input, Upload, imageUrl, Message, Layout
} from 'element-react'
import propTypes from 'prop-types';
import {sendsms} from '../../../api/login.js'
class Register extends Component {
    regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
    myTimer=null
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: true,
            imageUrl: '',
            regForm: {
                phone: "",
                username: "",
                rcode: "",
                avatar: "",
                password: "",
                imgCode: "",
                email: ""
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
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (!this.regEmail.test(value)) {
                                callback(new Error('邮箱不匹配'));
                            } else {

                                callback();
                            }
                        }
                    }

                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 3, max: 16, message: "密码为3-16个字符" }
                ],
                imgCode: [
                    { required: true, message: '图形码不能为空', trigger: 'blur' },
                    { min: 4, max: 4, message: "图形码4个字符" }
                ],
                rcode: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' },
                    { min: 4, max: 4, message: "验证码4个字符" }
                ]
            },
            captchaCode: "http://127.0.0.1/heimamm/public/captcha?type=sendsms",
            bIsRun: false,
            timer:10
        };
        
    }
    setInfo = (val) => {
        this.setState({
            dialogVisible: val
        })
    }
    handleAvatarScucess(res, file) {
        this.state.regForm.avatar=res.data.file_path
        this.setState({
            regForm:this.state.regForm
        })
        this.setState({ imageUrl: URL.createObjectURL(file.raw) });
        console.log(this.state.regForm)
    }

    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'||"image/png"||"image/gif";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
            Message('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
            Message('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    }
    onChange(key, value) {
        this.setState({
            regForm: Object.assign({}, this.state.regForm, { [key]: value })
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        this.refs.form.validate((valid) => {
            if (valid) {

                console.log('object :');

            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }
    // 改变图形码
    fncaptchaCode = () => {
        let captchaCode = "http://127.0.0.1/heimamm/public/captcha?type=sendsms&" + Date.now()
        this.setState({
            captchaCode
        })
    }
    // 获取验证码
    fnGetCode =async () => {
        //    console.log(this.regPhone)
        if (!this.regPhone.test(this.state.regForm.phone) || this.state.regForm.imgCode.trim().length !== 4) return
        if(this.state.bIsRun) return
        this.setState({
            bIsRun:true,
        })
        this.myTimer=setInterval(() => {
                this.setState(state=>({timer:state.timer-1}))
                if(this.state.timer<=1){
                    clearInterval(this.myTimer)
                    this.setState({
                        timer:10,
                        bIsRun:false
                    })
                }
        }, 1000);
        let res = await sendsms({
            code:this.state.regForm.imgCode,
            phone:this.state.regForm.phone
        })
        if(res.code===200){
            Message({
                type:"success",
                message:res.data.captcha
            })
        }else{
            Message({
                type:"error",
                message:res.message
            })
        }

    }
    componentWillUnmount(){
        clearInterval(this.myTimer)
    }
    render() {
        const { imageUrl } = this.state;
        return (
            <div>
                <Dialog
                    title="注册"
                    size="tiny"
                    visible={this.state.dialogVisible}
                    onCancel={() => this.setState({ dialogVisible: false })}
                    lockScroll={false}
                >
                    <Dialog.Body>
                        <Form ref="form" model={this.state.regForm} rules={this.state.rules} labelWidth="100px" className="login-form">
                            <Form.Item label="头像" labelWidth="80" style={{ height: "100px" }}>
                                <Upload
                                    className="avatar-uploader"
                                    action="http://127.0.0.1/heimamm/public/uploads"
                                    showFileList={false}
                                    name="image"
                                    onSuccess={(res, file) => this.handleAvatarScucess(res, file)}
                                    beforeUpload={file => this.beforeAvatarUpload(file)}
                                >
                                    {imageUrl ? <img src={imageUrl} className="avatar" style={{ width: "100px", height: "100px" }} /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                </Upload>
                            </Form.Item>
                            <Form.Item label="昵称" labelWidth="80">
                                <Input type="text" value={this.state.regForm.username} onChange={this.onChange.bind(this, 'username')} autoComplete="off" />
                            </Form.Item>
                            <Form.Item label="邮箱" labelWidth="80" prop="email" >
                                <Input type="text" value={this.state.regForm.email} onChange={this.onChange.bind(this, 'email')} autoComplete="off" />
                            </Form.Item>
                            <Form.Item label="手机" labelWidth="80" prop="phone">
                                <Input type="text" value={this.state.regForm.phone} onChange={this.onChange.bind(this, 'phone')} autoComplete="off" />
                            </Form.Item>
                            <Form.Item label="密码" labelWidth="80" prop="password">
                                <Input type="text" value={this.state.regForm.password} onChange={this.onChange.bind(this, 'password')} autoComplete="off" />
                            </Form.Item>
                            <Form.Item label="图形码" labelWidth="80" prop="imgCode">
                                <Layout.Row>
                                    <Layout.Col span="16">
                                        <Input type="text" value={this.state.regForm.imgCode} onChange={this.onChange.bind(this, 'imgCode')} autoComplete="off" />

                                    </Layout.Col>
                                    <Layout.Col span="7" offset="1">
                                        <img src={this.state.captchaCode} alt="" style={{ width: "100px" }} onClick={this.fncaptchaCode} />
                                    </Layout.Col>

                                </Layout.Row>

                            </Form.Item>
                            <Form.Item label="验证码" labelWidth="80" prop="rcode" >
                                <Layout.Row>
                                    <Layout.Col span="16">
                                        <Input type="text" value={this.state.regForm.rcode} onChange={this.onChange.bind(this, 'rcode')} autoComplete="off" />
                                    </Layout.Col>
                                    <Layout.Col span="7" offset="1">
                                        <Button plain={true} type="info"  onClick={this.fnGetCode}>{this.state.bIsRun ? this.state.timer : '获取验证码'}</Button>
                                    </Layout.Col>
                                </Layout.Row>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({ dialogVisible: false })}>取消</Button>
                        <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}

Register.propTypes = {
    name: propTypes.bool.isRequired
}

export default Register;