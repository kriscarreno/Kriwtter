
<template>
    <v-container fluid>
        <div v-if="chat.user1._id!=user._id">
            <v-toolbar>
                <v-list-item-avatar>
                    <v-img :src="chat.user1.avatar"></v-img>
                   </v-list-item-avatar>
                   <H2>{{ chat.user1.username }}</H2>
                   <v-spacer></v-spacer>
                   <v-btn icon>
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
            
                  <v-btn icon>
                    <v-icon>mdi-video</v-icon>
                  </v-btn>
            
                  <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
            </v-toolbar>
        </div>
        <div v-else>
            <v-toolbar>
                <v-list-item-avatar>
                    <v-img :src="chat.user2.avatar"></v-img>
                   </v-list-item-avatar>
                <H2> {{ chat.user2.username }}</H2>
                <v-spacer></v-spacer>
                   <v-btn icon>
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
            
                  <v-btn icon>
                    <v-icon>mdi-video</v-icon>
                  </v-btn>
            
                  <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
            </v-toolbar>
        </div>
        
        <br/>

        <v-row>
            <v-col cols="12">
              <div class="message-card">
                <v-list class="message-list" dense>
                  <v-list-item v-for="(message, index) in chat.messages" :key="index">
                    <v-list-item-content>
                      <v-list-item-title class="user">{{ message.messageUser.username }}</v-list-item-title>
                      <v-list-item-subtitle class="content">{{ message.messageBody }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
            </div>
            </v-col>
          </v-row>

        <v-row centered>
            <v-col cols="12">
                <v-text-field label="Nuevo mensaje" v-model="message">
                    <v-icon
                    slot="append"
                    @click="addNewMessage(chat._id)"
                  >
                  mdi-arrow-right-bold-circle-outline
                  </v-icon>
                </v-text-field>
            </v-col>
          </v-row>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props:{
        chat:{
            type:Object,
            required:true
        }
    },
    data(){
        return{
            message:''
        }
    },
        computed:{
        ...mapGetters(['user']),
    },
    methods:{
        addNewMessage(chatId){
           this.$socket.emit('message',{userId:this.user._id,chatId,message:this.message})
           this.message=''
        }
    }
}
</script>

<style>
.message-card::-webkit-scrollbar {
    width: 0.5rem;
  }
  
  .message-card::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  
  .message-card::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 0.25rem;
  }
  
  .message-card::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
.message-card {
    height: 400px;
    overflow-y: scroll;
  }
  
  .user {
    font-weight: bold;
  }
  
  .content {
    margin-top: 5px;
  }
</style>