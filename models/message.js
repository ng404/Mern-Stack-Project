const mongoose = require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const messageSchema=new mongoose.Schema({
    to:{
        type:ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    },
    sendBy:{
        type:ObjectId,
        ref:"User"
    },
    isLiked:{
        type:Boolean,
        default:false
    }
},
{ timestamps: true }
);

mongoose.model("Message",messageSchema)