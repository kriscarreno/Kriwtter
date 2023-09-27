<template>
    <v-app>
      <v-container fluid>
          <v-layout>
              <v-flex xs7>
                <v-img src="../../assets/welcome3.gif" aspect-ratio="1.3"><h1>Welcome to Creatter!</h1></v-img>
              </v-flex>
  
              <v-flex xs5 class="card-container">
                  <v-layout row wrap>
                      <v-flex xs12 sm6 offset-sm3>
                          <v-card>
                              <v-card-title> 
                                <v-img src="../../assets/logo.jpg" aspect-ratio="2"></v-img>
                              </v-card-title>
                              <v-container>
                                  <v-form
                                  v-model="isValid"
                                  @submit.prevent="signup"
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
                                      required
                                      >
                                      </v-text-field>
                                      <!-- Email input field -->
                                      <v-text-field
                                      v-model="email"
                                      type="text"
                                      :rules="genericRules"
                                      prepend-icon="mdi-email"
                                      label="Email"
                                      required
                                      >
                                      </v-text-field>
                                     
                                      <!-- Password input field -->
                                      <v-text-field
                                      v-model="password"
                                      type="password"
                                      :rules="genericRules"
                                      prepend-icon="mdi-key"
                                      label="Password"
                                      required
                                      >
                                      </v-text-field>

                                       <!-- Password Confirmation input field -->
                                       <v-text-field
                                       v-model="passwordConfirmation"
                                       type="password"
                                       :rules="passwordRules"
                                       prepend-icon="mdi-key"
                                       label="Confirm password"
                                       required
                                       >
                                       </v-text-field>

                                      <v-flex xs12 sm6 offset-sm3>
                                      <v-btn
                                      :disabled="!isValid||loading"
                                      text
                                      type="submit"
                                      color="primary"
                                      >
                                      <v-icon left>mdi-location-enter</v-icon>
                                      Sign up
                                       </v-btn>
                                      </v-flex>
                                      <div style="text-align:center">
                                          <h5>Already have an account?</h5>
                                          <router-link to="/signin"><h5>Sing In</h5></router-link>
                                      </div>
                                  </v-form>
                              </v-container>
                          </v-card>
                      </v-flex>
                  </v-layout>
              </v-flex>
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
          email:"",
          passwordConfirmation:"",
          isValid:false,
          genericRules:[
              v=>!!v||'Este campo es obligatorio',
              v=>v.length<25||'Este campo solo admite 12 caracteres'
          ],
          passwordRules:[
            v=>!!v||"Debe rellenar este campo",
            v=>v.length<25 ||"Debe ser al menos de 5",
            confirmation => confirmation=== this.password||"Password must watch"
        ],
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
        signup(){
          if(this.$refs.form.validate()){
            this.$store.dispatch('createUser',{
                username:this.username,
                email:this.email,
                password:this.password
            });

          }
        }
      }
  }
  </script>
  
  <style scoped>
  .card-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>