<template>
  <v-container>
    <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3>
        <v-card
        max-width="800"
        max-height="700"
        class="mb-4 mx-auto" 
        elevation="4"  
        >
            <v-card-title>
                <v-list-item-avatar>
                    <v-img :src="user.avatar"></v-img>
                  </v-list-item-avatar>
                {{ user.username }}
                <v-spacer></v-spacer>
                  
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
            <v-form
            ref="form"
            @submit.prevent="addPost"
            v-model="isValid"
            lazy-validation
            >
                <v-layout row>
                    <v-flex xs12>
                <v-textarea
                v-model="message"
                :rules="messageRules"
                label="Write your Message Here"
                >
                </v-textarea>
            </v-flex>
            </v-layout>
            <v-btn 
            :disabled="!isValid"
            type="submit"
            text>
                Submit
            </v-btn>
            </v-form>
        </v-card-text>
        </v-card>
    </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
   name:'AddPost',
   data(){
    return{
        isValid:false,
        message:'',
        messageRules:[
            v=>!!v||'You cant upload an empty message',
            v=>v.length<200||'Your message must have 200 characters or less'
        ]
    }
   },
   computed:{
    ...mapGetters(['user'])
   },
   methods:{
     addPost(){
        if(this.$refs.form.validate()){
            this.$store.dispatch('addPost',{
                message:this.message,
                userId:this.user._id
            });
            this.$router.push('/');
        }
     }
   }
}
</script>

<style>

</style>