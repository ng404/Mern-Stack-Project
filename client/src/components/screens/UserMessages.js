import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {useHistory,Link,useParams} from 'react-router-dom'
import M from 'materialize-css'

const UserMessages=()=> {
    const history=useHistory()
    const [data,setData]=useState([])
    const [receiverProfile,setProfile]=useState(null)
    const {state,dispatch}=useContext(UserContext)
    const {id}=useParams()
    useEffect(()=>{
        fetch(`/user/${id}`,{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            setProfile(result.user)
            fetch(`/getMessage/${id}`,{
                headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")}
            }).then(res=>res.json())
            .then(result=>{
                setData(result)
            })  
        })
    },[])
    const sendMessage=(text)=>{
        const toId=receiverProfile._id
        fetch(`/sendMessage`,{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
                text,
                toId
            })
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })            
    }
    const scroll=()=>{
        window.setTimeout(function() {
            var elem = document.getElementById('main-message');
            elem.scrollTop = elem.scrollHeight;
          },1);
    }
    const deleteMessage=(id)=>{
        fetch(`/deleteMessage`,{
            method:"delete",
            headers:{
                "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
                messageId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData=data.filter(item=>{
                return item._id!==result._id
            })
            setData(newData)
        })         
    }
    const likeMessage=(id)=>{
        fetch(`/likeMessage`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
                messageId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id===result._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })         
    }
    const unlikeMessage=(id)=>{
        fetch(`/unlikeMessage`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
                messageId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id===result._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })         
    }
    return (
        <div className="card message-home-card grey">
        <Link to={receiverProfile?"/profile/"+receiverProfile._id:""}><h4 style={{marginLeft:"163px"}}>
        <img style={{width:"50px",height:"50px",borderRadius:"20px",margin:"4px"}} 
                src={receiverProfile?receiverProfile.pic:""} alt="" />
        <div style={{margin:"-54px 0px 0px 64px"}}>{receiverProfile?receiverProfile.name:""}</div></h4>
        <hr/></Link>
        <div id="main-message" className="card main-message-card"
        style={{
            maxWidth:"500px",
            height:"500px",
            overflow:"auto",
            scrollSnapAlign:"end"}}>
                {scroll()}
            {
        data.map(item=>{
            
        return (
            
            <div className="card user-message-card" key={item._id}>
                {state._id===item.sendBy._id?<div><Link to={"/profile/"+item.sendBy._id}><img style={{width:"50px",height:"50px",borderRadius:"20px",float:"right"}} 
                src={item.sendBy.pic} alt="" /></Link><div style={{float:"right",margin:"15px"}}>{item.text}</div>
                <div style={{margin:"7px 7px"}}>{new Date(item.createdAt).getUTCDate()+"-"+(new Date(item.createdAt).getMonth()+1)+"-"+new Date(item.createdAt).getFullYear()+" "+
                new Date(item.createdAt).getUTCHours()+":"+new Date(item.createdAt).getMinutes()+":"+new Date(item.createdAt).getSeconds()}</div>
                <div><i className="material-icons" style={{fontSize:"15px",margin:"14px 0px"}}
                onClick={()=>deleteMessage(item._id)}>delete</i></div>
                <div>{item.isLiked && <i className="material-icons" style={{fontSize:"15px",float:"right",margin:"-29px 52px"
                ,color:"red",cursor:"unset"}}>favorite</i>}</div></div>:<div>
                <Link to={"/profile/"+item.sendBy._id}><img style={{width:"50px",height:"50px",borderRadius:"20px"}}
                src={item.sendBy.pic} alt="" /></Link><div style={{margin:"-42px 55px"}}> {item.text}</div>
                <div style={{float:"right",margin:"8px"}}>{new Date(item.createdAt).getUTCDate()+"-"+(new Date(item.createdAt).getMonth()+1)+"-"+new Date(item.createdAt).getFullYear()+" "+
                new Date(item.createdAt).getUTCHours()+":"+new Date(item.createdAt).getMinutes()+":"+new Date(item.createdAt).getSeconds()}</div>
                <div>{item.isLiked?<i className="material-icons" style={{fontSize:"15px",float:"right",margin:"39px -113px"
                ,color:"red"}} onClick={()=>unlikeMessage(item._id)}>favorite</i>:
                <i className="material-icons" style={{fontSize:"15px",float:"right",margin:"39px -113px"
                }} onClick={()=>likeMessage(item._id)}>favorite_border</i>
                }</div></div>}
            </div>
           )
        })
    }
    </div>
    <form id="myForm1" onSubmit={(e)=>{
                         e.preventDefault()
                        sendMessage(e.target[0].value)
                        var form = document.getElementById("myForm1");
                         form.reset();
                     }}>
                     <input type="text" name="message" placeholder="Message.." style={{
                     boxSizing:"border-box",
                     border:"2px solid ",
                     margin:"-22px 0px"}}/>
                     </form>
    </div>
    )
}
export default UserMessages