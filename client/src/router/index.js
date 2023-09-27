import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Signin from '../components/auth/Signin.vue'
import CreateUser from '../components/auth/CreateUser.vue'
import addPost from '../components/post/addPost.vue'
import Profile from '../components/profile/Profile.vue'
import Search from '../components/Search.vue'
import AuthGuard from './AuthGuard'
import ChatView from '../views/ChatView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: AuthGuard
  },
  {
     path:'/search',
     name:'search',
     component:Search,
     beforeEnter: AuthGuard
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: Signin,
  },
  {
    path: '/createuser',
    name: 'CreateUser',
    component: CreateUser,
  },
  {
    path: '/addpost',
    name: 'AddPost',
    component: addPost,
    beforeEnter: AuthGuard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: AuthGuard
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
