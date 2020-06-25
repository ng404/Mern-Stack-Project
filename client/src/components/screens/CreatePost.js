import React from 'react'

const CreatePost=()=> {
    return (
        <div className="card input-field"
        style={{margin:"60px auto",maxWidth:"500px",padding:"20px",textAlign:"center"}}>
            <input type="text" placeholder="title"/>
            <textarea id="textarea1" className="materialize-textarea" placeholder="body"/>
            <div className="file-field input-field">
             <div className="btn #2196f3 blue" style={{margin:"5px auto",height:"40px"}}>
        <span >Upload Image</span>
        <input type="file" />
        </div>
        <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
        </div>
         </div>
         <button className="btn waves-effect waves-light #1e88e5 blue darken-1   ">
                Submit Post
            </button>
        </div>
    )
}

export default CreatePost