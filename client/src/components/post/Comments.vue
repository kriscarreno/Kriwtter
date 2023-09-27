<template>
  <div class="comments-container">
    <v-container>
        <v-list v-for="comment in comments" :key="comment._id">
            <v-list-item-avatar>
              <v-img :src="comment.messageUser.avatar"></v-img>
            </v-list-item-avatar>
            {{ comment.messageUser.username }}
            <v-list-item-content>
                <v-list-item-title>
                {{ comment.messageBody }}
            </v-list-item-title>
            <v-list-item-subtitle>{{comment.messageDate}}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list>
    </v-container>

  </div>
</template>

<script>
export default {
   props:{
     comments:{
        type:Array,
        required:true
     },
   }
}
</script>

<style>
  .comments-container {
    max-height: 250px;
    overflow-y: auto;
  }
</style>