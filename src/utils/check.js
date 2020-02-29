let regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
const checkedEmail = (rule, value, callback) => {
    if(regEmail.test(value)){
       callback()
    }else{
        callback(new Error("你的邮箱不符合"))
    }

}
export{
    checkedEmail
}