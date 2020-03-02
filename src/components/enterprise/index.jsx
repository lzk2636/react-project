import React, { Component } from 'react';
import { Card, Form, Input, Select, Button, Table, Pagination, Message } from 'element-react'
// 调用接口
import { enterpriseList, updateEnterprise, deleteEnterprise } from '../../api/enterprise'
import AddEnterprise from './components/addEnterprise'
import EditEnterprise from './components/editEnterprise'
class Enterprise extends Component {
    columns = [
        {
            label: "序号",
            type: "index"
        }, {
            label: "企业编号",
            prop: "eid"
        }, {
            label: "企业名称",
            prop: "name"
        }, {
            label: "创建者",
            prop: "username"
        }

        , {
            label: "简称",
            prop: "intro"
        }, {
            label: '状态',
            prop: 'status',
            render: (row) => {
                return (
                    <span>{row.status === 0 ? '禁用' : '启用'}</span>
                )
            }
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
        }

    }
    // 编辑企业
    fnEditEnter(obj) {
        this.refs.editRefs.setValue(true)
        this.setState({
            obj
        })
    }
    // 更新状态
    async  fnupdateEnter(obj) {
        const res = await updateEnterprise({ id: obj.id })
        if (res.code === 200) {
            Message.success("更新企业状态成功")
            this.currentdata()
        } else {
            Message.error(res.message)
        }
    }
    // 删除用户
    async fnDeleteEnter(id) {
        const res = await deleteEnterprise({ id })
        if (res.code === 200) {
            Message.success("删除企业状态成功")
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
        this.refs.myRefs.setValue(true)
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
    }
    async currentdata() {
        const res = await enterpriseList({
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
                    <div className="card-header">
                        <Form style={{ "textAlign": "left" }}
                            onSubmit={this.onSubmit.bind(this)}
                            inline={true} model={this.state.form} className="demo-form-inline" >
                            <Form.Item style={{ "marginBottom": 0 }} label="企业编号">
                                <Input value={this.state.form.eid} placeholder="" onChange={this.onChange.bind(this, 'eid')}></Input>
                            </Form.Item>
                            <Form.Item style={{ "marginBottom": 0 }} label="企业名称">
                                <Input value={this.state.form.name} placeholder="" onChange={this.onChange.bind(this, 'name')}></Input>
                            </Form.Item>
                            <Form.Item style={{ "marginBottom": 0 }}>
                                <Select value={this.state.form.status} placeholder="选择状态" onChange={this.onChange.bind(this, 'status')}>
                                    <Select.Option label="禁用" value="0" style={{ height: "30px" }}></Select.Option>
                                    <Select.Option label="开启" value="1" style={{ height: "30px" }}></Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item style={{ "marginBottom": 0 }}>
                                <Button nativeType="submit" type="primary" onClick={this.fnSearch}>查询</Button>
                                <Button nativeType="submit" type="primary" onClick={this.fnClear}>清除</Button>
                                <Button nativeType="submit" type="primary" onClick={this.fnAddEnterprise}>新增题库</Button>
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
                        // onCurrentChange={item => { console.log(item) }}
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
                    <AddEnterprise ref="myRefs" addEnterprise={()=>this.currentdata()}/>
                    <EditEnterprise ref="editRefs" obj={this.state.obj} addEnterprise={()=>this.currentdata()}/>
                </div>
            
        );
    }
}

export default Enterprise;