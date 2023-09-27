<template>
    <v-container>

    <v-card-title>
            <v-avatar>
              <v-img :src="user.avatar"></v-img>
            </v-avatar>
            <v-spacer></v-spacer>
          <h4 >
            {{ userposts.length }}
           </h4>
           <v-subheader>Publicaciones</v-subheader>
           <h4>
            {{ user.followers.Followers }}
           </h4>
           <v-subheader>Seguidores</v-subheader>
           <h4>
            {{ user.following.Following}}
           </h4>
           <v-subheader>Seguidos</v-subheader>
    </v-card-title>
    <v-card-text>
      <h2> {{ user.username }}</h2>
      <br>
      <h3>{{ user.email }}</h3>
    </v-card-text>
    <v-divider></v-divider>
    <v-layout>
      <v-row class="fill-height d-flex justify-center align-center">
        <v-col  class="fill-height align-center">
          <v-btn text to="/addpost" >
            <v-icon color="primary">mdi-plus</v-icon>
            Add Post
          </v-btn>
          <div v-if="!loading">
          <div  v-for="post in userposts" :key="post._id">
          <Post :post="post"/>
          </div>
        </div>
          </v-col>
          </v-row>
    </v-layout>
   
</v-container>
</template>

<script>
import Post from '../post/Post.vue';
import { mapGetters } from 'vuex'
export default {
  components:{
    Post
  },
   computed:{
    ...mapGetters(['user','userposts','loading'])
   },
   mounted(){
    this.$store.dispatch('getPostsByUser',this.user._id);
   }
}
</script>

<style scoped>
.v-img-avatar {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  object-fit: cover;
}
</style>