import React, { useState,useEffect} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'
const CreatePost=()=> {
    const history=useHistory()
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    useEffect(()=>{
        if(url){
            fetch("/createPost",{
                method:"post",
                headers:{"Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
                body:JSON.stringify({
                    body,
                    url
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:data.error,classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html:"Posted Successfully",classes:"#43a047 green darken-1"})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })

        }
    },[url])
    const PostDetails=()=>{
      
        const data=new FormData()//for uploading files we use Form Data
        data.append("file",image)
        data.append("upload_preset","invisible")
        data.append("cloud_name","invisible")
        fetch("	https://api.cloudinary.com/v1_1/invisible/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)   
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="card input-field"
        style={{margin:"100px auto",maxWidth:"500px",padding:"20px",textAlign:"center"}}>
            <textarea id="textarea1" className="materialize-textarea" placeholder="body" value={body}
            onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field input-field">
             <div className="btn #2196f3 blue" style={{margin:"5px auto",height:"40px"}}>
        <span >Upload Image</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
        </div>
         </div>
         <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
         onClick={()=>PostDetails()}>
                Submit Post
            </button>
        </div>
    )
}

export default CreatePost