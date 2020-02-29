import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Message } from 'element-react'
import {addSubject} from '../../../api/subject'
class DialogSubject extends Component {
    constructor(props) {
        super(props);
        // console.log(props)
        this.state = {
            subdialogVisible: false,
            form: {
                rid:"",
                name:"",
                short_name:"",
                intro:"",
                remark:""
            }
        };
    }
    showIN(show){
        this.setState({
            subdialogVisible:show
        })
    }

    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        });
    }
    fnSubmit=async()=>{
        const res = await addSubject(this.state.form)
        if(res.code===200){
            Message.success("添加学科成功")
            this.setState({
                subdialogVisible:false,
                form:{}
            },()=>{
                this.props.update()

            })

        }

    }
    render() {
        return (
            <div>
                <Dialog
                    title="添加学科"
                    size="tiny"
                    visible={this.state.subdialogVisible}
                    onCancel={() => this.setState({ subdialogVisible: false })}
                    lockScroll={false} >
                    <Dialog.Body>
                        <Form labelPosition={"left"} labelWidth="100" model={this.state.form} className="demo-form-stacked">
                            <Form.Item label="学科编号">
                                <Input value={this.state.form.rid} onChange={this.onChange.bind(this, 'rid')}></Input>
                            </Form.Item>
                            <Form.Item label="学科名称">
                                <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
                            </Form.Item>
                            <Form.Item label="学科简称">
                                <Input value={this.state.form.short_name} onChange={this.onChange.bind(this, 'short_name')}></Input>
                            </Form.Item>
                            <Form.Item label="学科简介">
                                <Input value={this.state.form.intro} onChange={this.onChange.bind(this, 'intro')}></Input>
                            </Form.Item>
                            <Form.Item label="学科备注">
                                <Input value={this.state.form.remark} onChange={this.onChange.bind(this, 'remark')}></Input>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({ subdialogVisible: false })}>取消</Button>
                        <Button type="primary"  onClick={this.fnSubmit}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }

}

export default DialogSubject;