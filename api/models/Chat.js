const mongoose = require('mongoose');

const chatSchema=new mongoose.Schema({
    user1:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    user2:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    messages:[{
        messageBody:{
            type:String,
            required:true
         },
         messageDate:{
            type:Date,
            default:Date.now
         },
         messageUser:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
         }
    }]
})

module.exports=mongoose.model('Chat',chatSchema);