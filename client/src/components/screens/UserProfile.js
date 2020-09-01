import React,{useEffect,useState,useContext,useRef} from 'react'
import {UserContext} from '../../App'
import {useParams,useHistory,Link} from 'react-router-dom'
import M from 'materialize-css'
const UserProfile=()=> {
    const history=useHistory()
    const [userProfile,setProfile]=useState(null)
    const [list,setList]=useState([])
    const [checker,setchecker]=useState(false)
    const listModal=useRef(null)
    const {state,dispatch}=useContext(UserContext)
    const {userid}=useParams()
    useEffect(()=>{
        M.Modal.init(listModal.current)
      },[])
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            setProfile(result)
        })
    },[])
    const noExist=()=>{
        M.toast({html:"User not exit",classes:"#c62828 red darken-3"})
           history.push('/')
    }
    const followuser=()=>{

        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")},
                body:JSON.stringify({
                    followId:userid
                })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                ...prevState,
                user:{
                    ...prevState.user,
                    followers:[...prevState.user.followers,data._id]
                    }
            }
            
            })
        
        })
    }
    const unfollowuser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")},
                body:JSON.stringify({
                    unfollowId:userid
                })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!==data._id)
                return{
                ...prevState,
                user:{
                    ...prevState.user,
                    followers:newFollower
                    }
            }
            })
           
        })
    }

    const getFollowingList=()=>{
        setchecker(false)
        setList([])
        fetch(`/getUserFollowingList/${userid}`,{
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
        fetch(`/getUserFollowersList/${userid}`,{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            setList(result.followers)
        })
    }
    return (
        <>
        {userProfile ? <div>{!userProfile.error?<div style={{maxWidth:"550px",margin:"80px auto"}}>
        <div style={{
            display:"flex",
            margin:"18px 0px",
            justifyContent:"space-around",
            borderBottom:"1px solid grey"
        }}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
                src={userProfile.user.pic}
                alt=""/>                
            </div>
            <div>
                <h5>{userProfile.user.name}</h5>
                <h5>{userProfile.user.email}</h5>
                <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                    <h6>{userProfile.posts.length} posts</h6>
                   {state && state.following.includes(userid)?
                   <h6><a href="#followingList" data-target="modal3" className="modal-trigger" onClick={()=>getFollowingList()}>{userProfile.user.following.length} following</a></h6>
                    :<h6>{userProfile.user.following.length} following</h6>}
                     {state && state.following.includes(userid)?
                   <h6><a href="#followersList" data-target="modal3" className="modal-trigger" onClick={()=>getFollowersList()}>{userProfile.user.followers.length} followers</a></h6>
                    :<h6>{userProfile.user.followers.length} followers</h6>}
                </div>
                {state && state.following.includes(userid)?<button className="btn waves-effect waves-light"style={{margin:"10px 90px"}}
            onClick={()=>unfollowuser()}>
                UnFollow
            </button>
                :<button className="btn waves-effect waves-light #1e88e5 blue darken-1" style={{margin:"10px 90px"}}
            onClick={()=>followuser()}>
                Follow
            </button>}
            <Link to={"/message/"+userid}><button className="btn waves-effect waves-light #e0e0e0 grey lighten-2" style={{marginLeft:"-47px",color:"black"}}>
                Message
            </button></Link>
            </div>
        </div>
        
        <div className="gallery">
            {
                userProfile.posts.map(item=>{
                    return (
                        <img key={item._id} className="item"  src={item.photo} alt=""/>
                    )
                })
            }
       
        
        </div>
        </div>:noExist() }</div>: <h2>loading...</h2>}

        <div id="modal3" className="modal" ref={listModal}>
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
export default UserProfile