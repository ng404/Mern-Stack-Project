import React,{useState,useEffect,useContext,useRef} from 'react'
import {UserContext} from '../../App'
import {useHistory,Link} from 'react-router-dom'
import M from 'materialize-css'

const SubscribeUserPost=()=> {
    const history=useHistory()
    const [data,setData]=useState([])
    
    const [likeList,setLikeList]=useState([])
    const commentModal=useRef(null)
    const likeModal=useRef(null)
    const [comments,setComments]=useState([])
    const [postId,setPostId]=useState("")
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        M.Modal.init(commentModal.current)
        M.Modal.init(likeModal.current)
      },[])
    useEffect(()=>{
        fetch('/getSubscribePost',{
            method:"get",
            headers:{"Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
        }).then(res=>res.json())
        .then(result=>{
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
                            onClick={()=>{deletePost(item._id)}}  style={{float:"right"}} >delete</i>}</h5>
                   <div className="card-image"> {/* the css is defined in  materialize for card-image*/}
                        <img src={item.photo}
                        alt="" onDoubleClick={()=>{likePost(item._id)}}/>
                    </div>
                    <div className="card-content">
                        {
                            item.likes.find(item=>item._id===state._id)
                            ?<i className="material-icons" 
                            onClick={()=>{unlikePost(item._id)}}  style={{color:"red"}} >favorite</i>
                            :<i className="material-icons"
                            onClick={()=>{likePost(item._id)}}>favorite_border</i>
                        }
                 <a href="#likeList" data-target="modal4" className="modal-trigger" onClick={()=>{setLikeList(item.likes)
                }}><h6>{item.likes.length} likes</h6></a>
                <div><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id:"/profile"}>
                     <span style={{fontWeight:"500",fontSize:"20px"}}>{item.postedBy.name}</span></Link> <span>{item.body}</span></div>
            <a href="#CommentList"data-target="modal2" className="modal-trigger" onClick={()=>{setComments(item.comments)
                setPostId(item._id)}}>{item.comments.length>2 && <h6>View all {item.comments.length} comments</h6>}</a>
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
                     <form id="myForm" onSubmit={(e)=>{
                         e.preventDefault()
                         addComment(item._id,e.target[0].value)
                         var form = document.getElementById("myForm");
                         form.reset();
                     }}>
                     <input type="text" placeholder="add a comment"/>
                     </form>
                    </div>
                 </div>  
                )
            })
        }
          
     </div>
     <div id="modal4" className="modal" ref={likeModal}>
    <div className="modal-content">
    <h6><b>Likes</b></h6>
    <hr/>
    {
                likeList.map(item=>{
                    return (
                        <Link to={item._id !== state._id?"/profile/"+item._id:"/profile"}
                                    onClick={()=>{
                                        M.Modal.getInstance(likeModal.current).close()
                                  }}>
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
                        </Link>
                    )
                })
            } 
    </div>
    <div className="modal-footer"> 
      <button className="modal-close waves-effect waves-green btn-flat" >close</button>
    
    </div>
  </div>
     <div id="modal2" className="modal" ref={commentModal}>
    <div className="modal-content">
    <h6><b>Comments</b><i className="material-icons" style={{float:"right"}} onClick={()=>{
          M.Modal.getInstance(commentModal.current).close()
    }}>close</i></h6>
                <hr/>
                <div id="main-message" className="card main-message-card"
        style={{
            maxWidth:"107%",
            height:"262px",
            margin:"14px -19px",
            overflow:"auto",
            scrollSnapAlign:"end"}}>
            {
                         comments.slice(0).reverse().
                         map(record=>{
                             return (
                                 <div key={record._id}>
                                    <Link to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id:"/profile"}
                                    onClick={()=>{
                                        M.Modal.getInstance(commentModal.current).close()
                                  }}> <img style={{width:"50px",height:"50px",borderRadius:"20px"}}
                             src={record.postedBy.pic} alt="" /></Link>
                             <div style={{marginTop:"-48px",marginLeft:"61px",padding:"7px"}}><h6 key={record._id}>
                             <Link to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id:"/profile"}
                             onClick={()=>{
                                M.Modal.getInstance(commentModal.current).close()
                          }}>
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
                                 <hr style={{margin:"14px"}}/>
                                 </div>
                             )
                         })
         }
       
    </div>  
    <form id="myForm1" onSubmit={(e)=>{
                         e.preventDefault()
                         addComment(postId,e.target[0].value)
                         var form = document.getElementById("myForm1");
                         form.reset();
                     }}>
                     <input type="text" name="message" placeholder="Comment.." style={{
                     boxSizing:"border-box",
                     border:"2px solid ",
                     margin:"-20px",
                     width:"106%",
                     height:"31px"}}/>
                     </form>      
    </div>
  </div>

     </>
    )
}
export default SubscribeUserPost