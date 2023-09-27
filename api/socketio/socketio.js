
let io;
const Notification=require('../models/Notification');
const User=require('../models/User');
const Chat=require('../models/Chat')
let userSockets = [];
exports.socketConnection=server=>{
    io = require("socket.io")(server);
  
    io.on('connection',socket=>{
      socket.on('register',(userId)=>{
          console.log('User registered')
           userSockets[userId]=socket.id
      });
        console.info("User Connected ");
        socket.join(socket.request._query.id);
        socket.on('comment',(args)=>{
          sendComment(args.userId._id,args.userID)
        })
        socket.on('like',(args)=>{
          console.log(args.userId._id)
          sendMessageToUser(args.userId._id,args.userID);
        })
        socket.on('create_new_chat',(args)=>{
          create_new_chat(args.userId,args.userID);
        })
        socket.on('message',(args)=>{
          
          add_new_message(args.userId,args.chatId,args.message);
        })
        socket.on("disconnect",()=>{
            console.info("User disconnected")
        })
    })
};

async function add_new_message (userId,chatId,message){
  const exist=await Chat.findById(chatId)
  
  if(exist){
    let socketId1 = userSockets[exist.user1._id]
    let socketId2 = userSockets[exist.user2._id]
    const newMessage={
      messageBody:message,
      messageUser:userId
   };
   const chat=await Chat.findOneAndUpdate(
      {_id:chatId},
      {$push:{messages:{$each:[newMessage]}}},
      {new:true}
      ).populate({
          path:'messages.messageUser',
          model:'User'
      });
      if(socketId1)
      io.to(socketId1).emit('new_message',chat.messages[chat.messages.length-1]);
      if(socketId2)
      io.to(socketId2).emit('new_message',chat.messages[chat.messages.length-1]);
  }else{
    console.error(`Chat not found`);
  }
}



async function create_new_chat (userId,userID){
  const exist=await Chat.findOne({
    $or: [
      { user1: userId, user2: userID },
      { user1: userID, user2: userId }
    ]
  })
  if(exist){
    console.log('Este chat ya existe')
  }else{
  const user1=await User.findById(userId);
  const user2=await User.findById(userID);
  const newChat= await new Chat({
    user1:user1,
    user2:user2
  }).save()
}
}

async function sendMessageToUser (userId,userID) {
    let socketId = userSockets[userId];
    const user=await User.findById(userID);
      const newNotfication= await new Notification({
        timestamp:new Date(),
        userId:userId,
        message:user.username+' Te ha dado un like',
        avatar:user.avatar,
        icon:'mdi-heart'
      }).save();
    if (socketId) {
      io.to(socketId).emit('like', newNotfication);
    } else {
      console.log(`No se encontró el socket para el usuario ${userId}`);
    }
  }
  async function sendComment (userId,userID) {
    let socketId = userSockets[userId];
    const user=await User.findById(userID);
      const newNotfication= await new Notification({
        timestamp:new Date(),
        userId:userId,
        message:user.username+' Ha comentado uno de tus posts',
        avatar:user.avatar,
        icon:'mdi-message'
      }).save();
    if (socketId) {
      io.to(socketId).emit('like', newNotfication);
    } else {
      console.log(`No se encontró el socket para el usuario ${userId}`);
    }
  }
exports.SimpleEmit = (name, message) => {
    io.emit(name, message);
   
    };
  