import React, {  Component } from 'react';
import { Dialog, Button, Form, Input, Message } from 'element-react'
import propTypes from 'prop-types';
import { editSubject } from '../../../api/subject'
class EditSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editdialogVisible: false,
            forms: {
                rid: "",
                name: "",
                short_name: "",
                intro: "",
                remark: ""
            }
        };
    }
    static getDerivedStateFromProps(news, olds) {
        //    console.log(news)
        if (news.obj.rid !== olds.forms.rid) {
           
            return {
                forms: news.obj
            }
        }
        return null
    }
    // 写个方法给父组件调用
    Edit = () => {
        this.setState({
            editdialogVisible: true
        })
    }

    onChange(key, value) {
        // console.log( {[key]: value })
        
        this.setState({
            forms: Object.assign(this.state.forms, { [key]: value })
        });
    }

    
    fnSubmit = async () => {
        const res = await editSubject(this.state.forms)
        if (res.code === 200) {
            Message.success("编辑学科成功")
            this.setState({
                editdialogVisible: false,
            }, () => {
                this.props.updateEdit()
            })

        }

    }
    render() {
        // console.log(this.props)
        return (
            <div>
                <Dialog
                    title="编辑学科"
                    size="tiny"
                    visible={this.state.editdialogVisible}
                    onCancel={() => this.setState({ editdialogVisible: false })}
                    lockScroll={false} >
                    <Dialog.Body>
                        <Form labelPosition={"left"} labelWidth="100" model={this.state.forms} className="demo-form-stacked">
                            <Form.Item label="学科编号">
                                <Input value={this.state.forms.rid} disabled  onChange={this.onChange.bind(this, 'rid')}></Input>
                            </Form.Item>
                            <Form.Item label="学科名称">
                                <Input value={this.state.forms.name} onChange={this.onChange.bind(this, 'name')}></Input>
                            </Form.Item>
                            <Form.Item label="学科简称">
                                <Input value={this.state.forms.short_name} onChange={this.onChange.bind(this, 'short_name')}></Input>
                            </Form.Item>
                            <Form.Item label="学科简介">
                                <Input value={this.state.forms.intro} onChange={this.onChange.bind(this, 'intro')}></Input>
                            </Form.Item>
                            <Form.Item label="学科备注">
                                <Input value={this.state.forms.remark} onChange={this.onChange.bind(this, 'remark')}></Input>
                            </Form.Item> 
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({ editdialogVisible: false })}>取消</Button>
                        <Button type="primary" onClick={this.fnSubmit}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }

}
EditSubject.propTypes = {
    obj: propTypes.object
}
export default EditSubject;