import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Dashboard from '../views/Dashboard/index.vue'

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

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasProfile = localStorage.getItem('hasProfile') === 'true'

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else if (!hasProfile && to.name !== 'profileSetup') {
      next('/profile-setup')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
