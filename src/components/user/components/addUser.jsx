import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Message, Select } from 'element-react'
import { addUser } from '../../../api/user'
import propTypes from 'prop-types'
class AddUser extends Component {
    regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
    regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
    constructor(props) {
        super(props)
        // console.log('object :', object);
        this.state = {
            form: {
                username: "",
                email: "",
                phone: "",
                role_id: "",
                status: "",
                remark: ""
            },
            UserdialogVisible: false,
            rules: {
                email: [
                    { required: true, message: '请输入得邮箱不能为空', trigger: 'blur' }, {
                        validator: (rule, value, callback) => {
                            if (this.regEmail.test(value)) {
                                callback()
                            } else {
                                callback(new Error("你的邮箱不符合"))
                            }

                        }
                    }
                ],
                phone: [
                    { required: true, message: '请输入手机不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (!this.regPhone.test(value)) {
                                callback(new Error('手机号码不匹配'));
                            } else {
                                callback();
                            }
                        }
                    }
                ]

            }
        };

    }
    setVisible(val) {
        this.setState({
            UserdialogVisible: val
        })
    }
    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })

        })
    }

    // 提交进行效验
    fnSubmit=(e)=>{
        e.preventDefault();

        this.refs.form.validate(async (valid) => {
          if (valid) {
            // alert('submit!');
            let res = await addUser(this.state.form)
            if(res.code===200){
                Message.success("添加学生用成功")
                this.setState({
                    UserdialogVisible:false,
                    form:{}
                },()=>this.props.upDateUser())
            }else{
                Message.warning(res.message)
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }

    render() {
        return (
            <Dialog
                title="添加用户"
                size="tiny"
                visible={this.state.UserdialogVisible}
                onCancel={() => this.setState({ UserdialogVisible: false })}
                lockScroll={false} >
                <Dialog.Body>
                    <Form labelPosition={"left"} ref="form" labelWidth="100" rules={this.state.rules} model={this.state.form} className="demo-form-stacked">
                        <Form.Item label="用户名" >
                            <Input value={this.state.form.username} onChange={this.onChange.bind(this, 'username')}></Input>
                        </Form.Item>
                        <Form.Item label="邮箱" prop="email">
                            <Input value={this.state.form.email} onChange={this.onChange.bind(this, 'email')}></Input>
                        </Form.Item>
                        <Form.Item label="电话" prop="phone">
                            <Input value={this.state.form.phone} onChange={this.onChange.bind(this, 'phone')}></Input>
                        </Form.Item>
                        {/* <Form.Item label="所属角色"> */}

                        {/* <Input value={this.state.form.role_id} onChange={this.onChange.bind(this, 'role_id')}></Input> */}
                        <Form.Item label="所属角色" style={{textAlign:"left"}}>
                            <Select value={this.state.form.role_id} placeholder="请选择角色" onChange={this.onChange.bind(this, 'role_id')}>
                                <Select.Option label="超级管理员" value="0"></Select.Option>
                                <Select.Option label="管理员" value="1"></Select.Option>
                                <Select.Option label="老师" value="2"></Select.Option>
                                <Select.Option label="学生" value="3"></Select.Option>
                            </Select>
                        </Form.Item>
                        {/* </Form.Item> */}
                        <Form.Item label="所属状态" style={{textAlign:"left"}}>
                            {/* <Input value={this.state.form.status} onChange={this.onChange.bind(this, 'status')}></Input> */}
                            <Select value={this.state.form.status} placeholder="请选择状态" onChange={this.onChange.bind(this, 'status')}>
                                <Select.Option label="禁用" value="0"></Select.Option>
                                <Select.Option label="开启" value="1"></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="用户备注">
                            <Input value={this.state.form.remark} onChange={this.onChange.bind(this, 'remark')}></Input>
                        </Form.Item>
                    </Form>
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    <Button onClick={() => this.setState({ UserdialogVisible: false })}>取消</Button>
                    <Button type="primary" onClick={this.fnSubmit}>确定</Button>
                </Dialog.Footer>
            </Dialog>
        );
    }
}
AddUser.propTypes = {
    UserdialogVisible: propTypes.bool
}

export default AddUser;