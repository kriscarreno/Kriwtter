<template>
  <v-container  grid-list-md >
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
          <v-container fill-height>
              <v-layout row justify-center align-center>
                  <v-progress-circular indeterminate :size="70" :width="7" color="secondary">

                  </v-progress-circular>
              </v-layout>
          </v-container>
      </v-dialog>
  </v-layout>
    <v-row class="fill-height d-flex justify-center align-center">
        <v-col  class="fill-height align-center">
          <v-btn text to="/addpost" >
            <v-icon color="primary">mdi-plus</v-icon>
            Add Post
          </v-btn>
          <div v-if="!loading">
          <div  v-for="post in posts" :key="post._id">
          <Post :post="post"/>
          </div>
        </div>
          </v-col>
          </v-row>
          </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import Post from '../components/post/Post.vue'
  export default {
    name: 'home',
    created(){
       this.startPosts();
    },
    computed:{
      ...mapGetters(['user','posts','loading'])
    },
    components: {
      Post
    },
    methods:{
      startPosts(){
        this.$store.dispatch('getPosts');
      }
    }
  }
</script>
