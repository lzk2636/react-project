import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Message, Select } from 'element-react'
import { editEnterprise } from '../../../api/enterprise.js'
class EditEnterprise extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                "eid": "",
                "name": "",
                "short_name": "",
                "intro": "",
                "remark": "",
                "status": 0
            }
        }

    }
    static getDerivedStateFromProps(news, olds) {
        if (news.obj !== undefined && news.obj.eid !== olds.form.eid) {
            // console.log(news,olds)
            return {
                form: Object.assign(olds.form, news.obj)
            }

        }
        return null

    }
    setValue(val) {
        this.setState({
            eddEnterdialogVisible: val
        })
    }
    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        })
    }
    fnSubmit = (e) => {
        e.preventDefault()
        this.refs.form.validate(async (valid) => {
            if (valid) {
                // alert('submit!');
                let res = await editEnterprise(this.state.form)
                if (res.code === 200) {
                    Message.success("编辑企业成功")
                    this.setState({
                        eddEnterdialogVisible: false,
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
                title="添加题库"
                size="tiny"
                visible={this.state.eddEnterdialogVisible}
                onCancel={() => this.setState({ eddEnterdialogVisible: false })}
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
                    <Button onClick={() => this.setState({ eddEnterdialogVisible: false })}>取消</Button>
                    <Button type="primary" onClick={this.fnSubmit}>确定</Button>
                </Dialog.Footer>
            </Dialog>
        );
    }
}

export default EditEnterprise;