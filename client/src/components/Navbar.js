import React,{useContext,useEffect,useRef,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar =()=> {
  const [search,setSearch]=useState("")
  const sideModal=useRef(null)
  const searchModal=useRef(null)
  const [userData,setUserData]=useState([])
  const {state,dispatch}=useContext(UserContext)
  const history=useHistory()
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])
  useEffect(()=>{ 
   M.Sidenav.init(sideModal.current,{edge:"right"});
  },[])
  const renderList=()=>{
    if(state){
    return [
    <li key="search">{window.innerWidth<=750?<i  data-target="modal1" className="large material-icons modal-trigger" style={{
      color:"black",
      fontSize:"30px"
    }}>search</i>:<i  data-target="modal1" className="large material-icons modal-trigger" style={{
      color:"black"
    }}>search</i>}</li>,
    <li  key="home"><Link to="/" onClick={()=>
      M.Sidenav.init(sideModal.current).close()}>{window.innerWidth<=750?<i className="material-icons" >home</i>:""}Home</Link></li>,
    <li  key="profile"><Link to="/profile"  onClick={()=>
      M.Sidenav.init(sideModal.current).close()}>{window.innerWidth<=750?<i className="material-icons">account_circle</i>:""}Profile</Link></li>,
            <li key="post"><Link to="/createPost" onClick={()=>
              M.Sidenav.init(sideModal.current).close()}>{window.innerWidth<=750?<i className="material-icons" onClick={()=>
              M.Sidenav.init(sideModal.current).close()}>add_to_photos</i>:""}Create Post</Link></li>,
            <li  key="following"><Link to="/myFollowingPost" onClick={()=>
              M.Sidenav.init(sideModal.current).close()}>{window.innerWidth<=750?<i className="material-icons" >monochrome_photos</i>:""}Following Post</Link></li>,
            <li  key="messages"><Link to="/messages" onClick={()=>
              M.Sidenav.init(sideModal.current).close()}>{window.innerWidth<=750?<i className="material-icons" >message</i>:""}Messages</Link></li>,
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

const fetchUsers=(query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{"Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")},
      body:JSON.stringify({
        query
      })
  }).then(res=>res.json())
  .then(result=>{
      setUserData(result.user)  
  }) 
}
return (
  <div>
  <nav  className="navbar">
  <div className="nav-wrapper white">
  {window.innerWidth<=750 &&
  <i data-target="slide-out" className="material-icons sidenav-trigger right" style={{marginRight:"40px",color:"black"}} >menu</i>}
<Link to={state?"/":"/signin"} className="brand-logo left"><h3>Invisible</h3></Link>
<ul className="hide-on-med-and-down right">
{renderList()}
</ul>
</div>
</nav>

<ul id="slide-out" className="sidenav" ref={sideModal}>
   {renderList()}
  </ul>
  <div id="modal1" className="modal" ref={searchModal}>
    <div className="modal-content">
    <input type="email" placeholder="Search Users" value={search}
            onChange={(e)=>fetchUsers(e.target.value)}/>
            {
                userData.map(item=>{
                    return (
                      <Link to={item._id !== state._id?"/profile/"+item._id:"/profile"}
                      onClick={()=>{
                          M.Modal.getInstance(searchModal.current).close()
                    }} key={item._id}> <div className="card" style={{margin:"32px -20px"}}>
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
                      <h6 ><span>{item.name}</span></h6>
                      <h6 ><span>{item.email}</span></h6>
                            </div>
                        </div>
                        </div></Link>
                    )
                })
            } 
            
    </div>
    <div className="modal-footer"> 
      <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("")}>close</button>
    </div>
  </div>
  </div> 
    )
}
export default NavBar


