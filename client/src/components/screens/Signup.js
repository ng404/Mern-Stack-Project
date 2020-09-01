import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Signup=()=> {
    const history=useHistory()
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [cpassword,setConfirmPassword]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
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
        if(password!=cpassword){
            M.toast({html:"password and confirm password did not match !!",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const userSignUp=()=>{
        if(image){
            uploadPic()
        }
        else{
         setUrl("https://res.cloudinary.com/invisible/image/upload/v1595580742/invisibleUser_image_vbao0y.png")
        } 
    }
    return (
     <div className="mycard">
        <div className="card auth-card input-field">
            <h2>Invisible</h2>
            <input type="text" placeholder="username" value={name}
            onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="email" value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="password"value={password}
            onChange={(e)=>setPassword(e.target.value)}/>
            <input type="password" placeholder="Confirm Password"value={cpassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}/>
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
            onClick={()=>userSignUp()}>
                Signup
            </button>
            <h6>
                <Link to="/signin">Already have an account? <b style={{color:"blue"}}>Sign in.</b></Link>
            </h6>
        </div>
     </div>
    )
}
export default Signup