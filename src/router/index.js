import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/home'
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
    }
  ]
})
