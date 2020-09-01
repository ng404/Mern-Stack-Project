import React,{useEffect,useState,useContext,useRef} from 'react'

import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Profile=()=> {
    const history=useHistory()
    const [data,setData]=useState([])
    const listModal=useRef(null)
    const [list,setList]=useState([])
    const [checker,setchecker]=useState(false)
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        M.Modal.init(listModal.current)
      },[])
    useEffect(()=>{
        fetch('/userCreatedPost',{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            if(typeof(result.posts)=="string")
            setData([])
            else{
              
            setData(result.posts)}
        })
    },[])
    const getFollowingList=()=>{
        setchecker(false)
        setList([])
        fetch('/getFollowingList',{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            setList(result.following)
        })
    }
    const getFollowersList=()=>{
        setchecker(true)
        
        setList([])
        fetch('/getFollowersList',{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            setList(result.followers)
        })
    }
    const unfollowuser=(id)=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")},
                body:JSON.stringify({
                    unfollowId:id
                })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setList(data.following)
        })
    }
    return (
        <>
    <div style={{maxWidth:"550px",margin:"80px auto"}}>
        <div style={{
            margin:"18px 0px",
            borderBottom:"1px solid grey"
        }}>
        <div style={{
            display:"flex",
            justifyContent:"space-around"
        }}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
                src={state?state.pic:"loading"}
                alt=""/> 
                           
            </div>
             
            <div>
                <h4>{state?state.name:"loading"}</h4>
                <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                    <h6>{data.length} posts</h6>
                    <h6><a href="#followingList" data-target="modal2" className="modal-trigger" onClick={()=>getFollowingList()}>{state?state.following.length:"-"} following</a></h6>
                    <h6><a href="#followersList" data-target="modal2" className="modal-trigger" onClick={()=>getFollowersList()}>{state?state.followers.length:"-"} followers</a></h6>
                </div>
                
            </div>
        </div>
        <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
           style={{margin:"10px 0px 10px 50px"}} onClick={()=>{
            history.push("/updateProfile")
          }}>
                    Update Profile
            </button> 
            </div>
        <div className="gallery">
            {
                data.map(item=>{
                    return (
                        <img key={item._id} className="item"  src={item.photo} alt=""/>
                    )
                })
            }
       
        
        </div>
        
    </div>
    <div id="modal2" className="modal" ref={listModal}>
    <div className="modal-content">
    <h6><b>{checker?"Followers":"Following"}</b></h6>
    <hr/>
            {
                list.map(item=>{
                    return (
                        <div className="card" style={{margin:"32px -20px"}} key={item._id}>
                        <div style={{
                            display:"flex",
                            justifyContent:"space-around"
                        }} key={item._id}>
                            <div style={{margin:"10px -25px"}} key={item._id}>
                                <img style={{width:"50px",height:"50px",borderRadius:"20px"}} 
                                src={item.pic}
                                alt=""/>          
                            </div>
                            <div>
                                <h6 id={item._id}>{item.name}</h6>
                            </div>
                           {checker?"":<div>
                            <button className="btn waves-effect waves-light"
                             style={{margin:"10px -33px"}} onClick={()=>unfollowuser(item._id)
                                }>
                                    UnFollow
                              </button> 
                            </div>}
                        </div>
                        </div>
                    )
                })
            } 
            
    </div>
    <div className="modal-footer"> 
      <button className="modal-close waves-effect waves-green btn-flat" >close</button>
    
    </div>
  </div>
    </>
    )
}
export default Profile