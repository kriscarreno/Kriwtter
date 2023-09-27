
<template>
  <div>
    <v-list
        v-for="chat in chats"
        :key="chat.id"
        >
        
        <div v-if="chat.user1._id!=user._id">
            <v-list-item-avatar>
            <v-img :src="chat.user1.avatar"></v-img>
           </v-list-item-avatar>
           {{ chat.user1.username }}
        </div>
        <div v-else>
             <v-list-item-avatar>
            <v-img :src="chat.user2.avatar"></v-img>
            
        </v-list-item-avatar>
        {{ chat.user2.username }}
        </div>
       
        </v-list>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props:{
        chats:{
            type:Array,
            required:true
        }
    },
    computed:{
       ...mapGetters(['user'])
    },
}
</script>

<style>

</style>