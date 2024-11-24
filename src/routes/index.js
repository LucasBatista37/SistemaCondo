import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard1 from '../views/avisos.vue';
import Dashboard2 from '../views/assembleia.vue';
import Dashboard3 from '../views/Dashboard3.vue';
import ComingSoon from '../views/encomendas.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { layout: 'no-sidebar' }  // Adiciona uma meta para o layout sem sidebar
    },
    {
      path: '/avisos',
      name: 'Dashboard1',
      component: Dashboard1,
      meta: { requiresAuth: true }
    },
    {
      path: '/assembleia',
      name: 'Dashboard2',
      component: Dashboard2,
      meta: { requiresAuth: true }
    },
    {
      path: '/encomendas',
      name: 'ComingSoon',
      component: ComingSoon,
      meta: { requiresAuth: true }
    }
  ]
});
