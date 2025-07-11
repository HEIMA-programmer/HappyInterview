import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user'; // 引入Pinia store
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import Dashboard from '../views/Dashboard/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profile-setup',
      name: 'profileSetup',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'basic-info',
          name: 'basicInfo',
          component: () => import('../views/Dashboard/components/BasicInfo.vue')
        },
        {
          path: 'resume-manage',
          name: 'resumeManage',
          component: () => import('../views/Dashboard/components/ResumeManage.vue')
        },
        {
          path: 'resume-optimize',
          name: 'resumeOptimize',
          component: () => import('../views/Dashboard/components/ResumeOptimize.vue')
        },
        {
          path: 'interview-performance',
          name: 'interviewPerformance',
          component: () => import('../views/Dashboard/components/InterviewPerformance.vue')
        },
        {
          path: 'position/:type',
          name: 'positionInfo',
          component: () => import('../views/Dashboard/components/PositionInfo.vue')
        },
        {
          path: 'interview-practice',
          name: 'interviewPractice',
          component: () => import('../views/Dashboard/components/InterviewPractice.vue')
        },
        {
          path: 'interview-simulation',
          name: 'interviewSimulation',
          component: () => import('../views/Dashboard/components/InterviewSimulation.vue')
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('../views/Dashboard/components/History.vue')
        },
        {
          path: 'knowledge-base',
          name: 'knowledgeBase',
          component: () => import('../views/Dashboard/components/KnowledgeBase.vue')
        },
        {
          path: 'personalized-learning',
          name: 'personalizedLearning',
          component: () => import('../views/Dashboard/components/PersonalizedLearning.vue')
        }
      ]
    }
  ]
})

// 全局前置路由守卫
router.beforeEach(async (to, from, next) => {
  // 获取用户状态，必须在守卫函数内部获取，以确保Pinia已初始化
  const userStore = useUserStore();

  const isAuthenticated = userStore.isAuthenticated;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // 如果用户信息还未加载，并且存在token，则尝试加载
  if (isAuthenticated && !userStore.userInfo) {
    await userStore.fetchUserOnLoad();
  }

  const hasProfile = userStore.hasProfile;

  if (requiresAuth) {
    // 1. 如果路由需要认证
    if (!isAuthenticated) {
      // 1.1 用户未登录，重定向到登录页
      next({ name: 'login', query: { redirect: to.fullPath } });
    } else {
      // 1.2 用户已登录
      if (!hasProfile && to.name !== 'profileSetup') {
        // 1.2.1 未完善资料，且目标不是资料页，强制跳转到资料页
        next({ name: 'profileSetup' });
      } else if (hasProfile && to.name === 'profileSetup') {
        // 1.2.2 已完善资料，但试图访问资料页，跳转到主面板
        next({ name: 'dashboard' });
      } else {
        // 1.2.3 其他情况（已登录，资料状态也符合目标路由），正常放行
        next();
      }
    }
  } else {
    // 2. 如果路由不需要认证
    // 如果用户已登录且已完善资料，访问登录页时，直接跳转到主面板
    if (isAuthenticated && hasProfile && to.name === 'login') {
      next({ name: 'dashboard' });
    } else {
      // 2.2 其他情况（未登录访问公开页等），正常放行
      next();
    }
  }
});

export default router
