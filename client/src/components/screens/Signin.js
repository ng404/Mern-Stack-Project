import React,{useState,useContext} from 'react'
import {UserContext} from '../../App'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Signin=()=> {
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const userSignIn=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        {
            M.toast({html:"Invalid Email !!",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Signed in Success",classes:"#43a047 green darken-1"})

                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
     <div className="mycard">
        <div className="card auth-card input-field">
            <h2>Invisible</h2>
            <input type="email" placeholder="email" value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="password"value={password}
            onChange={(e)=>setPassword(e.target.value)}/>
            <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
            onClick={()=>userSignIn()}>
                Login
            </button>
            <h6>
            <Link to="/signup">Don't have an account?<b style={{color:"blue"}}> Sign up.</b></Link>
            </h6>
        </div>
     </div>
    )
}
export default Signin