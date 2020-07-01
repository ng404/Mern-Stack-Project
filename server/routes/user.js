const express =require('express')
const router =express.Router()
const mongoose=require('mongoose')
const User=mongoose.model('User')
const Post=mongoose.model("Post")
const requireLogin=require('../middleware/requireLogin')



router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
            Post.find({postedBy:req.params.id})
            .populate("postedBy","_id name")
            .exec((err,posts)=>{
                if(err){
                    return res.status(422).json({error:err})
                }
                res.json({user,posts})
            })
    }).catch(err=>{
        return res.status(422).json({error:"User not find"})
    })
})


router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{$push:{followers:req.user._id}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{$push:{following:req.body.followId}},{new:true},
                )
                .select("-password")
                .then(result1=>{
                    return res.json(result1)
                }).catch(err=>{
                   return  res.status(422).json({error:err})
                })
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{$pull:{following:req.body.unfollowId}},{new:true},
                ).select("-password")
                .then(result=>{
                    return res.json(result)
                }).catch(err=>{
                   return  res.status(422).json({error:err})
                })
    })
})

router.put('/updateProfile',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic,name:req.body.name,email:req.body.email}},{new:true})
    .select("-password")
    .then(result=>{
            res.json(result)
    }).catch(err=>{
        return  res.status(422).json({error:err})
     })
})

router.get('/getFollowingList',requireLogin,(req,res)=>{
    User.findById(req.user._id)
    .select("following")
    .populate("following","_id name pic")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})
router.get('/getFollowersList',requireLogin,(req,res)=>{
    User.findById(req.user._id)
    .select("followers")
    .populate("followers","_id name pic")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})
module.exports =router