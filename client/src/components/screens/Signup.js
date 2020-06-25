import React from 'react'
import {Link} from 'react-router-dom'
const Signup=()=> {
    return (
     <div className="mycard">
        <div className="card auth-card input-field">
            <h2>Invisible</h2>
            <input type="text" placeholder="username"/>
            <input type="text" placeholder="email"/>
            <input type="text" placeholder="password"/>
            <button className="btn waves-effect waves-light #1e88e5 blue darken-1   ">
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