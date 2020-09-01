export const initialState=null

export const reducer =(state,action)=>{
    let response=action.payload
    if(action.type=="USER"){
        return {
            ...state,
            ...response
        }
    }
    if(action.type=="CLEAR"){
        return null
    }
    if(action.type=="UPDATE"){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type=="UPDATEPROFILE"){
        return{
            ...state,
            name:action.payload.name,
            email:action.payload.email,
            pic:action.payload.pic
        }
    }
    return state
} 