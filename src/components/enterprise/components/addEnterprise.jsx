import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Message, Select } from 'element-react'
import  {addEnterprise} from '../../../api/enterprise.js'
class EddEnterprise extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                "eid": "qd1101",
                "name": "传智播客",
                "short_name": "黑马",
                "intro": "移动开发",
                "remark": "备注说明",
                "status": 1
            }
        }


    }
    setValue(val){
        this.setState({
            EnterdialogVisible:val
        })
    }
    onChange(key,value){
        this.setState({
            form:Object.assign(this.state.form,{[key]:value})
        })
    }
    fnSubmit = (e) => {
        e.preventDefault()
        this.refs.form.validate(async (valid) => {
            if (valid) {
                // alert('submit!');
                let res = await addEnterprise(this.state.form)
                if (res.code === 200) {
                    Message.success("添加学生用成功")
                    this.setState({
                        EnterdialogVisible: false,
                        form: {}
                    }, () => this.props.addEnterprise())
                } else {
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
                visible={this.state.EnterdialogVisible}
                onCancel={() => this.setState({ EnterdialogVisible: false })}
                lockScroll={false} >
                <Dialog.Body>
                    <Form labelPosition={"left"} ref="form" labelWidth="100" rules={this.state.rules} model={this.state.form} className="demo-form-stacked">
                        <Form.Item label="企业编号" >
                            <Input value={this.state.form.eid} onChange={this.onChange.bind(this, 'eid')}></Input>
                        </Form.Item>
                        <Form.Item label="企业名称" prop="name">
                            <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
                        </Form.Item>
                        <Form.Item label="简称" prop="short_name">
                            <Input value={this.state.form.short_name} onChange={this.onChange.bind(this, 'short_name')}></Input>
                        </Form.Item>

                        <Form.Item label="企业简介" >
                            <Input value={this.state.form.intro} onChange={this.onChange.bind(this, 'intro')}></Input>
                        </Form.Item>
                        <Form.Item label="备注">
                            <Input value={this.state.form.remark} onChange={this.onChange.bind(this, 'remark')}></Input>
                        </Form.Item>
                    </Form>
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    <Button onClick={() => this.setState({ EnterdialogVisible: false })}>取消</Button>
                    <Button type="primary" onClick={this.fnSubmit}>确定</Button>
                </Dialog.Footer>
            </Dialog>
        );
    }
}

export default EddEnterprise;