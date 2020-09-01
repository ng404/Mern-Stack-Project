const mongoose = require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required:true,trim: true
    },
    password:{
        type:String,
        required:true
    },
    followers:[
        {type:ObjectId,
        ref:"User"}
    ],
    following:[
        {type:ObjectId,ref:"User"}
    ],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/invisible/image/upload/v1593445441/userImage_kknjv1.png"
    }
},
{ timestamps: true }
);

mongoose.model("User",userSchema)