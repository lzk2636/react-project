import http from '../utils/http'
const enterpriseList = (params)=>{
    return http({
        url:"/enterprise/list",
        params
    })
}
const addEnterprise=(data)=>{
    return http({
        url:"/enterprise/add",
        method:"post",
        data
    })
}
const updateEnterprise=({id})=>{
    return http({
        url:"/enterprise/status",
        method:"post",
        data:{
            id
        }
    })
}
const deleteEnterprise =({id})=>{
    return http({
        url:"/enterprise/remove",
        method:"post",
        data:{
            id
        }
    })
}
const editEnterprise=(data)=>{
    return http({
        url:"/enterprise/edit",
        method:"post",
        data
    })
}
export{
    enterpriseList,addEnterprise,updateEnterprise,deleteEnterprise,editEnterprise
    
}