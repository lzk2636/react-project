import React, { Component, createRef } from 'react';
import { Card, Form, Input, Select, Button, Table, Pagination, Message } from 'element-react'
import { userList,updateUser,deleteuser } from '../../api/user'
import AddUSer from '../user/components/addUser'
import EditUser from '../user/components/editUser'
class user extends Component {
    columns = [
        {
            label: '序号',
            type: 'index'
        },
        {
            label: '用户名',
            prop: 'username'
        }, {
            label: '电话',
            prop: 'phone'
        },
        {
            label: '邮箱',
            prop: 'email'
        }, {
            label: '角色',
            prop: 'role_id',
            render: (row) => {
                switch (row.role_id) {
                    case 1:
                        return <span>超级管理员</span>
                        break;
                    case 2:
                        return <span>管理员</span>
                        break;
                    case 3:
                        return <span>老师</span>
                        break;
                    case 4:
                        return <span>学生</span>
                        break;
                    default:
                        break;
                }
            }
        }, {
            label: '备注',
            prop: 'remark'
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
                        <Button onClick={this.fnEditUser.bind(this, row)} plain={true} type="info" size="small">编辑</Button>
                        <Button size="small" onClick={this.fnupdateUser.bind(this, row)} >{row.status === 0 ? '禁用' : '启用'}</Button>
                        <Button type="danger" size="small" onClick={this.fnDeleteUser.bind(this, row)}>删除</Button>
                    </span>
                )
            }
        }
    ]
    constructor(props) {
        super(props)
        this.state = {
            form: {
                username: '',
                role_id: '',
                email: ''
            },
            data: [],
            total: 0,
            pageSizes: [5, 10, 15, 20],
            pageSize: 5,
            currentPage: 1,
            obj: {}
        }
        this.myRef=createRef()


    }
    onSubmit(e){
        e.preventDefault();
    }
    // 编辑用户
    async fnEditUser(row) {
        this.refs.myUser.setVisible(true)
        this.setState({
            obj:row
        })
        
    }
    // 更新用户状态
    async fnupdateUser(row) {
      const res = await  updateUser({
        id:row.id
      })
      if(res.code===200){
        Message.success("用户状态更新成功")
        this.currentData()
      }
    }
    // 删除用户
    async fnDeleteUser(row) {
        const res = await  deleteuser({
            id:row.id
          })
          if(res.code===200){
            Message.success("删除用户成功")
            this.currentData()
          }
    }
    // 表单绑定
    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        })
    }
    fnChangeSize(size) {
        this.setState({
            pageSize: size
        }, () => this.currentData())

    }
    fnChangPage(pages) {
        this.setState({
            currentPage: pages
        }, () => this.currentData())
    }

    // 初始数据
    componentDidMount() {
        this.currentData()

    }
    async currentData() {
        let res = await userList({
            limit: this.state.pageSize,
            page: this.state.currentPage,
            ...this.state.form
        })
        if (res.code === 200) {
            this.setState({
                data: res.data.items,
                total: res.data.pagination.total,
                currentPage: +res.data.pagination.page
            })
        }
    }
    // 查询列表
    fnSearch = () => {
        this.setState({
            currentPage: 1
        },()=>this.currentData())
        
    }
    fnClear=()=>{
        this.setState({
            form:{}
        },()=>this.currentData())
    }
    fnAddUser=()=>{
       this.myRef.current.setVisible(true)
    }
    render() {
        return (
            <div>
                <div className="subject-contianer">
                    <div className="card-header">
                        <Form style={{ "textAlign": "left" }}
                            onSubmit={this.onSubmit.bind(this)}
                            inline={true} model={this.state.form} className="demo-form-inline" >
                            <Form.Item style={{ "marginBottom": 0 }} label="用户名称">
                                <Input value={this.state.form.username} placeholder="" onChange={this.onChange.bind(this, 'username')}></Input>
                            </Form.Item>
                            <Form.Item style={{ "marginBottom": 0 }} label="用户邮箱">
                                <Input value={this.state.form.email} placeholder="" onChange={this.onChange.bind(this, 'email')}></Input>
                            </Form.Item>
                            <Form.Item style={{ "marginBottom": 0 }} label="角色">
                                <Select value={this.state.form.role_id} placeholder="选择角色" onChange={this.onChange.bind(this, 'role_id')}>
                                    <Select.Option label="超级管理员" value="1" style={{ height: "30px" }}></Select.Option>
                                    <Select.Option label="管理员" value="2" style={{ height: "30px" }}></Select.Option>
                                    <Select.Option label="老师" value="3" style={{ height: "30px" }}></Select.Option>
                                    <Select.Option label="学生" value="4" style={{ height: "30px" }}></Select.Option>
                                    {/* <Select.Option label="禁用" value="0" style={{ height: "30px" }}></Select.Option> */}
                                </Select>
                            </Form.Item>
                            <Form.Item style={{ "marginBottom": 0 }}>
                                <Button nativeType="submit" type="primary" onClick={this.fnSearch}>查询</Button>
                                <Button nativeType="submit" type="primary" onClick={this.fnClear}>清除</Button>
                                <Button nativeType="submit" type="primary" onClick={this.fnAddUser}>新增用户</Button>
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
                    
                    {/* <DialogSubject ref="mySubject" update={() => this.currentData()} />
                <EditSubject obj={this.state.obj} ref="editSubject" updateEdit={() => this.currentData()} /> */}
                <AddUSer ref={this.myRef} upDateUser={()=>this.currentData()}/>
                <EditUser  ref="myUser" obj={this.state.obj} upDateUser={()=>this.currentData()}/>
                </div>
            </div>
        );
    }
}

export default user;