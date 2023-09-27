<template>
  <v-card 
  max-width="800"
  max-height="700"
  class="mb-4 mx-auto" 
  elevation="4"  
  >
    <v-card-title>
      <v-list-item-avatar
      >
        <v-img :src="post.createdBy.avatar"></v-img>
      </v-list-item-avatar>
    {{ post.createdBy.username }}
      <v-menu offset-y v-if="post.createdBy._id!=user._id">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-2" fab small
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
          <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :to="item.route"
          >
            <v-list-item-title >{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
        <v-btn class="mx-2" fab small @click="follow(post,fll(post))" v-if="post.createdBy._id!=user._id">
          <v-icon v-if="fll(post)"  color="primary">mdi-account-check</v-icon>
            <v-icon v-else>mdi-account-plus</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="deletePost(post._id,user._id)" class="mx-2" fab small v-if="post.createdBy._id==user._id">
            <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
        {{ post.message }}
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text>
        <v-btn   small @click="addLike(post._id,blue(post),post.createdBy)">
            <v-icon v-if="blue(post)"  color="primary">mdi-thumb-up-outline</v-icon>
            <v-icon v-else>mdi-thumb-up-outline</v-icon>
            {{ post.likes.Likes }}
        </v-btn>
        <v-btn  small @click="showComments=!showComments">
            <v-icon>mdi-message-outline</v-icon>
        </v-btn>
        <v-text-field 
        v-if="showComments"      
        prepend-icon="mdi-message" 
        placeholder="New Comment" 
        v-model="message"
        color="accent" 
        single-line 
        hide-details></v-text-field>
        <v-btn v-if='showComments' @click="addComment(post._id,post.createdBy)">Send</v-btn>
    </v-card-text>
    <v-divider></v-divider>
    <transition >
    <div v-if="showComments">
      <Comments :comments="post.comments"/>   
    </div>
    </transition>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { LIKE_POST } from '@/queries/queries';
import Comments from './Comments.vue';
import Swal from 'sweetalert2'
export default {
  name:'Post',
  data(){
    return{
      showComments:false,
      message:'',
      items: [
        { title: 'Send a message'},
        { title: 'Profile' },
        { title: 'Others' },
      ],
    }
  },
  components:{
    Comments
  },
  props:{
    post:{
        type:Object,
        required:true
    }
  },
  computed:{
    ...mapGetters(['user'])
  },
  methods:{
    async follow(post,fll){
      try{
      await this.$store.dispatch('follow',{userId:this.user._id, usertoFollowId:post.createdBy._id});
      await this.$store.dispatch('addFollowing',{user:post.createdBy,fll})
    }catch(err){
      console.error(err);
    }
    },
    fll(post){
      return this.user.following.peopleFollowing.some(u=>u._id===post.createdBy._id);
    },
    blue(post){
      return post.likes.likedBy.some(u=>u._id===this.user._id);
    },
    deletePost(postId,userId){
      Swal.fire({
    title: 'Are you sure?',
     text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
       }).then((result) => {
  if (result.isConfirmed) {
    this.$store.dispatch('deletePost',{postId,userId});
    Swal.fire(
      'Deleted!',
      'Your file has been deleted.',
      'success'
    )
  }
})
    },
    addComment(postId,userCreator){
      this.$store.dispatch('addComment',{userId:this.user._id,postId,message:this.message});
      this.$socket.emit('comment',{userId:userCreator,userID:this.user._id});
    },
    async addLike(postId,blue,userCreator){
      const variables={
        userId:this.user._id,
        postId:this.post._id
      }
      try {
    const { data } = await this.$apollo.mutate({
      mutation: LIKE_POST,
      variables
    });
    if(!blue){
    this.$socket.emit('like',{userId:userCreator,userID:this.user._id});
  }
    this.$store.dispatch('setLik',{postId,blue});

  } catch (err) {
    console.error(err);
  }
    }
  }
}
</script>

<style>
.expand-y-enter-active,
.expand-y-leave-active {
  transition: all 0.3s;
}
.expand-y-enter,
.expand-y-leave-to {
  transform: translateY(-100%);
}

</style>