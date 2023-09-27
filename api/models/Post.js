const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
        trim:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    likes:{
        Likes:{
           type:Number,
           default:0
        },
        likedBy:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:'User'
        }
    },
    comments:[{
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
    }],
    createdDate:{
        type:Date,
        default:Date.now
    }
});

PostSchema.index({
    '$**':'text'
});

module.exports =mongoose.model('Post',PostSchema);