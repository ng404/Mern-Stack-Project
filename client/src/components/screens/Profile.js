import React,{useEffect,useState,useContext} from 'react'
import Modal from 'react-modal'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'

Modal.setAppElement('#root')
const Profile=()=> {
    const history=useHistory()
    const [data,setData]=useState([])
    const [modalIsOpen,setmodalIsOpen]=useState(false)
    const [list,setList]=useState([])
    const [checker,setchecker]=useState(false)
    const [unFollowList,setUnFollowList]=useState([])
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch('/userCreatedPost',{
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            if(typeof(result.posts)=="string")
            setData([])
            else
            setData(result.posts)
        })
    },[])
    const getFollowingList=()=>{
        setchecker(false)
        setmodalIsOpen(true)
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
        setmodalIsOpen(true)
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
            console.log(data)
            console.log(list)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setUnFollowList(data)
            setList(data.following)
        })
    }

    return (
        <>
        <Modal isOpen={modalIsOpen}  onRequestClose={()=>setmodalIsOpen(false)} style={{
            content: {
                position: 'absolute',
                top: '310px',
                left: '500px',
                right: '500px',
                bottom: '100px',
                border: '2px solid black',
                background: '#fff',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '4px',
                outline: 'none',
                padding: '20px'
              }
        }}>
            <div style={{
            position:"fixed",
            width:"31%",
            margin:"-19px -12px",
            borderBottom:"1px solid grey",
            zIndex:"1"}} className="card">
            <h6 style={{marginLeft:"163px"}}><b>{checker?"Followers":"Following"}</b><a onClick={()=>setmodalIsOpen(false)} style={{float:"right"}}>
                <i className="material-icons">close</i></a></h6>
            </div>
            <div className="card" style={{margin:"32px -20px"}}>
            {
                list.map(item=>{
                    return (
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
                            <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
                             style={{margin:"10px -33px",background:"white"}} onClick={()=>unfollowuser(item._id)
                                }>
                                    Following
                              </button> 
                            </div>}
                        </div>
                    )
                })
            } 
            </div>
        </Modal>
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
                    <h6><a href="#followingList" onClick={()=>getFollowingList()}>{state?state.following.length:"-"} following</a></h6>
                    <h6><a href="#followersList" onClick={()=>getFollowersList()}>{state?state.followers.length:"-"} followers</a></h6>
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
   
    </>
    )
}
export default Profile