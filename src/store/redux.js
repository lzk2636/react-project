const oDetfaultState = {
    userInfo:{}
}

const redux=(state=oDetfaultState,action)=>{
    if(action.type==='token'){
        state.userInfo=action.value
        console.log('state :', state);
        return state
    }
    return state

}
export default redux