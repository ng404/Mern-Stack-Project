import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {useHistory,Link} from 'react-router-dom'
import M from 'materialize-css'

const Messages=()=> {
    const history=useHistory()
    const [data,setData]=useState([])
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch(`/getuserMessageList`,{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })
    },[])
    return (
        <div className="card personal-message-card grey">
            <h4 style={{marginLeft:"165px"}}>Messages</h4>
            <hr/>
                {
            data.map(item=>{
            return (
                <div key={item._id}>
                 <Link to={state._id === item.to._id?"/message/"+item.sendBy._id:"/message/"+item.to._id} >
                <div className="card message-card" style={{marginTop:"15px"}} key={item._id}>
          <img style={{width:"50px",height:"50px",borderRadius:"20px",marginBottom:"-18px"}}
                        src={state._id===item.to._id?item.sendBy.pic:item.to.pic}
                        alt=""/>
               <b> {state._id===item.to._id?item.sendBy.name:item.to.name}</b>
                <div style={{margin:"14px 54px"}}>
                   <b>{item.sendBy.name}:-</b>
                   {item.text} 
                    </div>    
                </div></Link>
                </div>
            )
            })
        }
        </div>  
    )
}
export default Messages