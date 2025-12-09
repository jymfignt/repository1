import { createRouter, createWebHistory } from 'vue-router';
import GamePage from '../views/GamePage.vue';
import EndingPage from '../views/EndingPage.vue';
import HomePage from '../views/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: '理想工作模拟器 - 首页'
    }
  },
  {
    path: '/game',
    name: 'Game',
    component: GamePage,
    meta: {
      title: '理想工作模拟器 - 游戏进行中'
    }
  },
  {
    path: '/ending',
    name: 'Ending',
    component: EndingPage,
    meta: {
      title: '理想工作模拟器 - 游戏结局'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export default router;
