// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import Cookies from 'js-cookie'

Vue.config.productionTip = false
Vue.use(ViewUI)

const whiteList = ['/login']  //白名单，不需要登录的路由

router.beforeEach((to, from, next) => {
    //判断该路由是否需要登录权限
    if (Cookies.get('token')) {
        //如果已经登录
        if (to.path === '/login') {
            next({path: '/'});
        } else {
            next();
        }
    } else if (whiteList.indexOf(to.path) !== -1) {
        next();
    } else {
        //没登录则跳转登录
        next('/login');
    }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
