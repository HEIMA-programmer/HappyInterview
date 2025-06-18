<template>
  <div class="dashboard-container">
    <!-- 顶部导航栏 -->
    <header class="dashboard-header glass-card">
      <div class="header-left">
        <el-icon :size="24" class="menu-toggle" @click="toggleSidebar">
          <Expand v-if="sidebarCollapsed" />
          <Fold v-else />
        </el-icon>
        <h1 class="app-title">AI面试智能体</h1>
      </div>

      <div class="header-right">
        <el-button text @click="showGuide">
          <el-icon><QuestionFilled /></el-icon>
          使用指南
        </el-button>
        <el-button text @click="showContact">
          <el-icon><Phone /></el-icon>
          联系我们
        </el-button>

        <el-dropdown class="user-dropdown">
          <div class="user-info">
            <el-avatar :size="32" :src="userAvatar">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
            <span class="username">{{ username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="viewProfile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item @click="showSettings">
                <el-icon><Setting /></el-icon>
                账号设置
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="dashboard-body">
      <!-- 侧边栏 -->
      <aside class="dashboard-sidebar glass-card" :class="{ collapsed: sidebarCollapsed }">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="sidebarCollapsed"
          router
        >
          <!-- 您的资料 -->
          <el-sub-menu index="profile">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>您的资料</span>
            </template>
            <el-menu-item index="/dashboard/basic-info">基本资料</el-menu-item>
            <el-menu-item index="/dashboard/resume-manage">管理简历</el-menu-item>
            <el-menu-item index="/dashboard/resume-optimize">优化简历</el-menu-item>
            <el-menu-item index="/dashboard/interview-performance">面试表现</el-menu-item>
          </el-sub-menu>

          <!-- 岗位信息 -->
          <el-sub-menu index="position">
            <template #title>
              <el-icon><Briefcase /></el-icon>
              <span>岗位信息</span>
            </template>
            <el-menu-item index="/dashboard/position/it">互联网IT</el-menu-item>
            <el-menu-item index="/dashboard/position/finance">金融</el-menu-item>
            <el-menu-item index="/dashboard/position/education">教育</el-menu-item>
          </el-sub-menu>

          <!-- 智能面试 -->
          <el-sub-menu index="interview">
            <template #title>
              <el-icon><VideoCamera /></el-icon>
              <span>智能面试</span>
            </template>
            <el-menu-item index="/dashboard/interview-practice">面试练习</el-menu-item>
            <el-menu-item index="/dashboard/interview-simulation">面试模拟</el-menu-item>
            <el-menu-item index="/dashboard/history">历史会话</el-menu-item>
          </el-sub-menu>

          <!-- 学习空间 -->
          <el-sub-menu index="learning">
            <template #title>
              <el-icon><Reading /></el-icon>
              <span>学习空间</span>
            </template>
            <el-menu-item index="/dashboard/knowledge-base">知识库</el-menu-item>
            <el-menu-item index="/dashboard/personalized-learning">个性化提升</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </aside>

      <!-- 主内容区 -->
      <main class="dashboard-main">
        <div class="main-content">
          <!-- 首次显示欢迎页面 -->
          <div v-if="showWelcome" class="welcome-section animate__animated animate__fadeIn">
            <h2 class="welcome-title tech-title">欢迎使用AI面试智能体</h2>
            <p class="welcome-subtitle">让我们开始您的面试提升之旅</p>

            <div class="start-guide glass-card">
              <h3>快速开始指南</h3>
              <div class="guide-steps">
                <div class="guide-step" v-for="(step, index) in guideSteps" :key="index">
                  <div class="step-icon">
                    <el-icon :size="40" :color="step.color">
                      <component :is="step.icon" />
                    </el-icon>
                  </div>
                  <div class="step-content">
                    <h4>{{ step.title }}</h4>
                    <p>{{ step.description }}</p>
                    <el-button
                      type="primary"
                      size="small"
                      @click="navigateTo(step.route)"
                    >
                      {{ step.action }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>

            <div class="quick-stats">
              <div class="stat-card glass-card" v-for="stat in stats" :key="stat.label">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- 路由内容 -->
          <router-view v-else />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardIndex'
}
</script>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UserFilled,
  Briefcase,
  VideoCamera,
  Reading,
  QuestionFilled,
  Phone,
  User,
  Setting,
  SwitchButton,
  ArrowDown,
  Expand,
  Fold,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const sidebarCollapsed = ref(false)
const showWelcome = ref(true)
const username = ref('测试用户')
const userAvatar = ref('')

// 计算属性
const activeMenu = computed(() => route.path)

// 引导步骤
const guideSteps = ref([
  {
    icon: 'DocumentAdd',
    title: '上传简历',
    description: '上传您的简历，获得个性化的面试题库和指导',
    action: '去上传',
    route: '/dashboard/resume-manage',
    color: '#409eff'
  },
  {
    icon: 'VideoCamera',
    title: '开始练习',
    description: '选择练习模式，随时暂停思考，获得AI实时指导',
    action: '开始练习',
    route: '/dashboard/interview-practice',
    color: '#67c23a'
  },
  {
    icon: 'DataAnalysis',
    title: '查看进度',
    description: '通过能力雷达图和历史记录，追踪您的进步',
    action: '查看表现',
    route: '/dashboard/interview-performance',
    color: '#e6a23c'
  }
])

// 统计数据
const stats = ref([
  { value: '0', label: '完成面试' },
  { value: '0%', label: '综合评分' },
  { value: '0', label: '学习天数' }
])

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const showGuide = () => {
  ElMessage.info('使用指南功能开发中...')
}

const showContact = () => {
  ElMessage.info('联系方式：support@ai-interview.com')
}

const viewProfile = () => {
  router.push('/dashboard/basic-info')
}

const showSettings = () => {
  ElMessage.info('账号设置功能开发中...')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('hasProfile')
    ElMessage.success('退出成功')
    router.push('/login')
  } catch {
    // 用户取消
  }
}

const navigateTo = (route) => {
  showWelcome.value = false
  router.push(route)
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  if (newPath !== '/dashboard') {
    showWelcome.value = false
  }
})

// 生命周期
onMounted(() => {
  // 如果直接访问子路由，不显示欢迎页
  if (route.path !== '/dashboard') {
    showWelcome.value = false
  }

  // 加载用户信息
  const userProfile = localStorage.getItem('userProfile')
  if (userProfile) {
    const profile = JSON.parse(userProfile)
    username.value = profile.username || '用户'
  }
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.dashboard-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin: 10px;
  position: sticky;
  top: 10px;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-toggle {
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  color: var(--primary-color);
}

.app-title {
  font-size: 1.2rem;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-dropdown .user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.user-dropdown .user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.username {
  color: var(--text-primary);
}

/* 主体布局 */
.dashboard-body {
  flex: 1;
  display: flex;
  gap: 10px;
  padding: 0 10px 10px;
}

/* 侧边栏 */
.dashboard-sidebar {
  width: 250px;
  transition: width 0.3s ease;
  overflow: hidden;
}

.dashboard-sidebar.collapsed {
  width: 64px;
}

.sidebar-menu {
  background: transparent;
  border: none;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: var(--gradient-tech);
  color: white;
}

/* 主内容区 */
.dashboard-main {
  flex: 1;
  overflow-y: auto;
}

.main-content {
  padding: 20px;
}

/* 欢迎页面 */
.welcome-section {
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.start-guide {
  padding: 40px;
  margin-bottom: 40px;
}

.start-guide h3 {
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  text-align: left;
}

.step-icon {
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.step-content p {
  color: var(--text-secondary);
  margin-bottom: 15px;
  line-height: 1.6;
}

/* 快速统计 */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.stat-label {
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-sidebar {
    position: fixed;
    left: -250px;
    height: 100vh;
    z-index: 1000;
  }

  .dashboard-sidebar:not(.collapsed) {
    left: 0;
  }

  .header-right .el-button-group {
    display: none;
  }

  .guide-steps {
    grid-template-columns: 1fr;
  }
}
</style>
