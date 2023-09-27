<template>
  <v-container>
    <v-text-field
    flex
    prepend-icon="mdi-magnify"
    placeholder="Search Posts"
    color="accent"
    single-line
    hide-details
    v-model="searchTerm"
    @input="handleSearchPosts "
    >
    </v-text-field>

    <v-row class="fill-height d-flex justify-center align-center">
        <v-col  class="fill-height align-center">

          <div  v-for="post in searchedPost" :key="post._id">
          <Post :post="post"/>
        </div>
          </v-col>
          </v-row>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Post from './post/Post.vue'
export default {
    components:{
        Post
    },
   data(){
    return{
        searchTerm:''
    }
   },
   computed:{
    ...mapGetters(['user','loading','searchedPost'])
   },
   methods:{
    handleSearchPosts(){
        this.$store.dispatch('searchPosts',{searchTerm:this.searchTerm})
    }
   }
}
</script>

<style>

</style>