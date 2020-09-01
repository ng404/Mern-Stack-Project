const express =require('express')
const router =express.Router()
const mongoose=require('mongoose')
const Post=mongoose.model("Post")
const requireLogin=require('../middleware/requireLogin')

router.post('/createPost',requireLogin,(req,res)=>{
    const {body,url}=req.body
    if(!body || !url){
        return res.status(422).json({error:"please add all the fields.."})
    }
    req.user.password=undefined
    req.user.__v=undefined
    const post =new Post({
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
router.get('/getAllPost',requireLogin,(req,res)=>{
 Post.find()
 .populate("postedBy","_id name pic")
 .populate("comments.postedBy","_id name pic")
 .populate("likes","_id name pic")
 .sort("-createdAt")
 .then(posts=>{
     res.json({posts})
 })
 .catch(err=>{
     console.log(err)
 })
})
router.get('/userCreatedPost',requireLogin,(req,res)=>{
  Post.find({postedBy:req.user._id})
  .populate("postedBy","_id name pic")
  .populate("comments.postedBy","_id name pic")
  .populate("likes","_id name pic")
  .sort("-createdAt")
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
router.put('/likePost',requireLogin,(req,res)=>{
    Post.findOne({_id:req.body.postId,likes:req.user._id})
    .populate("comments.postedBy","_id name pic")
    .populate("likes","_id name pic")
    .populate("postedBy","_id name pic")
    .then((savedPost)=>{
        if(savedPost){
            return res.json(savedPost)
        }
        else{
            Post.findByIdAndUpdate(req.body.postId,{$push:{likes:req.user._id}},{new:true})
            .populate("comments.postedBy","_id name pic")
            .populate("likes","_id name pic")
            .populate("postedBy","_id name pic")
                .exec((err,result)=>{
                    if(err){
                        return res.status(422).json({error:err})
                    }
                    else{
                        res.json(result)
                    }
                })
        }
    })
    
})
router.put('/unlikePost',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.user._id}},{new:true}
        ).populate("postedBy","_id name pic")
        .populate("likes","_id name pic")
        .populate("comments.postedBy","_id name pic")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json(result)
            }
        })
})
router.put('/commentPost',requireLogin,(req,res)=>{
    const comment={text:req.body.comment,
                    postedBy:req.user._id}
            Post.findByIdAndUpdate(req.body.postId,{$push:{comments:comment}},{new:true})
            .populate("postedBy","_id name pic")
            .populate("likes","_id name pic")
            .populate("comments.postedBy","_id name pic")
                .exec((err,result)=>{
                    if(err){
                        return res.status(422).json({error:err})
                    }
                    else{
                        res.json(result)
                    }
                })
})
router.delete('/deletePost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err)
        })       
    }
    })
})
router.get('/getSubscribePost',requireLogin,(req,res)=>{
    //if posted by in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")
    .populate("likes","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.put('/likeComment',requireLogin,(req,res)=>{
    Post.update({"comments._id":req.body.commentId},{$addToSet:{"comments.$.commentLikes":req.user._id}})
                        .exec((err,result)=>{
                            if(err){
                                console.log(err)
                                return res.status(422).json({error:err})
                            }
                            else{
                                Post.find()
                                .populate("postedBy","_id name pic")
                                .populate("likes","_id name pic")
                                .populate("comments.postedBy","_id name pic")
                                .then(posts=>{
                                    res.json({posts})
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                            }
                        })      
})
router.put('/unlikeComment',requireLogin,(req,res)=>{
    Post.update({"comments._id":req.body.commentId},{$pull  :{"comments.$.commentLikes":req.user._id}})
                        .exec((err,result)=>{
                            if(err){
                                console.log(err)
                                return res.status(422).json({error:err})
                            }
                            else{
                                Post.find()
                                .populate("postedBy","_id name pic")
                                .populate("likes","_id name pic")
                                .populate("comments.postedBy","_id name pic")
                                .then(posts=>{
                                    res.json({posts})
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                            }
                        })      
})
router.delete('/deleteComment',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{$pull:{comments:req.body.record}},{new:true}
        ).populate("postedBy","_id name pic")
        .populate("likes","_id name pic")
        .populate("comments.postedBy","_id name pic")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                Post.find()
                    .populate("postedBy","_id name pic")
                    .populate("likes","_id name pic")
                    .populate("comments.postedBy","_id name pic")
                    .then(posts=>{
                        return res.json({posts})
                        })
                    .catch(err=>{
                        console.log(err)
                        })
            }
        })
})
module.exports =router