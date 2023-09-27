<template>
  <v-app>
    <v-container fluid>
        <v-layout>
            <v-col xs="12" sm="7" md="4" lg="7">
                <v-img src="../../assets/welcome1.gif"  aspect-ratio="1.3"><h1>Welcome to Creatter!</h1></v-img>
               </v-col>

            <v-col xs="12" sm="7" md="4" lg="5" class="card-container">
                <v-layout row wrap>
                    <v-flex xs12 sm6 offset-sm3>
                        
                        <v-card>
                            <v-card-title>
                                <v-img src="../../assets/logo.jpg" aspect-ratio="1"></v-img>
                            </v-card-title>
                            <v-container>
                                <v-form
                                v-model="isValid"
                                @submit.prevent="login"
                                lazy-validation
                                ref="form"
                                >
                                    <!-- Username input field -->
                                    <v-text-field
                                    v-model="username"
                                    type="text"
                                    :rules="genericRules"
                                    prepend-icon="mdi-account"
                                    label="Username"
                                    autocomplete="nope"
                                    >
                                    </v-text-field>
                                    <!-- Password input field -->
                                    <v-text-field
                                    v-model="password"
                                    type="password"
                                    :rules="genericRules"
                                    prepend-icon="mdi-key"
                                    label="Password"
                                    autocomplete="nope"
                                    >
                                    </v-text-field>
                                    <v-flex xs12 sm6 offset-sm3>
                                    <v-btn
                                    text
                                    type="submit"
                                    color="primary"
                                    >
                                    <v-icon left>mdi-location-enter</v-icon>
                                    Sign in
                                     </v-btn>
                                    </v-flex>
                                    <div style="text-align:center">
                                        <h5>Don't have an account?</h5>
                                        <router-link to="/createuser"><h5>Sing Up</h5></router-link>
                                    </div>
                                </v-form>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-col>
        </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
   name:'SignIn',
   data(){
    return{
        username:"",
        password:"",
        isValid:false,
        genericRules:[
            v=>!!v||'Este campo es obligatorio',
            v=>v.length<25||'Este campo solo admite 12 caracteres'
        ]
    }
   },
   computed:{
    ...mapGetters(['user','loading','error'])
   },
   watch:{
        user(value){
            if(value){
                this.$router.push({name:"home"});
            }
        }

    },
    methods:{
        login(){
            if(this.$refs.form.validate())
            this.$store.dispatch('signinUser',{username:this.username,password:this.password});
        }
    }
}
</script>

<style>
.card-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>