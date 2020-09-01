import React,{useState,useEffect,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const UpdateProfile=()=> {
    const history=useHistory()
    
    const [image,setImage]=useState("")
    const [url,setUrl]=useState(undefined)
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        if(url)
        {
            uploadFields()
        }
    },[url])
    const uploadPic=()=>{
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
    const uploadFields=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        {
            M.toast({html:"Invalid Email !!",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/updateProfile",{
            method:"put",
            headers:{"Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
                name,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:"updated Successfully",classes:"#43a047 green darken-1"})
                dispatch({type:"UPDATEPROFILE",payload:{name:data.name,email:data.email,pic:data.pic}})
                localStorage.setItem("user",JSON.stringify(data))
                history.push('/profile')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const editProfile=(a,b)=>{
        if(name==""){
        setName(state?state.name:"")
        }
        if(email==""){
            setEmail(state?state.email:"")
        }
        
        if(image){
            uploadPic()
        }
        else{ 
            setUrl(state?state.pic:"")
        } 
    }
    return (
        <div>
        {state?<div className="mycard">
        <div className="card auth-card input-field">
            <h2>Invisible</h2>
            <input type="text" placeholder="username" defaultValue={state?state.name:""}
            onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="email" defaultValue={state?state.email:""}
            onChange={(e)=>setEmail(e.target.value)}/>
            <div className="file-field input-field">
             <div className="btn #2196f3 blue" style={{margin:"5px auto",height:"40px"}}>
            <span >Upload pic</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="not compulsory"/>
            </div>
            </div>
            <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
            onClick={()=>editProfile(state?state.name:"",state?state.email:"")}>
                Edit
            </button>
        </div>
     </div>:"loading..."}
     </div>
     
    )
}
export default UpdateProfile