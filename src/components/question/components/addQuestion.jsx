import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Message, Select, Cascader, Radio, Upload, Checkbox } from 'element-react'
import { provinceAndCityData } from "element-china-area-data";
import { questionAdd } from '../../../api/question'
import './question.css';
import E from 'wangeditor'
class AddQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl01: '',
            imageUrl02: '',
            imageUrl03: '',
            imageUrl04: '',
            dialogVisible3: false,
            form: {
                city: [],
                type: '3',
                multiple_select_answer: [],
                select_options: [
                    {
                        label: "A",
                        text: "",
                        image: ""
                    },
                    {
                        label: "B",
                        text: "",
                        image: ""
                    },
                    {
                        label: "C",
                        text: "",
                        image: ""
                    },
                    {
                        label: "D",
                        text: "",
                        image: ""
                    }
                ],
                single_select_answer: 'A'
            },
            props: {
                value: 'label',
                children: 'cities'
            },
            options: provinceAndCityData,
            Vidieo: ""

        }

    }
    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        }
        )
    }
    handleAvatarScucess(res, file, num) {
        this.state.form.select_options[num].image = res.data.url

        this.setState({
            [`imageUrl0${num + 1}`]: URL.createObjectURL(file.raw),
            form: this.state.form
        });
    }

    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif' || 'image/svg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
            Message('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
            Message('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    }
    ChangeNum(key, value) {
        this.setState({ form: Object.assign(this.state.form, { single_select_answer: value }) })
    }
    changValue(key, value) {

        this.state.form.select_options[key].text = value
        this.setState(state => ({ form: state.form }))
    }
    async sumbit() {
        const res = await questionAdd(this.state.form)
        if (res.code === 200) {
            Message.success("题库添加成功")
            this.state.form.select_options.map(item => {
                return item.image = item.text = ""
            })
            this.setState({
                dialogVisible3: false,
                form: Object.assign({}, { select_options: this.state.form.select_options })
            })
            this.props.updateData()
        } else {
            Message.warning(res.message)
        }
        // console.log(res)
    }
    fnIsCheck(value, bIsChecked) {
        if (bIsChecked) {
            this.state.form.multiple_select_answer.push(value)
            this.setState({ form: this.state.form })
        } else {
            this.state.form.multiple_select_answer = this.state.form.multiple_select_answer.filter(item => item != value)
            this.setState({ form: this.state.form })
        }
    }
    componentDidMount() {
        // 创建编辑器
        var editor = new E('#editors')
        // console.log(editor)
        editor.customConfig.onchangeTimeout = 1000
        editor.customConfig.onchange = (html) => {

            this.state.form.short_answer = html
            this.setState({
                form: this.state.form
            })
        }
        editor.create()
    }
    // 上传视屏
    handleChange(res, file) {
        this.setState({
            Vidieo: file.url,
            form: Object.assign(this.state.form, { video: res.data.url })
        })
    }

    setVisible(val) {
        this.setState({
            dialogVisible3: val
        })
    }

    render() {
        // const { fileList } = this.state;
        return (
            <Dialog
                title="新增试题"
                size={"full"}
                visible={this.state.dialogVisible3}
                onCancel={() => this.setState({ dialogVisible3: false })}
            >
                <Dialog.Body>
                    <Form model={this.state.form} labelPosition={"left"}>
                        <Form.Item label="学科" labelWidth="120" style={{ textAlign: "left" }}>
                            <Select value={this.state.form.subject} placeholder="请选择学科" onChange={this.onChange.bind(this, 'subject')}>
                                {
                                    this.props.subjectList.map(item => {
                                        return <Select.Option label={item.name} value={item.id} key={item.id}></Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="阶段" labelWidth="120" style={{ textAlign: "left" }}>
                            <Select value={this.state.form.step} placeholder="请选择阶段" onChange={this.onChange.bind(this, 'step')}>
                                <Select.Option label="初级" value="1"></Select.Option>
                                <Select.Option label="中级" value="2"></Select.Option>
                                <Select.Option label="高级" value="3"></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="企业" labelWidth="120" style={{ textAlign: "left" }}>
                            <Select value={this.state.form.enterprise} placeholder="请选择企业" onChange={this.onChange.bind(this, 'enterprise')}>
                                {
                                    this.props.enterpriseList.map(item => {
                                        return <Select.Option label={item.name} value={item.id} key={item.id}></Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="城市" labelWidth="120" style={{ textAlign: "left" }}>
                            <Cascader
                                options={this.state.options}
                                value={this.state.form.city}
                                props={this.state.props}
                                onChange={this.onChange.bind(this, 'city')} />
                        </Form.Item>
                        <Form.Item label="题型" labelWidth="120" style={{ textAlign: "left" }}>
                            <Radio.Group value={this.state.form.type} onChange={this.onChange.bind(this, 'type')}>
                                <Radio value="1">单选</Radio>
                                <Radio value="2">多选</Radio>
                                <Radio value="3">简答</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="难度" labelWidth="120" style={{ textAlign: "left" }}>
                            <Radio.Group value={this.state.form.difficulty} onChange={this.onChange.bind(this, 'difficulty')}>
                                <Radio value="1">简单</Radio>
                                <Radio value="2">一般</Radio>
                                <Radio value="3">困难</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <hr />
                        <Form.Item label="标题" labelWidth="120" style={{ textAlign: "left" }}>
                            <Input type="text" value={this.state.form.title} onChange={this.onChange.bind(this, 'title')} style={{ width: "500px" }} />
                        </Form.Item>
                        <div ref="titleHeader" className="title-header"></div>
                        <div ref="titleMain" className="title-main"></div>
                        {
                            this.state.form.type === '1' ? <Form.Item label="单选">
                                <br /><br />
                                <div className="radio-box">
                                    <Radio value="A" onChange={this.ChangeNum.bind(this, 0)} checked={this.state.form.single_select_answer === "A"} >A</Radio>
                                    <Input type="text"
                                        value={this.state.form.select_options[0].text}
                                        onChange={this.changValue.bind(this, 0)}
                                        className="inputValue"
                                        style={{ width: "500px" }} />
                                    <Upload
                                        className="avatar-uploader"
                                        action="/api/question/upload"
                                        name="file"
                                        showFileList={false}
                                        onSuccess={(res, file) => this.handleAvatarScucess(res, file, 0)}
                                        beforeUpload={file => this.beforeAvatarUpload(file)}
                                    >
                                        {this.state.imageUrl01 ? <img   alt="" src={this.state.imageUrl01} style={{ width: "100%" }} className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                    </Upload>
                                </div>
                                <div className="radio-box">
                                    <Radio value="B" onChange={this.ChangeNum.bind(this, 1)} checked={this.state.form.single_select_answer === "B"} >B</Radio>
                                    <Input type="text"
                                        value={this.state.form.select_options[1].text}
                                        onChange={this.changValue.bind(this, 1)}
                                        style={{ width: "500px" }} />
                                    <Upload
                                        className="avatar-uploader"
                                        action="/api/question/upload"
                                        name="file"
                                        showFileList={false}
                                        onSuccess={(res, file) => this.handleAvatarScucess(res, file, 1)}
                                        beforeUpload={file => this.beforeAvatarUpload(file)}
                                    >
                                        {this.state.imageUrl02 ? <img   alt="" src={this.state.imageUrl02} style={{ width: "100%" }} className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                    </Upload>
                                </div>
                                <div className="radio-box">
                                    <Radio value="C" checked={this.state.form.single_select_answer === "C"} onChange={this.ChangeNum.bind(this, 2)}>C</Radio>
                                    <Input type="text"
                                        value={this.state.form.select_options[2].text}
                                        onChange={this.changValue.bind(this, 2)}
                                        style={{ width: "500px" }} />
                                    <Upload
                                        className="avatar-uploader"
                                        action="/api/question/upload"
                                        name="file"
                                        showFileList={false}
                                        onSuccess={(res, file) => this.handleAvatarScucess(res, file, 2)}
                                        beforeUpload={file => this.beforeAvatarUpload(file)}
                                    >
                                        {this.state.imageUrl03 ? <img   alt="" src={this.state.imageUrl03} style={{ width: "100%" }} /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                    </Upload>
                                </div>
                                <div className="radio-box">
                                    <Radio value="D" checked={this.state.form.single_select_answer === "D"} onChange={this.ChangeNum.bind(this, 3)}>D</Radio>
                                    <Input type="text"
                                        value={this.state.form.select_options[3].text}
                                        onChange={this.changValue.bind(this, 3)}
                                        style={{ width: "500px" }} />
                                    <Upload
                                        className="avatar-uploader"
                                        action="/api/question/upload"
                                        name="file"
                                        showFileList={false}
                                        onSuccess={(res, file) => this.handleAvatarScucess(res, file, 3)}
                                        beforeUpload={file => this.beforeAvatarUpload(file)}
                                    >
                                        {this.state.imageUrl04 ? <img   alt="" src={this.state.imageUrl04} style={{ width: "100%" }} /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                    </Upload>
                                </div>
                                {/* </Radio.Group> */}
                            </Form.Item>
                                : null
                        }
                        {/* 多选 */}
                        {
                            this.state.form.type === '2' ? <Form.Item label="多选">
                                <br /><br />
                                <div className="radio-box">
                                    <Checkbox checked={this.state.form.multiple_select_answer.includes('A')} value="A" onChange={this.fnIsCheck.bind(this, 'A')}>A</Checkbox>
                                    <Input type="text"
                                        className="inputValue"
                                        value={this.state.form.select_options[0].text}
                                        onChange={this.changValue.bind(this, 0)}
                                        style={{ width: "500px" }} />
                                    <Upload
                                        className="avatar-uploader"
                                        action="/api/question/upload"
                                        name="file"
                                        showFileList={false}
                                        onSuccess={(res, file) => this.handleAvatarScucess(res, file, 0)}
                                        beforeUpload={file => this.beforeAvatarUpload(file)}
                                    >
                                        {this.state.imageUrl01 ? <img   alt="" src={this.state.imageUrl01} style={{ width: "100%" }} className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                    </Upload>
                                </div>
                                <div className="radio-box">
                                    <Checkbox checked={this.state.form.multiple_select_answer.includes('B')} value="B" onChange={this.fnIsCheck.bind(this, 'B')}>B</Checkbox>
                                    <Input type="text"
                                        value={this.state.form.select_options[1].text}
                                        onChange={this.changValue.bind(this, 1)}
                                        className="inputValue" style={{ width: "500px" }} />
                                    <Upload
                                        className="avatar-uploader"
                                        action="/api/question/upload"
                                        name="file"
                                        showFileList={false}
                                        onSuccess={(res, file) => this.handleAvatarScucess(res, file, 1)}
                                        beforeUpload={file => this.beforeAvatarUpload(file)}
                                    >
                                        {this.state.imageUrl02 ? <img   alt="" src={this.state.imageUrl02} style={{ width: "100%" }} className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                    </Upload>
                                </div>
                                <div className="radio-box">
                                    <Checkbox value="C" checked={this.state.form.multiple_select_answer.includes('C')} onChange={this.fnIsCheck.bind(this, 'C')}>C</Checkbox>
                                    <Input type="text"
                                        value={this.state.form.select_options[2].text}
                                        onChange={this.changValue.bind(this, 2)}
                                        className="inputValue" style={{ width: "500px" }} />
                                    <Upload
                                        className="avatar-uploader"
                                        action="/api/question/upload"
                                        name="file"
                                        showFileList={false}
                                        onSuccess={(res, file) => this.handleAvatarScucess(res, file, 2)}
                                        beforeUpload={file => this.beforeAvatarUpload(file)}
                                    >
                                        {this.state.imageUrl03 ? <img   alt="" src={this.state.imageUrl03} style={{ width: "100%" }} className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                    </Upload>
                                </div>
                                <div className="radio-box">
                                    <Checkbox value="D" checked={this.state.form.multiple_select_answer.includes('D')} onChange={this.fnIsCheck.bind(this, 'D')}>D</Checkbox>
                                    <Input type="text"
                                        value={this.state.form.select_options[3].text}
                                        onChange={this.changValue.bind(this, 3)}
                                        className="inputValue" style={{ width: "500px" }} />
                                    <Upload
                                        className="avatar-uploader"
                                        action="/api/question/upload"
                                        name="file"
                                        showFileList={false}
                                        onSuccess={(res, file) => this.handleAvatarScucess(res, file, 3)}
                                        beforeUpload={file => this.beforeAvatarUpload(file)}
                                    >
                                        {this.state.imageUrl04 ? <img   alt="" src={this.state.imageUrl04} style={{ width: "100%" }} className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                    </Upload>
                                </div>
                            </Form.Item>
                                : null
                        }
                        {

                          this.state.form.type==='3'?  <Form.Item label="简单">
                                <br /><br />
                                <div id="editors" style={{ textAlign: "left" }}>
                                    <p>欢迎使用 wangEditor 富文本编辑器</p>
                                </div>
                            </Form.Item>:null

                        }


                        <Form.Item label="答案解析">
                            <Input type="text" onChange={this.onChange.bind(this, 'answer_analyze')}></Input>
                        </Form.Item>
                        <Form.Item label="答案备注">
                            <Input type="text" onChange={this.onChange.bind(this, 'remark')}></Input>
                        </Form.Item>
                        <Form.Item label="解析视频地址">
                            <br /><br />
                            <Upload
                                className="upload-demo"
                                action="/api/question/upload"
                                name="file"
                                showFileList={false}
                                onSuccess={(res, file) => this.handleChange(res, file)}
                            >
                                {this.state.Vidieo ? <video src={this.state.Vidieo} controls style={{ width: "244px", height: "176px" }} className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                            </Upload>
                        </Form.Item>

                    </Form>
                </Dialog.Body>

                <Dialog.Footer className="dialog-footer">
                    <Button onClick={() => this.setState({ dialogVisible3: false })}>取 消</Button>
                    <Button type="primary" onClick={this.sumbit.bind(this)}>确 定</Button>
                </Dialog.Footer>
            </Dialog>


        )



    }


}

export default AddQuestion;