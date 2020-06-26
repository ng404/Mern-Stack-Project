const express =require('express')
const router =express.Router()
const mongoose=require('mongoose')
const User=mongoose.model('User')
const Post=mongoose.model("Post")
const requireLogin=require('../middleware/requireLogin')

router.post('/createPost',requireLogin,(req,res)=>{
    const {title,body,url}=req.body
    if(!title || !body || !url){
        return res.status(422).json({error:"please add all the fields.."})
    }
    req.user.password=undefined
    req.user.__v=undefined
    const post =new Post({
        title,
        body,
        photo:url,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/getAllPost',(req,res)=>{
 Post.find()
 .populate("postedBy","_id name")
 .then(posts=>{
     res.json({posts})
 })
 .catch(err=>{
     console.log(err)
 })
})

router.get('/userCreatedPost',requireLogin,(req,res)=>{
  Post.find({postedBy:req.user._id})
  .populate("postedBy","_id name")
  .then(posts=>{
      if(posts.length==0){
          return res.json({posts:"No Posts has been created yet!!!"})
      }
      res.json({posts})
  })
  .catch(err=>{
      console.log(err)
  })  
})


module.exports =router