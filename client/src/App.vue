<template>
<v-app style="height:100vh">

    <ChatView v-if="messages" :messages="messages" @messages-updated="handleAttributeUpdated" />

  <v-layout v-if="!messages">
          <v-navigation-drawer
            v-if="user && this.$route.name!=='ChatView'"
            permanent 
          >
            <v-list>
              <v-list-item>
                <v-img src="./assets/logoST.jpg" aspect-ratio="3"></v-img>
              </v-list-item>
              <v-list-item class="px-2">
                <v-list-item-avatar>
                  <v-img :src="user.avatar"></v-img>
                </v-list-item-avatar>
              </v-list-item>
    
              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                   {{ user.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
    
            <v-divider></v-divider>
    
            <v-list
              nav
              dense
            >
            <v-list-item link @click="gotoMain">
              <v-list-item-icon>
                <v-icon color="primary">mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
              <v-list-item link @click="gotoProfile">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="gotoSearch">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-magnify</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Search</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="drawer=!drawer">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-bell</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Notifications</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="messages=!messages">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-message</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Messages</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="signout">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-account-arrow-left-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Sign out</v-list-item-title>
              </v-list-item>
              
            </v-list>
          </v-navigation-drawer>

          <!-- Main View -->
    <v-main>
      <v-container fluid class="mt-4 app-container ">
        <transition name="fade">
        <router-view/>
        </transition>
      </v-container>
      <!-- Auth snackbar -->
      <v-snackbar v-model="authSnackbar" color="success" :timeout="6000" bottom left>
        <v-icon left>mdi-check-circle</v-icon>
        <h3>You are now signed</h3>
        <v-btn dark text @click="authSnackbar=false">Close</v-btn>
      </v-snackbar>
  
      <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="error" :timeout="6000" bottom left>
        <v-icon left>mdi-minus-circle</v-icon>
        <h3>{{authError.message}}</h3>
        <v-btn dark text to="/signin">Sign in</v-btn>
      </v-snackbar>
    </v-main >

    <v-divider :thickness="4" class="border-opacity-100" vertical></v-divider>
    <v-flex xs2 v-if="user && this.$route.name!=='ChatView'" class="sideCard">
      <v-card  class="mb-4 mx-auto">
      <transition name="expand-x">
            <v-list v-if="drawer">
              <v-card-title>Notificaciones <v-icon color="primary" @click="drawer=!drawer">mdi-bell</v-icon></v-card-title>
              
              <v-row justify="center">
                <v-col
                  cols="12"
                  sm="11"
                  class="mx-2"
                  v-for="Notificacion in notifications"
                  :key="Notificacion._id"
                >
                  <Notificacion :Notification="Notificacion" />
                </v-col>
              </v-row>
            </v-list>
      </transition>
    </v-card>
      <v-card>
        <v-card-title><v-img src="./assets/logoST.jpg" aspect-ratio="3"></v-img>Creatter!</v-card-title>
        Creatter it`s a social network to share your experiences as a programer with other people like you!
      </v-card>
      </v-flex>
        </v-layout>
  
</v-app>
</template>

<script>
import {mapGetters} from 'vuex';
import Notificacion from './components/Notificacion.vue';
import { USER_CONNECTED } from './queries/queries';
import ChatView from './views/ChatView.vue'

export default {
  name: 'App',
  components:{
    Notificacion,
    ChatView
  },
  data () {
    return{
      drawer:false,
      authSnackbar:false,
      authErrorSnackbar:false,
      messages:false
    }
  },
  mounted(){
    this.sockets.subscribe('like',(data)=>{
      this.$store.commit('addNotifications',data);
    });
  },
  watch:{
    user(newValue,oldValue){
      if(oldValue===null){
        this.authSnackbar=true;
        this.$socket.emit('register',this.user._id);
        this.$store.dispatch('getNotifications',this.user._id);
      }
    },
    authError(value){
      if(value!==null){
        this,this.authErrorSnackbar=true;
      }
    }
  },
  computed:{
      ...mapGetters(['user','authError','notifications']),
  },
  methods:{
    handleAttributeUpdated(newValue) {
      this.messages = newValue;
    },
    signout(){
      this.$store.dispatch('signoutUser');
    },
    gotoProfile(){
      if(this.$route.name!=='Profile'){
        this.$router.push({name:'Profile'});
      }
    },
    gotoMain(){
      if(this.$route.name!=='home'){
        this.$router.push({name:'home'});
      }
    },
    gotoSearch(){
      if(this.$route.name!=='search'){
        this.$router.push({name:'search'});
      }
    },
    gotoChat(){
      if(this.$route.name!=='ChatView'){
        this.$router.push({name:'ChatView'});
      }
    }
  }
};
</script>

<style scoped>
.v-main::-webkit-scrollbar {
  display: none;
}
.v-main {
  overflow-y: auto; /* Hace que v-main sea desplazable si su contenido supera su altura */
  height: calc(100vh - 20px); /* Altura total de la ventana menos la altura de tu v-app-bar */
}

.sideCard::-webkit-scrollbar {
  display: none;
}
.sideCard {
  overflow-y: auto; /* Hace que v-main sea desplazable si su contenido supera su altura */
  height: calc(100vh - 20px); /* Altura total de la ventana menos la altura de tu v-app-bar */
}
.fade-enter-active,
.fade-leave-active{
  transition-property: all;
  transition-duration: 0.25s;

}
.fade-enter-active{
  transition-delay:0.25s;
}
.fade-enter,
.fade-leave-active{
  opacity:0;
  transform: translateX(-25px);
}
.panel {
  width: 400px;
  height: 100vh;
  background-color: #f5f5f5;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.expand-x-enter-active,
.expand-x-leave-active {
  transition: all 0.3s;
}
.expand-x-enter,
.expand-x-leave-to {
  transform: translateX(100%);
}

.panel-content {
  height: calc(100% - 56px);
  overflow-y: auto;
  overflow-x: hidden;
}
.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
</style>
