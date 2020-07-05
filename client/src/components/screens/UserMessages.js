import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {useHistory,Link,useParams} from 'react-router-dom'
import M from 'materialize-css'

const UserMessages=()=> {
    const history=useHistory()
    const [data,setData]=useState([])
    const [id1,setId1]=useState("")
    const [id2,setId2]=useState("")
    const [name1,setName1]=useState("")
    const [name2,setName2]=useState("")
    const [pic1,setPic1]=useState("")
    const [pic2,setPic2]=useState("")
    const {state,dispatch}=useContext(UserContext)
    const {id}=useParams()
    useEffect(()=>{
        fetch(`/getMessage/${id}`,{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            setId1(result[0].to._id)
            setName1(result[0].to.name)
            setId2(result[0].sendBy._id)
            setName2(result[0].sendBy.name)
            setPic2(result[0].sendBy.pic)
            setPic1(result[0].to.pic)
            setData(result)
        })
    },[])
    const sendMessage=(text)=>{
        const toId=(state._id===id1?id2:id1)
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
            console.log(result)
            setData(result)
        })            
    }
    const scroll=()=>{
        window.setTimeout(function() {
            var elem = document.getElementById('main-message');
            elem.scrollTop = elem.scrollHeight;
          },1);
    }
    return (
        <div className="card message-home-card grey">
        <Link to={state?state._id===id1?"/profile/"+id2:"/profile/"+id1:""}><h4 style={{marginLeft:"163px"}}>
        <img style={{width:"50px",height:"50px",borderRadius:"20px",margin:"4px"}} 
                src={state?state._id===id1?pic2:pic1:""} alt="" />
        <div style={{margin:"-54px 0px 0px 64px"}}>{state?state._id===id1?name2:name1:""}</div></h4>
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
                <div><i className="material-icons">delete</i></div></div>:<div>
                <Link to={"/profile/"+item.sendBy._id}><img style={{width:"50px",height:"50px",borderRadius:"20px"}}
                src={item.sendBy.pic} alt="" /></Link><div style={{margin:"-42px 55px"}}> {item.text}</div>
                <div style={{float:"right",margin:"8px"}}>{new Date(item.createdAt).getUTCDate()+"-"+(new Date(item.createdAt).getMonth()+1)+"-"+new Date(item.createdAt).getFullYear()+" "+
                new Date(item.createdAt).getUTCHours()+":"+new Date(item.createdAt).getMinutes()+":"+new Date(item.createdAt).getSeconds()}</div></div>}
            </div>
           )
        })
    }
    </div>
    <form onSubmit={(e)=>{
                         e.preventDefault()
                        sendMessage(e.target[0].value)
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