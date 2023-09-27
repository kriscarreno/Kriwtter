const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const Message=require("../api/models/Message");
const Notification=require("../api/models/Notification");
const { GraphQLScalarType, Kind } = require('graphql');
const User = require('./models/User');
const Chat = require('./models/Chat');
// const User=require('../api/models/User')

const pubsub = new PubSub();


// Creando el token con los valores de username y email
const createToken=(user,secret,expiresIn)=>{
    const {username,email}=user;
    return jwt.sign({username,email},secret,{expiresIn});
}

module.exports={
    ObjectId: new GraphQLScalarType({
        name: 'ObjectId',
        description: 'MongoDB ObjectId scalar type',
        parseValue(value) {
          return value; // El valor recibido como argumento
        },
        serialize(value) {
          return value.toString(); // El valor devuelto como cadena de texto
        },
        parseLiteral(ast) {
          if (ast.kind === Kind.STRING) {
            return ast.value; // El valor literal como cadena de texto
          }
          return null;
        },
      }),
    Query:{
        get_chats:async(_,{userId})=>{
            const chats=await Chat.find({ $or: [
                { user1: userId },
                { user2: userId }
              ]}).populate([
                {
                    path:'user1',
                    model:'User'
                },
                {
                    path:'user2',
                    model:'User'
                },
                {
                    path:'messages.messageUser',
                    model:'User'
                }
              ])
              return chats;
        },
        get_users_to_chat:async(_,{userId})=>{
            const user=await User.findById(userId).populate({
                path:'following.peopleFollowing',
                model:'User'
            });
            return user.following.peopleFollowing;
        },
        getNotifications:async(_,{userId})=>{
            return await Notification.find({ userId}).sort({timestamp:-1});
        },
        getCurrentUser: async(_,args,{User,currentUser})=>{
            if(!currentUser){
                console.log(currentUser);
                return null;
            }
            const user= await User.findOne({username: currentUser.username}).populate([
                {
                    path:'followers.peopleFollowers',
                    model:'User'
                },
                {
                    path:'following.peopleFollowing',
                    model:'User'
                }
            ]);
            if(!user){
                throw new Error('User not found');
            }
            return user;
        },
        getPosts:async(_,args,{Post})=>{
            const posts=await Post.find({}).sort({createdDate:'desc'}).populate([
                {
                    path:'createdBy',
                    model:'User'
                },
                {
                    path:'createdBy.followers.peopleFollowers',
                    model:'User'
                },
                {
                    path:'likes.likedBy',
                    model:'User'
                },
                {
                    path:'comments.messageUser',
                    model:'User'
                }

            ]);
            return posts;
        },
        getPostsByUser:async(_,{userId},{Post})=>{
            return await Post.find({ createdBy: userId }).populate([
                {
                    path:'createdBy',
                    model:'User'
                },
                {
                    path:'createdBy.followers.peopleFollowers',
                    model:'User'
                },
                {
                    path:'likes.likedBy',
                    model:'User'
                },
                {
                    path:'comments.messageUser',
                    model:'User'
                }

            ]);
        },
        searchPosts:async(_,{searchTerm},{Post})=>{
            if(searchTerm){
                const searchResults=await Post.find(
                    {$text: {$search:searchTerm}},
                    {score: {$meta:'textScore'}}
                ).sort({
                    score:{$meta:'textScore'},
                    likes:'desc'
                })
                .limit(5).populate([
                    {
                        path:'createdBy',
                        model:'User'
                    },
                    {
                        path:'createdBy.followers.peopleFollowers',
                        model:'User'
                    },
                    {
                        path:'likes.likedBy',
                        model:'User'
                    },
                    {
                        path:'comments.messageUser',
                        model:'User'
                    }
                ]);
                return searchResults;
            }
        },
        message:async(_,{ID})=>Message.findById(ID)
    },
    Mutation:{
        addComment:async(_,{postId,userId,message},{Post})=>{
              const newComment={
                messageBody:message,
                messageUser:userId
             };
             const post=await Post.findOneAndUpdate(
                {_id:postId},
                {$push:{comments:{$each:[newComment],$position:0}}},
                {new:true}
                ).populate({
                    path:'comments.messageUser',
                    model:'User'
                });
                return post.comments[0];
        },
        follow:async (_,{userId,usertoFollowId},{User})=>{
            let user=await User.findById(usertoFollowId);
            let userf=await User.findById(userId);
            let flag=false;
            for (let index = 0; index < user.followers.peopleFollowers.length; index++) {
                if(userf._id.toString()===user.followers.peopleFollowers[index]._id.toString()){
                    flag=true;
                    break
                   };
            };
            if(flag){
                await User.findOneAndUpdate(
                    { _id: usertoFollowId },
                    { $pull: { 'followers.peopleFollowers': userId } ,$inc:{'followers.Followers':-1}}
                  );
                  await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { 'following.peopleFollowing': usertoFollowId } ,$inc:{'following.Following':-1}}
                  );
            }else{
                await User.findOneAndUpdate(
                    { _id: usertoFollowId },
                    { $push: { 'followers.peopleFollowers': userId } ,$inc:{'followers.Followers':1}}
                  );
                  await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { 'following.peopleFollowing': usertoFollowId } ,$inc:{'following.Following':1}}
                  );
            }
            return [await User.findById(usertoFollowId).populate([
                {
                    path:'followers.peopleFollowers',
                    model:'User'
                },
                {
                    path:'following.peopleFollowing',
                    model:'User'
                }
            ]),await User.findById(userId).populate([
                {
                    path:'followers.peopleFollowers',
                    model:'User'
                },
                {
                    path:'following.peopleFollowing',
                    model:'User'
                }
            ])];
           
        },
        like: async(_,{postId,userId},{User,Post})=>{
            let post=await Post.findById(postId);
            const user=await User.findById(userId);
            let flag=false;
            for (let index = 0; index < post.likes.likedBy.length; index++) {
               if(user._id.toString()===post.likes.likedBy[index]._id.toString()){
                flag=true;
                break
               };
            };

            if(flag){
             await Post.findOneAndUpdate(
                    { _id: postId },
                    { $pull: { 'likes.likedBy': userId } ,$inc:{'likes.Likes':-1}}
                  );
                  
            }else{
               await Post.findOneAndUpdate(
                    { _id: postId },
                    { $inc: { 'likes.Likes': 1 }, 
                    $push: { 'likes.likedBy': user } }
                 );
            };
            return await Post.findById(postId).populate([
                {
                    path:'createdBy',
                    model:'User'
                },
                {
                    path:'likes.likedBy',
                    model:'User'
                }

            ]);
        },
        addPost:async(_,{message,userId},{User,Post})=>{
           const user= await User.findById(userId);
           const newPost=await new Post({
            message,
            createdBy:user
           }).save();
           return newPost;
        },
        createMessage: async(_,{messageInput:{text,username}},)=>{
            const newMessage=new Message({
                text:text,
                createdBy:username
            });
            const res=await newMessage.save();

            pubsub.publish('MESSAGE_CREATED',{
                messageCreated:{
                    text:text,
                    createdBy:username
                }
            });


             return{
                id:res.id,
                ...res._doc
             }
        },
        // Funcion para loguearse si todos los parametros son correctos se loguea retornando el token 
        // el cual esta definido en los typedefs
        signinUser: async(_,{username,password},{User})=>{
            const user =await User.findOne({username});
            if(!user){
             throw new Error('User not found');
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if(!isValidPassword){
             throw new Error('Invalid password');
            }
            pubsub.publish('USER_CONNECTED',{
                user_Connected:{
                    username,
                    password,
                    _id:user._id
                }
            });
            return {token: createToken(user,process.env.SECRET,'1hr')};
         },
          // Aqui igual luego de crear el usuario correctamente se le asigna un token
        createUser: async(_,{username,email,password},{User}) =>{
            const user= await User.findOne({username});
            if(user){
                throw new Error('User ya existe');
            }
            const newUser = await new User({
                username,
                email,
                password
            }).save();
           
               return {token: createToken(newUser,process.env.SECRET,'1hr')};
        },
        deletePost:async (_,{postId,userId},{Post,User})=>{
             const user=await User.findById(userId);
             const post=await Post.findById(postId);
              if(!user){
                throw new Error('User not found')
             }
             if(!post){
                throw new Error('Post not found');
             }
            
             if(post.createdBy._id.toString()!==user._id.toString()){
                throw new Error('You can`t delete this post');
             }
             await Post.findOneAndDelete({_id:postId});
             return 'Post Deleted'
        }
    },
    Subscription:{
        user_Connected:{
            subscribe: () => pubsub.asyncIterator('USER_CONNECTED'),
        },
        messageCreated:{
            subscribe: ()=> pubsub.asyncIterator('MESSAGE_CREATED')
        }
    }
}