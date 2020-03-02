import React, { Component } from 'react';
import { Card, Form, Input, Select, Button, Table, Pagination, Message, DatePicker } from 'element-react'
// 调用接口
import { questionList ,questionStatus,questionRemove} from '../../api/question'
import { enterpriseList } from '../../api/enterprise'
import { subjectList } from '../../api/subject'
// 导入组件
import QuestionAdd from './components/addQuestion'
import QuestionEdit from './components/editQuestion'
class Question extends Component {
    columns = [
        {
            label: "序号",
            type: "index"
        }, {
            label: "标题名称",
            prop: "title",
            render: (row) => {
                return (
                    <span dangerouslySetInnerHTML={{ __html: row.title }}></span>
                )
            }
        }, {
            label: "学科id",
            prop: "subject",
            render: (row) => {
                return <span>{row.subject_name}</span>
            }
        }, {
            label: "题目类型",
            prop: "type",
            render: (row) => {
                return (
                    <span>{{ 1: "单选", 2: "多选", 3: "简答" }[row.type]}</span>
                )
            }
        }

        , {
            label: "企业",
            prop: "enterprise_name"
        }
        , {
            label: "创建者",
            prop: "username"
        }
        , {
            label: '状态',
            prop: 'status',
            render: (row) => {
                return (
                    <span>{row.status === 0 ? '禁用' : '启用'}</span>
                )
            }
        },
        {
            label: "访问量",
            prop: "reads"
        },
        {
            label: "操作",
            prop: "address",
            align: 'center',
            render: (row, column, index) => {

                // let p=state
                return (
                    <span>
                        <Button onClick={this.fnEditEnter.bind(this, row)} plain={true} type="info" size="small">编辑</Button>
                        <Button size="small" onClick={this.fnupdateEnter.bind(this, row)} >{row.status === 0 ? '禁用' : '启用'}</Button>
                        <Button type="danger" size="small" onClick={this.fnDeleteEnter.bind(this, row.id)}>删除</Button>
                    </span>
                )
            }
        }
    ]
    constructor(props) {
        super(props)
        this.state = {
            form: {
                eid: "",
                name: "",
                status: "",
                intro: ""
            },
            data: [],
            total: 0,
            pageSizes: [5, 10, 15, 20],
            pageSize: 5,
            currentPage: 1,
            subjectList: [],
            enterpriseList: [],
            obj:{}
        }

    }
    // 编辑企业
    fnEditEnter(obj) {
        console.log(obj)
        this.refs.editRefs.setVisible(true)
        this.setState({
            obj
        })
    }
    // 更新状态
    async  fnupdateEnter(obj) {
        const res = await questionStatus({ id: obj.id })
        if (res.code === 200) {
            Message.success("更新题库状态成功")
            this.currentdata()
        } else {
            Message.error(res.message)
        }
    }
    // 删除用户
    async fnDeleteEnter(id) {
        const res = await questionRemove({ id })
        if (res.code === 200) {
            Message.success("删除题库状态成功")
            this.currentdata()
        } else {
            Message.error(res.message)
        }
    }
    fnSearch = () => {
        this.setState({
            currentPage: 1
        }, () => this.currentdata())
    }
    fnClear = () => {
        this.setState({
            currentPage: 1,
            form: {}
        }, () => this.currentdata())
    }
    fnAddEnterprise = () => {
       
    }
    // 页面切换
    fnChangeSize(sizes) {
        this.setState({
            pageSize: sizes
        }, () => this.currentdata())
    }
    fnChangPage(pages) {
        this.setState({
            currentPage: pages
        }, () => this.currentdata())

    }
    componentWillMount() {
        this.currentdata()
        this.currentSubject()
        // 初始化企业列表
        this.currentEnterpriseList()
    }
    async currentEnterpriseList() {
        const res = await enterpriseList()
        if (res.code === 200) {
            this.setState({
                enterpriseList: res.data.items
            })
        }
    }
    async currentSubject() {
        const res = await subjectList()
        if (res.code === 200) {
            this.setState({
                subjectList: res.data.items
            })
        }
    }
    async currentdata() {
        const res = await questionList({
            ...this.state.form,
            limit: this.state.pageSize,
            page: this.state.currentPage
        })
        if (res.code === 200) {
            this.setState({
                data: res.data.items,
                total: res.data.pagination.total,
                currentPage: +res.data.pagination.page
            })
        }

    }
    onSubmit(e) {
        e.preventDefault()
    }
    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        })

    }
   
    render() {
        return (


            <div className="subject-contianer">
                <div className="card-header" style={{ height: "160px" }}>
                    <Form style={{ "textAlign": "left" }}
                        onSubmit={this.onSubmit.bind(this)}
                        inline={true} model={this.state.form} className="demo-form-inline" >
                        <Form.Item label="学科">
                            <Select value={this.state.form.subject} placeholder="" onChange={this.onChange.bind(this, 'subject')}>
                                {
                                    this.state.subjectList.map((item, index) => {
                                        return <Select.Option label={item.name} value={item.id} key={item.id} style={{ height: "30px" }}></Select.Option>
                                    })
                                }
                            </Select>
                            {/* <Input value={this.state.form.subject} placeholder="" onChange={this.onChange.bind(this, 'subject')}></Input> */}
                        </Form.Item>
                        <Form.Item label="阶段">
                            <Select value={this.state.form.step} placeholder="请选择阶段" onChange={this.onChange.bind(this, 'step')}>
                                <Select.Option label="初级" value="1" style={{ height: "30px" }}></Select.Option>
                                <Select.Option label="中级" value="2" style={{ height: "30px" }}></Select.Option>
                                <Select.Option label="高级" value="3" style={{ height: "30px" }}></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="企业">
                            <Select value={this.state.form.enterprise} placeholder="请选择企业" onChange={this.onChange.bind(this, 'enterprise')}>
                                {
                                    this.state.enterpriseList.map((item, i) => {
                                     return  <Select.Option label={item.name} value={item.id} key={item.id} style={{ height: "30px" }}></Select.Option>
                                    })
                                }

                            </Select>
                        </Form.Item>
                        <Form.Item label="题型">
                            <Select value={this.state.form.type} placeholder="请选择题型" onChange={this.onChange.bind(this, 'type')}>
                                <Select.Option label="单选" value="1" style={{ height: "30px" }}></Select.Option>
                                <Select.Option label="多选" value="2" style={{ height: "30px" }}></Select.Option>
                                <Select.Option label="简答" value="3" style={{ height: "30px" }}></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="难度">
                            <Select value={this.state.form.difficulty} placeholder="请选择题目难度" onChange={this.onChange.bind(this, 'difficulty')}>
                                <Select.Option label="简单" value="1" style={{ height: "30px" }}></Select.Option>
                                <Select.Option label="一般" value="2" style={{ height: "30px" }}></Select.Option>
                                <Select.Option label="困难" value="3" style={{ height: "30px" }}></Select.Option>
                            </Select>
                        </Form.Item>
                        <br />
                        <Form.Item label="作者">
                            <Input value={this.state.form.username} placeholder="" onChange={this.onChange.bind(this, 'username')}></Input>
                        </Form.Item>
                        <Form.Item label="状态">
                            <Select value={this.state.form.status} placeholder="选择状态" onChange={this.onChange.bind(this, 'status')}>
                                <Select.Option label="禁用" value="0" style={{ height: "30px" }}></Select.Option>
                                <Select.Option label="开启" value="1" style={{ height: "30px" }}></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="日期" >
                            <DatePicker
                                placeholder="选择日期"
                                onChange={date => {
                                    console.debug('DatePicker1 changed: ', date)
                                    this.setState({ form: Object.assign({}, { ['create_date']: date }) })
                                }}
                                disabledDate={time => time.getTime() < Date.now() - 8.64e7}
                            />
                            {/* <Input value={this.state.form.create_date} placeholder="" onChange={this.onChange.bind(this, 'create_date')}></Input> */}
                        </Form.Item>
                        <Form.Item label="标题" >
                            <Input value={this.state.form.title} placeholder="" onChange={this.onChange.bind(this, 'title')}></Input>
                        </Form.Item>

                        <Form.Item >
                            <Button nativeType="submit" type="primary" onClick={this.fnSearch}>查询</Button>
                            <Button nativeType="submit" type="primary" onClick={this.fnClear}>清除</Button>
                            <Button nativeType="submit" type="primary" onClick={()=> this.refs.myRefs.setVisible(true)}>新增题库</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Card className="card-main" style={{ margin: "30px", "overflow": "visible" }}>
                    <Table
                        style={{ width: '100%' }}
                        columns={this.columns}
                        data={this.state.data}
                        border={true}
                        rowStyle={() => ({ height: "30px" })}
                        fit={true}
                        highlightCurrentRow={true}
                    />
                    <br />
                    <Pagination
                        layout="total, sizes, prev, pager, next, jumper"
                        onSizeChange={this.fnChangeSize.bind(this)}
                        onCurrentChange={this.fnChangPage.bind(this)}
                        total={this.state.total}
                        pageSizes={this.state.pageSizes}
                        pageSize={this.state.pageSize}
                        currentPage={this.state.currentPage} />
                </Card>
                {/* <Add /> */}
                <QuestionAdd ref="myRefs" subjectList={this.state.subjectList} enterpriseList={this.state.enterpriseList} updateData={()=>this.currentdata()}/>

                <QuestionEdit updateData={()=>this.currentdata()} obj={this.state.obj} ref="editRefs" subjectList={this.state.subjectList} enterpriseList={this.state.enterpriseList}/>
            </div>

        );
    }
}

export default Question;