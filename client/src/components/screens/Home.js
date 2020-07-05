import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import Modal from 'react-modal'
import {useHistory,Link} from 'react-router-dom'
import M from 'materialize-css'

const Home=()=> {
    const history=useHistory()
    const [data,setData]=useState([])
    const [modalIsOpen,setmodalIsOpen]=useState(false)
    const [comments,setComments]=useState([])
    const [postId,setPostId]=useState("")
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch('/getAllPost',{
            method:"get",
            headers:{"Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
        }).then(res=>res.json())
        .then(result=>{
            console.log(result.posts)
            setData(result.posts)
            
        }) 
    },[])
    const deletePost = (postId)=>{
        fetch(`/deletePost/${postId}`,{
            method:"delete",
            headers:{"Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")}
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData=data.filter(item=>{
                return item._id!==result._id
            })
            M.toast({html:"Successfully deleted",classes:"#43a047 green darken-1"})
            setData(newData)
        })
    }
    const addComment=(postId,comment)=>{
         fetch('commentPost',{
             method:"put",
             headers:{"Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem("jwt")},
                   body:JSON.stringify({
                 comment,
                 postId
             })
         }).then(res=>res.json())
         .then(result=>{
             console.log(result)
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
            var __FOUND = newData.find(function(post, index) {
                if(post._id == postId)
                    return true;
            });
            setComments(__FOUND.comments)
         }).catch(err=>{
             console.log(err)
         })
        
    }      
    const likePost=(id)=>{
            fetch('/likePost',{
                method:"put",
                headers:{"Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")},
                body:JSON.stringify({
                    postId:id
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
                console.log(newData)
                setData(newData)
            }).catch(err=>{
                console.log(err)
            })
    }
    const unlikePost=(id)=>{
        fetch('/unlikePost',{
            method:"put",
            headers:{"Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
                postId:id
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
            console.log(newData)
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const likeComment=(commentId,id)=>{
        fetch('/likeComment',{
            method:"put",
            headers:{"Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
                commentId,
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
            result.posts.map(item=>{
                    if(item._id.toString()===id){
                        setComments(item.comments)
                    }
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    const unlikeComment=(commentId,id)=>{
    fetch('/unlikeComment',{
        method:"put",
        headers:{"Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")},
        body:JSON.stringify({
            commentId,
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        setData(result.posts)
        result.posts.map(item=>{
                if(item._id.toString()===id){
                    setComments(item.comments)
                }
         })
    }).catch(err=>{
        console.log(err)
    })
    }
    const deleteComment = (record,id)=>{
        fetch(`/deleteComment`,{
            method:"delete",
            headers:{"Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
                record,
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
            result.posts.map(item=>{
                    if(item._id.toString()===id){
                        setComments(item.comments)
                    }
             })
        })
    }
    return (
        <>
         <Modal isOpen={modalIsOpen}  onRequestClose={()=>setmodalIsOpen(false)} style={{
            content: {
                position: 'absolute',
                top: '200px',
                left: '500px',
                right: '500px',
                bottom: '75px',
                border: '2px solid black',
                background: '#fff'
              }
        }}>
            <div style={{margin:"-15px -11px"}}><h6><b>Comments</b><a onClick={()=>setmodalIsOpen(false)}>
                <i className="material-icons" style={{float:"right"}}>close</i></a></h6>
                <hr/>
                </div>
                <div id="main-message" className="card main-message-card"
        style={{
            maxWidth:"456px",
            height:"381px",
            margin:"14px -19px",
            overflow:"auto",
            scrollSnapAlign:"end"}}>
            {
                         comments.slice(0).reverse().
                         map(record=>{
                             return (
                                 <div key={record._id}>
                                    <Link to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id:"/profile"}> <img style={{width:"50px",height:"50px",borderRadius:"20px"}}
                             src={record.postedBy.pic} alt="" /></Link>
                             <div style={{marginTop:"-48px",marginLeft:"61px",padding:"7px"}}><h6 key={record._id}>
                             <Link to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id:"/profile"}>
                                  <span style={{fontWeight:"500"}}>{record.postedBy.name}</span></Link> {record.text}
                                 <span style={{float:"right"}}>
                                 {
                            record.commentLikes.includes(state._id)
                            ?<i className="material-icons" 
                            onClick={()=>unlikeComment(record._id,postId)} style={{color:"red"}} >favorite</i>
                            :<i className="material-icons"
                            onClick={()=>likeComment(record._id,postId)}>favorite_border</i>
                        }</span></h6>
                                 <div>
                    <span style={{float:"left"}}>{record.commentLikes.length} likes</span> 
                    <span style={{float:"left",margin:"-3px 30px"}}>{record.postedBy._id===state._id &&<i className="material-icons" 
                    onClick={()=>deleteComment(record,postId)}     >delete</i>}</span>
                      <span style={{float:"right"}}>{new Date(record.createdAt).getUTCDate()+"-"+(new Date(record.createdAt).getMonth()+1)+"-"+new Date(record.createdAt).getFullYear()+" "+
                                 new Date(record.createdAt).getUTCHours()+":"+new Date(record.createdAt).getMinutes()+":"+new Date(record.createdAt).getSeconds()}</span>
                                    </div>
                                 </div>
                                 <hr style={{margin:"14px -2px"}}/>
                                 </div>
                             )
                         })
         }
       
    </div>
    <form onSubmit={(e)=>{
                         e.preventDefault()
                         addComment(postId,e.target[0].value)
                     }}>
                     <input type="text" name="message" placeholder="Message.." style={{
                     boxSizing:"border-box",
                     border:"2px solid ",
                     margin:"-20px",
                     width:"110%",
                     height:"30px"}}/>
                     </form>     
        </Modal>
     <div className="home">
        {
            data.map(item=>{
                return (
                    <div className="card home-card" key={item._id}>
                    <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id:"/profile"}>
                    <img style={{width:"50px",height:"50px",borderRadius:"15px",margin:"0px 0px -12px"}}
                             src={item.postedBy.pic} alt="" />{item.postedBy.name}</Link>
                 {item.postedBy._id!==state._id && <Link to={"/message/"+item.postedBy._id}> <i className="material-icons" 
                              style={{float:"right"}}>message</i>
                </Link>}
              {item.postedBy._id == state._id && <i className="material-icons" 
                            onClick={()=>{deletePost(item._id)}}  style={{float:"right"}} >delete</i>
                            }</h5>
                   <div className="card-image"> {/* the css is defined in  materialize for card-image*/}
                        <img src={item.photo}
                        alt="" onDoubleClick={()=>{likePost(item._id)}}/>
                    </div>
                    <div className="card-content">
                        {
                            item.likes.includes(state._id)
                            ?<i className="material-icons" 
                            onClick={()=>{unlikePost(item._id)}}  style={{color:"red"}} >favorite</i>
                            :<i className="material-icons"
                            onClick={()=>{likePost(item._id)}}>favorite_border</i>
                        }
                <h6>{item.likes.length} likes</h6>
                <div><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id:"/profile"}>
                     <span style={{fontWeight:"500",fontSize:"20px"}}>{item.postedBy.name}</span></Link> <span>{item.body}</span></div>
            <a href="#CommentList" onClick={()=>{setComments(item.comments)
                setPostId(item._id)
                setmodalIsOpen(true)}}>{item.comments.length>2 && <h6>View all {item.comments.length} comments</h6>}</a>
                     {
                         item.comments.slice(0).reverse().slice(0,2).
                         map(record=>{
                             return (
                             <h6 key={record._id}>
                                 <Link to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id:"/profile"}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span></Link> {record.text}
                             <span style={{float:"right"}}>
                                 {
                            record.commentLikes.includes(state._id)
                            ?<i className="material-icons" 
                            onClick={()=>unlikeComment(record._id,postId)} style={{color:"red"}} >favorite</i>
                            :<i className="material-icons"
                            onClick={()=>likeComment(record._id,postId)}>favorite_border</i>
                        }</span></h6>
                             )
                         })
                     }
                     <form onSubmit={(e)=>{
                         e.preventDefault()
                         addComment(item._id,e.target[0].value)
                     }}>
                     <input type="text" placeholder="add a comment" />
                     </form>
                    </div>
                 </div>  
                )
            })
        }
          
     </div>
     </>
    )
}
export default Home