import React, { Component } from 'react';
import { Card, Form, Input, Select, Button, Table, Pagination, Message } from 'element-react'
import './subject.css'
import { subjectList, updateSubject, deleteSubject } from '../../api/subject'
import DialogSubject from './components/dialogSubject'
import EditSubject from './components/editSubject'
class subject extends Component {
    columns = [
        {
            label: "序号",
            prop: "id",
            type: 'index',
            width: "160px",
            align: 'center'

        },
        {
            label: "学科编号",
            prop: "rid",
            align: 'center'

        },
        {
            label: "学科名称",
            prop: "name",
            align: 'center'

        },
        {
            label: "简称",
            prop: "short_name",
            align: 'center'
        },
        {
            label: "创建者",
            prop: "username",
            align: 'center'
        },
        {
            label: "状态",
            prop: "status",
            align: 'center',
            render: (state) => {
                return <span>{state.status === 0 ? '禁用' : '启用'}</span>
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
                        <Button onClick={this.fnEditSubject.bind(this, row)} plain={true} type="info" size="small">编辑</Button>
                        <Button size="small" onClick={this.fnupdateSubject.bind(this, row)} >{row.status === 0 ? '禁用' : '启用'}</Button>
                        <Button type="danger" size="small" onClick={this.fnDeleteSubject.bind(this, row)}>删除</Button>
                    </span>
                )
            }
        }
    ]
    constructor(props) {
        super(props);

        this.state = {
            form: {
                rid: '',
                name: '',
                username: "",
                status: ''
            },

            data: [],
            total: 0,
            pageSizes: [6, 8, 12, 15],
            pageSize: 6,
            currentPage: 1,
            obj: {}


        };
    }

    async fnDeleteSubject(obj) {
        const res = await deleteSubject({ id: obj.id })
        if (res.code === 200) {
            Message.success("删除成功")
            this.currentData()
        }

    }
    // 更新状态
    async fnupdateSubject(obj) {
        const res = await updateSubject({ id: obj.id })
        if (res.code === 200) {
            Message.success('状态更新成功')
            this.currentData()
        }

    }
    // 编辑学科数据
    fnEditSubject(obj) {
        this.refs.editSubject.Edit(true)
        this.setState({
            obj
        }

        )
    }
    componentDidMount() {
        this.currentData()
    }
    async currentData() {

        // let {limit:this.state.pageSize}=this.state
        let res = await subjectList(
            {
                ...this.state.form,
                limit: this.state.pageSize,
                page: this.state.currentPage
            }
        )
        if (res.code === 200) {
            this.setState({
                data: res.data.items,
                total: res.data.pagination.total,
                currentPage: +res.data.pagination.page
            })
        }
        console.log(res)
    }

    onSubmit(e) {
        e.preventDefault();

        // console.log('submit!');
    }

    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        });
    }
    fnChangeSize = (size) => {
        this.setState((state) => ({ pageSize: size }), () => {
            this.currentData()
        })
    }
    fnChangPage = (page) => {
        // console.log('page :', page);
        this.setState({ currentPage: page }, () => {
            this.currentData()

        })
    }
    fnSearch = () => {
        this.currentData()
    }
    fnClear = () => {
      
        this.setState({
            form: {},
            currentPage: 1
        }, () => { this.currentData() })

    }
    // props.re.mySubject
    fnAddSubject = () => {
        this.refs.mySubject.showIN(true)
    }


    render() {
        return (
            <div className="subject-contianer">
                <div className="card-header">
                    <Form style={{ "textAlign": "left" }}
                        inline={true} model={this.state.form} onSubmit={this.onSubmit.bind(this)} className="demo-form-inline" >
                        <Form.Item style={{ "marginBottom": 0 }} label="学科编号">
                            <Input value={this.state.form.rid} placeholder="" onChange={this.onChange.bind(this, 'rid')}></Input>
                        </Form.Item>
                        <Form.Item style={{ "marginBottom": 0 }} label="学科名称">
                            <Input value={this.state.form.name} placeholder="" onChange={this.onChange.bind(this, 'name')}></Input>
                        </Form.Item>
                        <Form.Item style={{ "marginBottom": 0 }} label="创建者">
                            <Input value={this.state.form.username} placeholder="" onChange={this.onChange.bind(this, 'username')}></Input>
                        </Form.Item>
                        <Form.Item style={{ "marginBottom": 0 }} label="状态">
                            <Select value={this.state.form.status} placeholder="请选择状态" onChange={this.onChange.bind(this, 'status')}>
                                <Select.Option label="启用" value="1" style={{ height: "30px" }}></Select.Option>
                                <Select.Option label="禁用" value="0" style={{ height: "30px" }}></Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ "marginBottom": 0 }}>
                            <Button nativeType="submit" type="primary" onClick={this.fnSearch}>查询</Button>
                            <Button nativeType="submit" type="primary" onClick={this.fnClear}>清除</Button>
                            <Button nativeType="submit" type="primary" onClick={this.fnAddSubject}>新增学科</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Card className="card-main" style={{ margin: "30px", "overflow": "visible" }}>
                    <Table
                        style={{ width: '100%' }}
                        columns={this.columns}
                        data={this.state.data}
                        border={true}
                        rowStyle={() => ({ height: "50px" })}
                        fit={true}
                        highlightCurrentRow={true}
                    // onCurrentChange={item => { console.log(item) }}
                    />
                    <br />
                    <Pagination
                        layout="total, sizes, prev, pager, next, jumper"
                        onSizeChange={this.fnChangeSize}
                        onCurrentChange={this.fnChangPage}
                        total={this.state.total}
                        pageSizes={this.state.pageSizes}
                        pageSize={this.state.pageSize}
                        currentPage={this.state.currentPage} />
                </Card>
                <DialogSubject ref="mySubject" update={() => this.currentData()} />
                <EditSubject obj={this.state.obj} ref="editSubject" updateEdit={() => this.currentData()} />
            </div>
        );
    }
}

export default subject;