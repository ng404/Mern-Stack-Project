import React,{useContext,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const NavBar =()=> {
  const {state,dispatch}=useContext(UserContext)
  const history=useHistory()
  useEffect(()=>{ 
    const M=window.M;
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems,{edge:"right"});
    });
  },[])
  const renderList=()=>{
    if(state){
    return [<li  key="home"><Link to="/">{window.innerWidth<=750?<i className="material-icons">home</i>:""}Home</Link></li>,
    <li  key="profile"><Link to="/profile">{window.innerWidth<=750?<i className="material-icons">account_circle</i>:""}Profile</Link></li>,
            <li key="post"><Link to="/createPost">{window.innerWidth<=750?<i className="material-icons">add_to_photos</i>:""}Create Post</Link></li>,
            <li  key="following"><Link to="/myFollowingPost">{window.innerWidth<=750?<i className="material-icons">monochrome_photos</i>:""}Following Post</Link></li>,
            <li  key="messages"><Link to="/messages">{window.innerWidth<=750?<i className="material-icons">message</i>:""}Messages</Link></li>,
            <li key="logout">
             <button className="btn waves-effect waves-light #d32f2f red darken-1"
            onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push("/signin")
            }}>
                LOGOUT
            </button>
          </li>]
            
          }else{

            return [<li key="signin"><Link to="/signin">Login</Link></li>,
            <li key="signup"><Link to="/signup">SignUp</Link></li>]
}
} 
return (
  <div>
  <nav  className="navbar">
  <div className="nav-wrapper white">
    
  <a href="#" data-target="slide-out" className="sidenav-trigger right" style={{marginRight:"40px"}}><i className="material-icons">menu</i></a>
<Link to={state?"/":"/signin"} className="brand-logo left"><h3>Invisible</h3></Link>
<ul className="hide-on-med-and-down right">
{renderList()}
</ul>
</div>
</nav>

<ul id="slide-out" className="sidenav">
   {renderList()}
  </ul>
  </div> 
    )
}
export default NavBar


