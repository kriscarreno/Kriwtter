import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { HttpLink } from 'apollo-link-http'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'


import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io'
export const SocketInstance = socketio('http://localhost:4000');
Vue.use(new VueSocketIO({connection: SocketInstance}));

Vue.config.productionTip = false


const httpLink=new HttpLink({
  uri:'http://localhost:4000/graphql'
})

const wsLink=new WebSocketLink({
  uri:'ws://localhost:4000/subscriptions',
  options:{
    reconnect:true,
  }
})

const link=split(
  ({query})=>{
    const definition= getMainDefinition(query)
    return definition.kind=== 'OperationDefinition' && definition.operation==='subscription'
  },
  wsLink,
  httpLink
)

export const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri:'http://localhost:4000/graphql',
  //Incluyendo el token en cada operacion de peticion a la api
  fetchOptions:{
    credentials: 'include'
  },
  request: operation =>{
    // Si no hay un token en el local storage anadelo
    if(!localStorage.token){
      localStorage.setItem('token','');
    }

    //Anadir el token como encabezado de la operacion
    operation.setContext({
      headers:{
        authorization: localStorage.getItem('token')
      }
    })
  },
  // Esta seccion maneja todo en caso de algun error
  onError:({graphQLErrors, networkError})=>{
    if(networkError){
      console.log('[networkError]', networkError);
    }

    if(graphQLErrors){
      for(let err of graphQLErrors){
        console.dir(err);
        if(err.name==="AuthenticationError"){
          // En esta condicion compruebo que el error sea de autenticacion (se vencio el token) por lo que llamo a la funcion de cerrar sesion
          store.commit('setAuthError',err);
          store.dispatch('signoutUser');        }
      }
    }
  }
});
Vue.use(VueApollo);
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: h => h(App),
  created(){
    //cada vez que la aplicacion se cree osea que se actualice la pagina el va a asignar el current user al store 
    this.$store.dispatch('getCurrentUser');

  }
}).$mount('#app')
