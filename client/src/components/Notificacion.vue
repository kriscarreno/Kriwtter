<template>
  <div>
  <v-card class="custom-card" @click="gotoLink" >
    <v-avatar>
      <v-img :src="Notification.avatar"></v-img>
    </v-avatar>
    <v-card-text>
      <v-icon color="primary">{{Notification.icon}}</v-icon>{{ Notification.message }}
    </v-card-text>
  </v-card>
</div>
</template>

<script>
export default{
    props: {
    Notification: {
      type: Object,
      required: true,
    },
  },
   methods: {
    gotoLink(){
      if (this.$route.name !== this.Notification.link){
        this.$router.push({ name: this.Notification.link }).catch(() => {});
    }
  }
   }
}
</script>

<style scoped>
.custom-card {
  border: none;
  
}

.custom-border {
  border-top: 10px solid;
  margin-bottom: 16px;
}
</style>