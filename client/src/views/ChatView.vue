
<template>
  <v-app style="height:100vh">
    <v-layout>
    <v-navigation-drawer permanent>
      <v-btn @click="updateAttributeValue"><v-icon>mdi-arrow-down-left-bold</v-icon>Go Back</v-btn>
      <v-list>
        <v-list-item><h1>MESSAGES</h1></v-list-item>
        <v-list-item><v-btn @click="newchat=!newchat">new chat</v-btn></v-list-item>
      </v-list>
      <v-list
        v-for="chat in chats"
        :key="chat.id"
        >
        <v-list-item v-if="chat.user1._id!=user._id" @click="setSelectedChat(chat)">
            <v-list-item-avatar>
            <v-img :src="chat.user1.avatar"></v-img>
           </v-list-item-avatar>
           {{ chat.user1.username }}
        </v-list-item>

        <v-list-item v-else @click="setSelectedChat(chat)">
             <v-list-item-avatar>
            <v-img :src="chat.user2.avatar"></v-img>
        </v-list-item-avatar>
        {{ chat.user2.username }}
        </v-list-item>
       
        </v-list>
    </v-navigation-drawer>
    
      <v-main >

         <Chat :chat="selected_chat" v-if="newchat===false"/>
         <v-card v-if="newchat">
        <v-car-title >People to chat</v-car-title>
        <v-card-text>
        <v-list
        v-for="friend in users_to_chat"
        :key="friend.id"
        >
        <v-list-item-avatar
        @click="startNewChat(friend._id)"
        >
          <v-img :src="friend.avatar"></v-img>
        </v-list-item-avatar>
      {{ friend.username }}
        </v-list>
      </v-card-text>
    </v-card>
  </v-main>
    
    </v-layout>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex';
import Chat from '@/components/chat/Chat.vue'
export default {
  props:['messages'],
  components:{
    Chat
  },
    data(){
      return{
        newchat:false,
        selected_chat:undefined
      }
    },
    mounted(){
        this.$store.dispatch('getUsersToChat',{userId:this.user._id});
        this.$store.dispatch('getChats',{userId:this.user._id});
        
        this.sockets.subscribe('new_message',(data)=>{
        this.selected_chat.messages.push(data)
        });
      },
    computed:{
      ...mapGetters(['user','users_to_chat','chats']),
      
  },
  methods:{
    updateAttributeValue() {
      const newValue = false;
      this.$emit('messages-updated', newValue);
    },
    startNewChat(userID){
      this.$socket.emit('create_new_chat',{userId:this.user._id,userID:userID})
    },
    setSelectedChat(chat){
      this.newchat=false
        this.selected_chat=chat
        console.log(this.selected_chat)
      }
  }
   
}
</script>

<style scoped>
</style>
