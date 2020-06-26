import React,{useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../App'
const NavBar =()=> {

  const {state,dispatch}=useContext(UserContext)
  const renderList=()=>{
    if(state){
    return [<li><Link to="/profile">Profile</Link></li>,
            <li><Link to="/createPost">Create Post</Link></li>]
          }else{
            return [<li><Link to="/signin">Login</Link></li>,
            <li><Link to="/signup">SignUp</Link></li>]
}
}    
return (
        <nav>
        <div className="nav-wrapper white">

          <Link to="/" className="brand-logo left"><h3>Invisible</h3></Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
           {renderList()}
          </ul>
        </div>
      </nav>
    )
}
export default NavBar


