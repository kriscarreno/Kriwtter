import Vue from 'vue'
import Vuex from 'vuex'
import {apolloClient} from '../main'
import router from '@/router'
import { 
  GET_CURRENT_USER,
  SIGNIN_USER,
  CREATE_USER ,
  ADD_POST,
  GET_POSTS,
  FOLLOW_USER,
  GET_POSTS_BY_USER,
  NOTIFICATIONS,
  ADD_COMMENT,
  SEARCH_POSTS,
  DELETE_POST,
  USERS_TO_CHAT,
  GET_CHATS
} from '@/queries/queries'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    postByU:[],
    notifications:[],
    searchedPost:[],
    posts:[],
    postsR:[],
    user:null,
    loading:false,
    error:null,
    authError:null,
    userstate:null,
    usersToChat:[],
    chats:[]
  },
  getters: {
    notifications:state=>{return state.notifications},
    user:state =>{return state.user},
    chats:state=>{return state.chats},
    users_to_chat:state =>{return state.usersToChat},
    searchedPost:state=>{return state.searchedPost},
    posts:state=>{return state.posts},
    userposts:state=>{return state.postByU},
    loading:state=>{return state.loading},
    error: state=>{return state.error},
    authError:state=>{return state.authError}
  },
  mutations: {
  setUserPosts(state,payload){
    state.postByU=payload;
  },
  setChats(state,payload){
    state.chats=payload
  },
  setUsersToChat(state,payload){
    state.usersToChat=payload
  },
  addF(state,payload){
     if(payload.fll){
      const index=state.user.following.peopleFollowing.findIndex((user)=>user._id===payload.user._id);
      state.user.following.peopleFollowing.splice(index,1);
      state.user.following.Following-=1;
     }else{
      state.user.following.peopleFollowing.push(payload.user);
      state.user.following.Following+=1;
     }
  },
  setR(state,payload){
     state.postsR=payload;
  },
  addComments(state,payload){
    let post = state.posts.find((post) => post._id === payload.postId);
    post.comments.unshift(payload.addComment);
  },
  setSearchedPosts(state,payload){
    if(payload!== null){
     state.searchedPost=payload;
    }
  },
  setDeletedPost(state,payload){
    const index =state.posts.findIndex((post) => post._id === payload.postId);
    const indexU=state.postByU.findIndex((post) => post._id === payload.postId);
    state.postByU.splice(indexU,1);
    state.posts.splice(index,1);
  },
  setLikes(state,payload){
    let post = state.posts.find((post) => post._id === payload.postId);

    if(payload.blue){
      post.likes.Likes-=1;
      const index = post.likes.likedBy.findIndex((post) => post.id === state.user._id);
      post.likes.likedBy.splice(index,1);
    }else{
      post.likes.Likes+=1;
      post.likes.likedBy.push(state.user)
    }
  },
    addNotifications(state,payload){
      state.notifications.unshift(payload);
    },
    setNotifications(state,payload){
      state.notifications=payload;
    },
    updateUserConnected(state, user) {
      state.userstate= user;
    },
    setAuthError:(state,payload)=>{
      state.authError=payload;
    },
    addUserPost:(state,payload)=>{
         state.postByU.unshift(payload);
    },
    setPosts:(state,payload)=>{
      state.posts=payload;
    },
    setUser:(state,payload)=>{
       state.user=payload;
    },
    setLoading:(state,value)=>{
      state.loading=value;
    },
    clearUser: state=>(state.user=null),
    setError:(state,payload)=>(state.error=payload),
    clearError:state=>(state.error=null)
  },
  actions: {
    getChats:async({commit},payload)=>{
      await apolloClient.query({
        query:GET_CHATS,
        variables:payload
      }).then(({data})=>{
        commit('setChats',data.get_chats);
      }).catch(err=>{
        console.error(err);
      });
    },
    getUsersToChat:async ({commit},payload)=>{
     await apolloClient.query({
        query:USERS_TO_CHAT,
        variables:payload
      }).then(({data})=>{
        commit('setUsersToChat',data.get_users_to_chat);
      }).catch(err=>{
        console.error(err);
      });
    },
    addFollowing:({commit},payload)=>{
         commit('addF',payload);
    },
    follow:({commit},payload)=>{
      apolloClient.mutate({
        mutation:FOLLOW_USER,
        variables:payload
      }).then(({data})=>{
        console.log(data);
      }).catch(err=>{
        console.error(err);
      })
    },
    addComment:async({commit},{userId,postId,message})=>{
      await apolloClient.mutate({
        mutation:ADD_COMMENT,
        variables:{postId,userId,message}
      }).
      then(({data})=>{
        console.log(data,postId);
        commit('addComments',{addComment:data.addComment,postId})
      }).catch(err=>{
        console.error(err);
      })
    },
    getNotifications:async({commit},userId)=>{
         await apolloClient.query({
          query:NOTIFICATIONS,
          variables:{userId:userId}
         }).then(({data})=>{
          console.log(data);
          commit('setNotifications',data.getNotifications);
         }).catch(err=>{
          console.error(err);
         })
    },
    getPostsByUser:async({commit},userId)=>{
         await apolloClient.query({
          query: GET_POSTS_BY_USER,
          variables: {userId:userId}
        }).then(({data})=>{
          commit('setUserPosts',data.getPostsByUser);
        }).catch(err=>{
          console.error(err);
        });
    },
    searchPosts:({commit},payload)=>{
      apolloClient.query({
        query:SEARCH_POSTS,
        variables:payload
      }).then(({data})=>{
        console.log(data);
        commit('setSearchedPosts',data.searchPosts);
      }).catch(err=>{
        console.error(err);
      })
    },
    getPosts: async ({ commit }) => {
      try {
        commit('setLoading', true);
        const { data } = await apolloClient.query({
          query: GET_POSTS,
        });

        if (data) {
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
        } else {

          commit('setLoading', false);
        }
      } catch (err) {
        commit('setLoading', false);
        console.error(err);
      }
    },
    setLik: ({commit},{postId,blue})=>{
          commit('setLikes',{postId,blue});
    },
    getCurrentUser:({commit})=>{
      commit('setLoading',true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({data})=>{
        commit('setLoading',false);
        commit('setUser',data.getCurrentUser);
        console.log(data);
      })
      .catch(err=>{
        commit('setLoading',false);
        console.error(err);
      })
    },

    signinUser:({commit},payload)=>{
      commit('clearError');
      commit('setLoading',true)
       apolloClient
       .mutate({
        mutation: SIGNIN_USER,
        variables: payload
       })
       .then(({data})=>{
        commit('setLoading',false);
        localStorage.setItem('token',data.signinUser.token);
        //console.log(data.signinUser);
        router.go();
       })
       .catch(err=>{
        commit('setLoading',false);
        commit('setError',err);
        console.error(err);
       })
    },
    createUser:({commit},payload)=>{
      commit('clearError');
      commit('setLoading',true)

       apolloClient
       .mutate({
        mutation: CREATE_USER,
        variables: payload
       })
       .then(({data})=>{
        commit('setLoading',false);
        localStorage.setItem('token',data.createUser.token);
        router.push({name:'SignIn'});
       })
       .catch(err=>{
        commit('setLoading',false);
        commit('setError',err);
        console.error(err);
       })
    },
    signoutUser:async ({commit})=>{
      //clear user in state
      commit('clearUser');
      //remove token in local storage
      localStorage.setItem('token','');
      //end session
      await apolloClient.resetStore();
      //redirect home
      if(router.currentRoute.name!=='SignIn'){
      router.push({name:'SignIn'})
      }
    },
    addPost: async ({commit},payload)=>{
       apolloClient.mutate({
        mutation:ADD_POST,
        variables:payload,
        update:(cache,{data:{addPost}})=>{
          const data=cache.readQuery({query:GET_POSTS});
          commit('setR',data.getPosts);
          data.getPosts.unshift(addPost);
          commit('setPosts',data.getPosts);
          cache.writeQuery({
            query:GET_POSTS,
            data:data
          });
        },
        optimisticResponse:{
          __typename:"Mutation",
          addPost:{
            __typename:'Post',
            _id:-1,
            ...payload
          }
        }
       })
       .then(({data})=>{
        console.log(data.addPost);
                  commit('addUserPost',data.addPost);
       })
       .catch(err=>{
        console.error(err)
       })
    },
    deletePost:async({commit},payload)=>{
      apolloClient.mutate({
        mutation:DELETE_POST,
        variables:{
          postId:payload.postId,
          userId:payload.userId
        },
      }).then(({data})=>{
        console.log(data);
        commit('setDeletedPost',payload);
      }).catch(err=>{
        console.error(err);
      })
    }
  },
  modules: {
  }
})
