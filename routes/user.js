const express =require('express')
const router =express.Router()
const mongoose=require('mongoose')
const User=mongoose.model('User')
const Post=mongoose.model("Post")
const Message=mongoose.model("Message")
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
                .populate("following","_id name pic")
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
router.post('/sendMessage',requireLogin,(req,res)=>{
    if(!req.body.text || !req.body.toId){
        return res.status(422).json({error:"please add all the fields.."})
    }
    const message =new Message({
        to:req.body.toId,
        text:req.body.text,
        sendBy:req.user._id
    })
    message.save().then(result=>{
        Message.find({$or:[{to:req.body.toId,sendBy:req.user._id},{to:req.user._id,sendBy:req.body.toId}]})
        .populate("to","_id name pic")
        .populate("sendBy","_id name pic")
        .sort({ createdAt : 1})
        .then(result=>{
            res.json(result)
        })
    }).catch(err=>{
        console.log(err)
    })
})
router.get('/getMessage/:id',requireLogin,(req,res)=>{
    Message.find({$or:[{to:req.params.id,sendBy:req.user._id},{to:req.user._id,sendBy:req.params.id}]})
    .populate("to","_id name pic")
    .populate("sendBy","_id name pic")
    .sort({ createdAt : 1})
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        console.log(err)
    })
})
router.get('/getuserMessageList',requireLogin,(req,res)=>{
    const userList1=[];
    const userList=[];
    Message.find({sendBy:req.user._id})
    .populate("to","_id name pic")
    .populate("sendBy","_id name pic")
    .sort({ createdAt : 1})
    .then(result=>{
        
        result.forEach(function(item){
            const messageList=[]
            result.forEach(function(item1){
                if(item.to._id.toString()===item1.to._id.toString())
                    messageList.push(item1)
            })
                        if(!userList.includes(messageList[messageList.length-1]))
                        userList.push(messageList[messageList.length-1])          
        })
        Message.find({to:req.user._id})
        .populate("to","_id name pic")
        .populate("sendBy","_id name pic")
        .sort({ createdAt : 1})
        .then(result=>{
            result.forEach(function(item){
            const messageList=[]
            result.forEach(function(item1){
                if(item.sendBy._id.toString()===item1.sendBy._id.toString())
                    messageList.push(item1)
            })
            if(!userList1.includes(messageList[messageList.length-1]))
                userList1.push(messageList[messageList.length-1])     
        })
        const userList2=[];
        if(userList1.length===0){
            userList.forEach(function(item){
                userList2.push(item)
            })
        }
        else{
        userList.forEach(function(item){
            var flag=1;
            userList1.forEach(function(item1){
               if(item.to._id.toString()===item1.sendBy._id.toString())
               {
                if(item.createdAt<=item1.createdAt)
                     userList2.push(item1)
                else
                    userList2.push(item)
                flag=0;
                userList1.splice(userList1.indexOf(item1), 1);
                return
               }
               else{
                   flag=1;
               }
            })
             if(flag==1)
                userList2.push(item)
        })
        userList1.forEach(function(item){
            userList2.push(item)
        })
    }
        userList2.sort(function(a, b) {
            var dateA = new Date(a.createdAt), dateB = new Date(b.createdAt);
            return dateB - dateA;
        });
        return res.json(userList2)
        }) 
    }).catch(err=>{
        console.log(err)
    })
})
router.delete('/deleteMessage',requireLogin,(req,res)=>{
    Message.findOne({_id:req.body.messageId})
    .populate("to","_id name pic")
    .populate("sendBy","_id name pic")
    .exec((err,message)=>{
        if(err || !message){
            return res.status(422).json({error:err})
        }
        if(message.sendBy._id.toString() === req.user._id.toString()){
            message.remove()
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err)
        })       
    }
    })
})
router.put('/likeMessage',requireLogin,(req,res)=>{
    Message.findByIdAndUpdate(req.body.messageId,{isLiked:true},{new:true}
        ).populate("to","_id name pic")
        .populate("sendBy","_id name pic")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json(result)
            }
        })
})
router.put('/unlikeMessage',requireLogin,(req,res)=>{
    Message.findByIdAndUpdate(req.body.messageId,{isLiked:false},{new:true}
        ).populate("to","_id name pic")
        .populate("sendBy","_id name pic")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json(result)
            }
        })
})
router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id name email pic")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})
router.get('/getUserFollowingList/:userId',requireLogin,(req,res)=>{
    User.findById(req.params.userId)
    .select("following")
    .populate("following","_id name pic")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})
router.get('/getUserFollowersList/:userId',requireLogin,(req,res)=>{
    User.findById(req.params.userId)
    .select("followers")
    .populate("followers","_id name pic")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})
module.exports =router  
