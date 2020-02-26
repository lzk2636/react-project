import http from '../utils/http'
const login=(data)=>{
    return http({
        url:'/login',
        method:"POST",
        data
    })
}
const sendsms=(data)=>{
    return http({
        url:"/sendsms",
        method:"POST",
        data
    })
}
export{
    login,
    sendsms
}