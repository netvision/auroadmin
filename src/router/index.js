import VueRouter from 'vue-router'
import Vue from 'vue'
import Home from '../views/Home'
import Auth from '../views/Auth'
import Admin from '../views/Admin'
import StudySessions from '../views/StudySessions'
import TheClass from '../views/TheClass'
import Quote from '../views/Quote'
import Farm from '../views/Farm'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'StudySessions',
    component: StudySessions,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/farm',
    name: 'Farm',
    component: Farm
  },
  {
    path: '/quote',
    name: 'Quote',
    component: Quote,
    meta: {
      requiresAuth: true
    }
   
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  
  {
    path: '/theclass',
    name: 'TheClass',
    component: TheClass,
    props:true,
    meta: {
      requiresAuth: true
    }
  },

]

const router = new VueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user;
    Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then(data => {
      if (data && data.signInUserSession) {
        user = data;
      }
      next()
    }).catch((e) => {
      next({
        path: '/auth'
      });
    });
  }
  next()
})

export default router
