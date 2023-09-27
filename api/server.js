const express=require("express");
const {createServer}=require("http");
const {makeExecutableSchema}=require('@graphql-tools/schema');
const {SubscriptionServer}=require("subscriptions-transport-ws");
const {execute,subscribe}=require('graphql');
const {ApolloServer,AuthenticationError}=require('apollo-server-express');
const {mongoose}=require('mongoose');
const fs=require('fs');
const path= require('path');
const jwt=require('jsonwebtoken');
const {socketConnection}=require('./socketio/socketio');

//Dandole la url de conexion con la base de datos
require('dotenv').config({path: 'variables.env'});

//Importando typeDefs y resolvers
const filePath = path.join(__dirname,'typeDefs.gql');
const typeDefs=fs.readFileSync(filePath,"utf-8");
const resolvers=require('./resolvers.js');

//IMPORTANDO LOS MODELOS
const User=require('./models/User.js');
const Post=require('./models/Post.js');



(async function(){
    const app=express();

    //Convirtiendo a un server http para realizar las subscripciones
    const httpServer=createServer(app);
    socketConnection(httpServer);

    //Verificando la validez del token
    const getUser= async token =>{
        if(token){
            try{
             return await jwt.verify(token,process.env.SECRET);
            }catch(err){
               throw new AuthenticationError('Your session has ended . Please sign in again');
            }
        }
    };

    //el schema del server apollo
    const schema= makeExecutableSchema({
        typeDefs,
        resolvers,
    });
    
    const subscriptionServer=SubscriptionServer.create(
        {schema,
        execute,
        subscribe,
    },
        {server:httpServer,path:'/subscriptions'}
    );
    
    
    const server=new ApolloServer({
        schema,
        formatError: error =>({
            name: error.name,
             message:error.message.replace('Context creation failed:','')
           }),
        context:async ({req})=>{
            const token = req.headers["authorization"];
            return{User,Post,currentUser:await getUser(token)};
           },  
        plugins:[
            {
                async serverWillStart(){
                    return{
                        async drainServer(){
                            subscriptionServer.close();
                        }
                    }
                }
            }
        ]
    });

    await server.start();
    server.applyMiddleware({app});

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("DB Connected"))
    .catch(err =>console.error(err));

    const PORT=4000;
    httpServer.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`);
    })

})();