<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <nav class="navbar glass-card">
      <div class="nav-content">
        <div class="logo">
          <el-icon :size="30"><Monitor /></el-icon>
          <span class="logo-text">AI面试智能体</span>
        </div>
        <div class="nav-links">
          <a href="#features" class="nav-link">功能特点</a>
          <a href="#advantages" class="nav-link">核心优势</a>
          <a href="#process" class="nav-link">使用流程</a>
          <router-link to="/login" class="nav-link login-btn">登录/注册</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero区域 -->
    <section class="hero-section">
      <div class="hero-content animate__animated animate__fadeIn">
        <h1 class="hero-title">
          <span class="gradient-text">AI驱动的</span>
          <br />
          多模态面试评测系统
        </h1>
        <p class="hero-subtitle">
          通过语音、视频、文本多维度分析，提供专业面试指导
          <br />
          助力高校学生提升面试能力，成功获得理想offer
        </p>
        <router-link to="/login" class="hero-btn tech-button"> 立即使用 </router-link>
      </div>
      <div class="hero-visual">
        <div class="floating-card card-1 glass-card hover-float">
          <el-icon :size="40"><Microphone /></el-icon>
          <p>语音分析</p>
        </div>
        <div class="floating-card card-2 glass-card hover-float">
          <el-icon :size="40"><VideoCamera /></el-icon>
          <p>表情识别</p>
        </div>
        <div class="floating-card card-3 glass-card hover-float">
          <el-icon :size="40"><Document /></el-icon>
          <p>内容评测</p>
        </div>
      </div>
    </section>

    <!-- 功能特点 -->
    <section id="features" class="features-section">
      <h2 class="section-title tech-title">核心功能</h2>
      <div class="features-grid">
        <div
          class="feature-card glass-card hover-float"
          v-for="(feature, index) in features"
          :key="index"
          :class="{ 'animate__animated animate__fadeInUp': isFeatureVisible }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <el-icon :size="50" :color="feature.color">
            <component :is="feature.icon" />
          </el-icon>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- 优势展示 -->
    <section id="advantages" class="advantages-section">
      <h2 class="section-title tech-title">为什么选择我们</h2>
      <div class="advantages-content">
        <div
          class="advantage-item"
          v-for="(advantage, index) in advantages"
          :key="index"
          :class="{ 'animate__animated animate__fadeInLeft': isAdvantageVisible }"
        >
          <div class="advantage-number">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="advantage-info">
            <h3>{{ advantage.title }}</h3>
            <p>{{ advantage.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用流程 -->
    <section id="process" class="process-section">
      <h2 class="section-title tech-title">简单四步，开启面试之旅</h2>
      <div class="process-timeline">
        <div
          class="process-item"
          v-for="(step, index) in processSteps"
          :key="index"
          :class="{ 'animate__animated animate__fadeInRight': isProcessVisible }"
        >
          <div class="process-number">{{ index + 1 }}</div>
          <div class="process-content glass-card">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 AI面试智能体. All rights reserved.</p>
        <p>Powered by 讯飞星火大模型</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Monitor, Microphone, VideoCamera, Document } from '@element-plus/icons-vue'

// 功能特点数据
const features = ref([
  {
    icon: 'VideoCamera',
    title: '多模态分析',
    description: '综合分析语音、表情、肢体语言等多维度数据',
    color: '#409eff',
  },
  {
    icon: 'TrendCharts',
    title: '智能评测',
    description: '五维能力雷达图，精准定位优势与不足',
    color: '#67c23a',
  },
  {
    icon: 'School',
    title: '个性化学习',
    description: '基于评测结果，提供定制化提升方案',
    color: '#e6a23c',
  },
  {
    icon: 'Timer',
    title: '实时反馈',
    description: '练习模式即时指导，快速提升面试技巧',
    color: '#f56c6c',
  },
])

// 优势数据
const advantages = ref([
  {
    title: '讯飞AI技术支持',
    description: '基于讯飞星火大模型，提供专业的语音识别和情感分析能力',
  },
  {
    title: '真实面试场景',
    description: '覆盖互联网、金融、教育等多个行业的典型面试场景',
  },
  {
    title: '全方位能力评估',
    description: '从专业知识、表达能力、逻辑思维等多个维度综合评价',
  },
  {
    title: '持续进步追踪',
    description: '记录每次面试表现，可视化展示能力提升轨迹',
  },
])

// 使用流程
const processSteps = ref([
  {
    title: '注册登录',
    description: '创建账号，完善个人信息',
  },
  {
    title: '上传简历',
    description: '上传个人简历，获得个性化面试题库',
  },
  {
    title: '模拟面试',
    description: '选择岗位类型，开始AI面试官对话',
  },
  {
    title: '查看报告',
    description: '获取详细评测报告和改进建议',
  },
])

// 滚动动画控制
const isFeatureVisible = ref(false)
const isAdvantageVisible = ref(false)
const isProcessVisible = ref(false)

const handleScroll = () => {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight

  // 检查各部分是否进入视口
  const featureSection = document.getElementById('features')
  const advantageSection = document.getElementById('advantages')
  const processSection = document.getElementById('process')

  if (featureSection && featureSection.offsetTop - windowHeight + 100 < scrollY) {
    isFeatureVisible.value = true
  }

  if (advantageSection && advantageSection.offsetTop - windowHeight + 100 < scrollY) {
    isAdvantageVisible.value = true
  }

  if (processSection && processSection.offsetTop - windowHeight + 100 < scrollY) {
    isProcessVisible.value = true
  }
}

// 平滑滚动
const smoothScroll = (e) => {
  e.preventDefault()
  const targetId = e.target.getAttribute('href')
  const targetElement = document.querySelector(targetId)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // 添加平滑滚动
  const navLinks = document.querySelectorAll('a[href^="#"]')
  navLinks.forEach((link) => {
    link.addEventListener('click', smoothScroll)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: var(--bg-primary);
  overflow-x: hidden;
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  z-index: 1000;
  padding: 15px 30px;
  transition: all 0.3s ease;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  background: var(--gradient-tech);
  background-clip: text;
  background-clip: text;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-tech);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link:hover::after {
  width: 100%;
}

.login-btn {
  padding: 8px 20px;
  background: var(--gradient-tech);
  border-radius: 20px;
  color: white !important;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
}

/* Hero区域 */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  position: relative;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 30px;
}

.gradient-text {
  background: var(--gradient-tech);
  background-clip: text;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 40px;
}

.hero-btn {
  display: inline-block;
  font-size: 1.1rem;
  text-decoration: none;
}

.hero-visual {
  flex: 1;
  position: relative;
  height: 500px;
}

.floating-card {
  position: absolute;
  padding: 30px;
  text-align: center;
  cursor: pointer;
}

.floating-card p {
  margin-top: 10px;
  font-size: 14px;
  color: var(--text-secondary);
}

.card-1 {
  top: 50px;
  right: 100px;
  animation: float 3s ease-in-out infinite;
}

.card-2 {
  top: 200px;
  right: 250px;
  animation: float 3s ease-in-out infinite 0.5s;
}

.card-3 {
  bottom: 100px;
  right: 150px;
  animation: float 3s ease-in-out infinite 1s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 功能特点 */
.features-section {
  padding: 100px 5%;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card h3 {
  margin: 20px 0 15px;
  font-size: 1.3rem;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 优势展示 */
.advantages-section {
  padding: 100px 5%;
  background: var(--bg-secondary);
}

.advantages-content {
  max-width: 800px;
  margin: 0 auto;
}

.advantage-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 30px;
}

.advantage-number {
  font-size: 3rem;
  font-weight: bold;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.advantage-info h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.advantage-info p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 使用流程 */
.process-section {
  padding: 100px 5%;
  text-align: center;
}

.process-timeline {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  text-align: left;
  padding-left: 80px;
}

.process-timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  transform: translateX(0);
  width: 2px;
  height: 100%;
  background: var(--gradient-tech);
}

.process-item {
  display: flex;
  align-items: center;
  margin-bottom: 60px;
  position: relative;
}

.process-item:nth-child(even) {
  flex-direction: row;
}

.process-number {
  width: 60px;
  height: 60px;
  background: var(--gradient-tech);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  position: absolute;
  left: 0;
  transform: translateX(-50%);
  margin-left: 30px;
  z-index: 1;
}

.process-content {
  flex: 1;
  padding: 30px;
  margin-left: 80px;
  margin-right: 0;
}

.process-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.process-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 页脚 */
.footer {
  padding: 50px 0;
  background: var(--bg-secondary);
  text-align: center;
}

.footer-content p {
  color: var(--text-secondary);
  margin-bottom: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding-top: 100px;
  }

  .hero-visual {
    display: none;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .process-timeline {
    padding-left: 60px; /* 手机端也调整 padding-left，略小于桌面端 */
  }

  .process-timeline::before {
    left: 20px; /* 手机端时间轴更靠近左边，与 process-number 对齐 */
  }

  .process-item,
  .process-item:nth-child(even) {
    flex-direction: row; /* 确保在手机端也始终是数字在左，内容在右 */
  }

  .process-number {
    left: 0;
    transform: translateX(-50%);
    margin-left: 20px; /* 根据手机端时间轴的left调整此值，使数字中心与轴重合 */
  }

  .process-content {
    margin-left: 70px; /* 手机端内容左边距调整，确保与数字有间隔 */
    margin-right: 0;
  }
}
</style>
