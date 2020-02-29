import http from '../utils/http'
export const userInfo = () => {
    return http({
        url: "/info"
    })
}

function userList(params) {
    return http({
        url: '/user/list',
        method: 'get',
        params
    })
}

const addUser = (data) => {
    // window.console.log(data)
    return http({
        url: "/user/add",
        method: "post",
        data
    })
}
const edituser = ( data ) => {
    return http({
        url: "/user/edit",
        method: "post",
        data
        

    })
}
const deleteuser = ({ id }) => {
    return http({
        url: "/user/remove",
        method: "post",
        data: {
            id
        }
    })
}
const updateUser=({id})=>{
    return http({
        url:"/user/status",
        method:"POST",
        data:{
            id
        }
    })
}
export {
    userList,
    addUser,
    edituser,
    deleteuser,
    updateUser
}