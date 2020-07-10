import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
import BlogSharing from '@/components/blogSharing'
import Course from '@/components/course'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
          {
              path: '/blogSharing',
              name: 'BlogSharing',
              component: BlogSharing
          },
          {
            path: '/course',
            name: 'Course',
            component: Course
          }
      ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
  ]
})
