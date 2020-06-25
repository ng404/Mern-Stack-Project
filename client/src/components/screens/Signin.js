import React from 'react'
import {Link} from 'react-router-dom'
const Signin=()=> {
    return (
     <div className="mycard">
        <div className="card auth-card input-field">
            <h2>Invisible</h2>
            <input type="text" placeholder="email"/>
            <input type="text" placeholder="password"/>
            <button className="btn waves-effect waves-light #1e88e5 blue darken-1   ">
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