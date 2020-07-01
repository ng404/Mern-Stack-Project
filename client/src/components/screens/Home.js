import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {useHistory,Link} from 'react-router-dom'
import M from 'materialize-css'

const Home=()=> {
    const history=useHistory()
    const [data,setData]=useState([])
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch('/getAllPost',{
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
    return (
     <div className="home">
        {
            data.map(item=>{
                return (
                    <div className="card home-card" key={item._id}>
                    <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id:"/profile"}>{item.postedBy.name}</Link>{item.postedBy._id == state._id && <i className="material-icons" 
                            onClick={()=>{deletePost(item._id)}}  style={{float:"right"}} >delete</i>}</h5>
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
                            onClick={()=>{likePost(item._id)}} >favorite_border</i>
                        }
                <h6>{item.likes.length} likes</h6>
                     <h6>{item.title}</h6>
                     <p>{item.body}</p>
                     {
                         item.comments.map(record=>{
                             return (
                             <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
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
    )
}
export default Home