import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams,useHistory,Link} from 'react-router-dom'
import M from 'materialize-css'
const UserProfile=()=> {
    const history=useHistory()
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}=useContext(UserContext)
    const {userid}=useParams()
    const [showFollow,setFollow]=useState(state?!state.following.includes(userid):true)
        useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
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
            console.log(data)
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
            setFollow(false)
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
            console.log(data)
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
            setFollow(true)
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
                    <h6>{userProfile.user.following.length} following</h6>
                    <h6>{userProfile.user.followers.length} followers</h6>
                </div>
                {showFollow?<button className="btn waves-effect waves-light #1e88e5 blue darken-1" style={{margin:"10px 90px"}}
            onClick={()=>followuser()}>
                Follow
            </button>:<button className="btn waves-effect waves-light"style={{margin:"10px 90px"}}
            onClick={()=>unfollowuser()}>
                UnFollow
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
        </>
    )
}
export default UserProfile