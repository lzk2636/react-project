import http from '../utils/http'
const subjectList=(params)=>{
    return http({
        url:"/subject/list",
        params
    })
}
const addSubject=(data)=>{
    return http({
        url:"/subject/add",
        method:"post",
        data
    })
}
const editSubject=(data)=>{
    return http({
        url:"/subject/edit",
        method:"post",
        data
    })
}
const updateSubject=({id})=>{
    return http({
        url:"/subject/status",
        method:"post",
        data:{
            id
        }
    })
}
const deleteSubject =({id})=>{
    return http({
        url:"/subject/remove",
        method:"post",
        data:{
            id
        }
    })
}
export{
    subjectList,
    addSubject,
    editSubject,
    updateSubject,
    deleteSubject
}