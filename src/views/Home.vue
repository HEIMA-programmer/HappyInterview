<template>
  <div class="home-container">
    <!-- 粒子背景 -->
    <div id="particles-bg"></div>

    <!-- 导航栏 -->
    <nav class="navbar glass-card" :class="{ scrolled: isScrolled }">
      <div class="nav-content">
        <div class="logo" @click="scrollToTop">
          <div class="logo-icon">
            <el-icon :size="30"><Monitor /></el-icon>
          </div>
          <span class="logo-text">AI面试智能体</span>
        </div>
        <div class="nav-links">
          <a href="#features" class="nav-link">功能特点</a>
          <a href="#advantages" class="nav-link">核心优势</a>
          <a href="#process" class="nav-link">使用流程</a>
          <router-link to="/login" class="nav-link login-btn glow-btn">
            <span>登录/注册</span>
          </router-link>
        </div>
        <div class="nav-toggle" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>

    <!-- Hero区域 -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="grid-overlay"></div>
        <div class="gradient-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="hero-text animate__animated animate__fadeIn">
          <div class="hero-badge">
            <el-icon><Trophy /></el-icon>
            <span>2024最佳AI面试产品</span>
          </div>
          <h1 class="hero-title">
            <span class="title-line">
              <span class="gradient-text">AI驱动的</span>
            </span>
            <span class="title-line">
              <span class="typing-text">{{ typedText }}</span>
              <span class="cursor">|</span>
            </span>
          </h1>
          <p class="hero-subtitle">
            通过语音、视频、文本多维度分析，提供专业面试指导
            <br />
            <span class="highlight">已帮助 <CountUp :end="17000" /> 名学生成功获得理想offer</span>
          </p>
          <div class="hero-actions">
            <router-link to="/login" class="hero-btn primary-btn">
              <span>立即体验</span>
              <el-icon><Right /></el-icon>
            </router-link>
            <button class="hero-btn secondary-btn" @click="playDemo">
              <el-icon><VideoPlay /></el-icon>
              <span>观看演示</span>
            </button>
          </div>

          <!-- 统计数据 -->
          <div class="hero-stats">
            <div class="stat-item" v-for="stat in heroStats" :key="stat.label">
              <div class="stat-number">
                <CountUp :end="stat.value" :suffix="stat.suffix" />
              </div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <!-- 3D场景容器 -->
          <div ref="threeContainer" class="three-container"></div>

          <!-- 悬浮卡片 -->
          <div class="floating-cards">
            <div
              v-for="(card, index) in floatingCards"
              :key="index"
              class="floating-card glass-card"
              :class="`card-${index + 1}`"
              :style="{ animationDelay: `${index * 0.2}s` }"
            >
              <el-icon :size="40" :color="card.color">
                <component :is="card.icon" />
              </el-icon>
              <p>{{ card.text }}</p>
              <div class="card-glow" :style="{ background: card.color }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div class="scroll-indicator">
        <el-icon :size="24"><ArrowDown /></el-icon>
      </div>
    </section>

    <!-- 功能特点 -->
    <section id="features" class="features-section">
      <div class="section-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
      </div>

      <div class="section-content">
        <div class="section-header">
          <span class="section-tag">FEATURES</span>
          <h2 class="section-title">
            <span class="gradient-text">核心功能</span>
          </h2>
          <p class="section-desc">全方位提升您的面试能力</p>
        </div>

        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card glass-card"
            :class="{ 'animate__animated animate__fadeInUp': isFeatureVisible }"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @mouseenter="featureHover = index"
            @mouseleave="featureHover = null"
          >
            <div class="feature-icon">
              <div class="icon-bg" :style="{ background: feature.color }"></div>
              <el-icon :size="50">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <div class="feature-hover" v-show="featureHover === index">
              <ul>
                <li v-for="(point, i) in feature.details" :key="i">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 优势展示 -->
    <section id="advantages" class="advantages-section">
      <div class="advantages-container">
        <div class="section-header">
          <span class="section-tag">ADVANTAGES</span>
          <h2 class="section-title">
            <span class="gradient-text">为什么选择我们</span>
          </h2>
        </div>

        <div class="advantages-content">
          <div class="advantages-left">
            <div
              v-for="(advantage, index) in advantages"
              :key="index"
              class="advantage-item"
              :class="{
                active: activeAdvantage === index,
                'animate__animated animate__fadeInLeft': isAdvantageVisible,
              }"
              @click="activeAdvantage = index"
            >
              <div class="advantage-number">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="advantage-info">
                <h3>{{ advantage.title }}</h3>
                <p>{{ advantage.description }}</p>
              </div>
              <el-icon class="advantage-arrow"><ArrowRight /></el-icon>
            </div>
          </div>

          <div class="advantages-right">
            <div class="advantage-display glass-card">
              <div class="display-content" v-if="advantages[activeAdvantage]">
                <el-icon :size="60" :color="advantages[activeAdvantage].color">
                  <component :is="advantages[activeAdvantage].icon" />
                </el-icon>
                <h3>{{ advantages[activeAdvantage].title }}</h3>
                <p>{{ advantages[activeAdvantage].detail }}</p>
                <div class="tech-tags">
                  <span v-for="tag in advantages[activeAdvantage].tags" :key="tag" class="tech-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据展示 -->
    <section class="data-section">
      <div class="data-bg">
      </div>
      <div class="data-content">
        <h2 class="section-title">
          <span class="gradient-text">真实数据说话</span>
        </h2>
        <div class="data-grid">
          <div
            v-for="(data, index) in dataStats"
            :key="index"
            class="data-card glass-card"
            :class="{ 'animate__animated animate__zoomIn': isDataVisible }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="data-icon">
              <el-icon :size="40" :color="data.color">
                <component :is="data.icon" />
              </el-icon>
            </div>
            <div class="data-number">
              <CountUp
                :end="data.value"
                :suffix="data.suffix"
                :duration="2.5"
                v-if="isDataVisible"
              />
              <span v-else>0</span>
            </div>
            <div class="data-label">{{ data.label }}</div>
            <div class="data-progress">
              <div
                class="progress-bar"
                :style="{ width: data.progress + '%', background: data.color }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用流程 -->
    <section id="process" class="process-section">
      <div class="section-header">
        <span class="section-tag">PROCESS</span>
        <h2 class="section-title">
          <span class="gradient-text">简单四步，开启面试之旅</span>
        </h2>
      </div>

      <div class="process-container">
        <div class="process-line">
          <div class="line-progress" :style="{ width: processProgress + '%' }"></div>
        </div>

        <div class="process-steps">
          <div
            v-for="(step, index) in processSteps"
            :key="index"
            class="process-step"
            :class="{
              active: currentStep >= index,
              'animate__animated animate__fadeInUp': isProcessVisible,
            }"
            :style="{ animationDelay: `${index * 0.2}s` }"
            @click="currentStep = index"
          >
            <div class="step-icon">
              <div class="icon-circle">
                <span>{{ index + 1 }}</span>
              </div>
            </div>
            <div class="step-content glass-card">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
              <div class="step-image">
                <el-icon :size="80" :color="step.color">
                  <component :is="step.icon" />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta-section">
      <div class="cta-bg">
        <div class="cta-pattern"></div>
      </div>
      <div class="cta-content">
        <h2 class="cta-title">准备好提升您的面试能力了吗？</h2>
        <p class="cta-subtitle">加入数万名成功学员，开启您的职业发展之路</p>
        <div class="cta-actions">
          <router-link to="/login" class="cta-btn primary">
            <span>免费试用</span>
            <el-icon><Right /></el-icon>
          </router-link>
          <button class="cta-btn secondary" @click="showContact">
            <el-icon><Phone /></el-icon>
            <span>联系我们</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-section">
            <h4>产品</h4>
            <ul>
              <li><a href="#">功能介绍</a></li>
              <li><a href="#">使用教程</a></li>
              <li><a href="#">价格方案</a></li>
              <li><a href="#">更新日志</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>资源</h4>
            <ul>
              <li><a href="#">面试题库</a></li>
              <li><a href="#">学习资料</a></li>
              <li><a href="#">成功案例</a></li>
              <li><a href="#">博客文章</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>支持</h4>
            <ul>
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">联系客服</a></li>
              <li><a href="#">意见反馈</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>关于</h4>
            <ul>
              <li><a href="#">关于我们</a></li>
              <li><a href="#">加入我们</a></li>
              <li><a href="#">隐私政策</a></li>
              <li><a href="#">服务条款</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 AI面试智能体. All rights reserved.</p>
          <p>Powered by 讯飞星火大模型</p>
        </div>
      </div>
    </footer>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ active: mobileMenuOpen }">
      <div class="mobile-menu-content">
        <a href="#features" @click="closeMobileMenu">功能特点</a>
        <a href="#advantages" @click="closeMobileMenu">核心优势</a>
        <a href="#process" @click="closeMobileMenu">使用流程</a>
        <router-link to="/login" @click="closeMobileMenu">登录/注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as THREE from 'three'
import CountUp from '@/components/CountUp.vue'
import {
  Monitor,
  Trophy,
  Right,
  ArrowDown,
  VideoPlay,
  ArrowRight,
  Phone,
} from '@element-plus/icons-vue'

// 响应式数据
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const typedText = ref('')
const featureHover = ref(null)
const activeAdvantage = ref(0)
const currentStep = ref(0)
const processProgress = computed(() => ((currentStep.value + 1) / processSteps.value.length) * 100)

// 可见性状态
const isFeatureVisible = ref(false)
const isAdvantageVisible = ref(false)
const isProcessVisible = ref(false)
const isDataVisible = ref(false)

// Three.js相关
const threeContainer = ref(null)
let scene, camera, renderer, particles

// 打字机文本
const typingTexts = ['多模态面试评测系统', '智能面试辅导平台', '个性化能力提升方案']
let textIndex = 0
let charIndex = 0
let isDeleting = false

// 统计数据
const heroStats = ref([
  { value: 300, suffix: '%+', label: '面试通过率提升' },
  { value: 17000, suffix: '+', label: '成功学员' },
  { value: 30, suffix: '%+', label: '薪资涨幅' },
])

// 悬浮卡片
const floatingCards = ref([
  { icon: 'Microphone', text: '语音分析', color: '#409eff' },
  { icon: 'VideoCamera', text: '表情识别', color: '#67c23a' },
  { icon: 'Document', text: '内容评测', color: '#e6a23c' },
])

// 功能特点数据
const features = ref([
  {
    icon: 'VideoCamera',
    title: '多模态分析',
    description: '综合分析语音、表情、肢体语言等多维度数据',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    details: ['实时语音识别', '微表情分析', '肢体语言评估', '眼神接触检测'],
  },
  {
    icon: 'TrendCharts',
    title: '智能评测',
    description: '五维能力雷达图，精准定位优势与不足',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    details: ['专业知识评估', '表达能力分析', '逻辑思维测评', '应变能力考察'],
  },
  {
    icon: 'School',
    title: '个性化学习',
    description: '基于评测结果，提供定制化提升方案',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    details: ['智能推荐课程', '弱项专项训练', '进度实时追踪', '学习路径优化'],
  },
  {
    icon: 'Timer',
    title: '实时反馈',
    description: '练习模式即时指导，快速提升面试技巧',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    details: ['AI实时点评', '语速节奏提醒', '答题思路引导', '压力应对建议'],
  },
])

// 优势数据
const advantages = ref([
  {
    title: '讯飞AI技术支持',
    description: '基于讯飞星火大模型，提供专业的语音识别和情感分析能力',
    detail:
      '采用业界领先的讯飞星火大模型，结合深度学习算法，实现高精度的语音识别、情感分析和智能对话。支持多种方言和口音，识别准确率达98%以上。',
    icon: 'Platform',
    color: '#409eff',
    tags: ['星火大模型', '98%准确率', '多语言支持', '实时处理'],
  },
  {
    title: '真实面试场景',
    description: '覆盖互联网、金融、教育等多个行业的典型面试场景',
    detail:
      '收录了来自字节跳动、阿里巴巴、腾讯等500+知名企业的真实面试题，涵盖技术面、HR面、群面等多种面试形式，让练习更贴近实战。',
    icon: 'Connection',
    color: '#67c23a',
    tags: ['500+企业题库', '多场景覆盖', '实时更新', '行业细分'],
  },
  {
    title: '全方位能力评估',
    description: '从专业知识、表达能力、逻辑思维等多个维度综合评价',
    detail:
      '独创五维评估模型，通过AI深度分析面试表现，生成详细的能力雷达图。每个维度都有具体的提升建议，帮助你全面提升面试竞争力。',
    icon: 'TrendCharts',
    color: '#e6a23c',
    tags: ['五维模型', '深度分析', '可视化报告', '个性建议'],
  },
  {
    title: '持续进步追踪',
    description: '记录每次面试表现，可视化展示能力提升轨迹',
    detail:
      '智能记录每次练习数据，通过大数据分析展示能力成长曲线。支持历史回放功能，对比不同时期的表现，让进步看得见。',
    icon: 'Promotion',
    color: '#f56c6c',
    tags: ['数据追踪', '成长曲线', '历史回放', '进步可视化'],
  },
])

// 数据统计
const dataStats = ref([
  { icon: 'User', value: 17589, suffix: '+', label: '累计用户', color: '#409eff', progress: 88 },
  {
    icon: 'VideoCamera',
    value: 92847,
    suffix: '+',
    label: '模拟面试',
    color: '#67c23a',
    progress: 92,
  },
  { icon: 'Trophy', value: 4.8, suffix: '/5', label: '用户评分', color: '#e6a23c', progress: 96 },
  { icon: 'TrendCharts', value: 89, suffix: '%', label: '满意度', color: '#f56c6c', progress: 89 },
])

// 使用流程
const processSteps = ref([
  {
    title: '注册登录',
    description: '创建账号，完善个人信息',
    icon: 'User',
    color: '#409eff',
  },
  {
    title: '上传简历',
    description: '上传个人简历，获得个性化面试题库',
    icon: 'DocumentAdd',
    color: '#67c23a',
  },
  {
    title: '模拟面试',
    description: '选择岗位类型，开始AI面试官对话',
    icon: 'VideoCamera',
    color: '#e6a23c',
  },
  {
    title: '查看报告',
    description: '获取详细评测报告和改进建议',
    icon: 'DataAnalysis',
    color: '#f56c6c',
  },
])

// 打字机效果
const typeWriter = () => {
  const currentText = typingTexts[textIndex]

  if (!isDeleting && charIndex < currentText.length) {
    typedText.value = currentText.substring(0, charIndex + 1)
    charIndex++
    setTimeout(typeWriter, 100)
  } else if (isDeleting && charIndex > 0) {
    typedText.value = currentText.substring(0, charIndex - 1)
    charIndex--
    setTimeout(typeWriter, 50)
  } else if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true
    setTimeout(typeWriter, 2000)
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    textIndex = (textIndex + 1) % typingTexts.length
    setTimeout(typeWriter, 500)
  }
}

// 初始化Three.js场景
const initThreeScene = () => {
  if (!threeContainer.value) return

  // 创建场景
  scene = new THREE.Scene()

  // 创建相机
  const width = threeContainer.value.clientWidth
  const height = threeContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  threeContainer.value.appendChild(renderer.domElement)

  // 创建粒子
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 1000
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: '#4a90e2',
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  })

  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  // 动画
  const animate = () => {
    requestAnimationFrame(animate)
    particles.rotation.x += 0.001
    particles.rotation.y += 0.001
    renderer.render(scene, camera)
  }
  animate()

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    if (!threeContainer.value) return
    const width = threeContainer.value.clientWidth
    const height = threeContainer.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  })
}

// 滚动处理
const handleScroll = () => {
  const scrollY = window.scrollY
  isScrolled.value = scrollY > 50

  const windowHeight = window.innerHeight

  // 检查各部分是否进入视口
  const featureSection = document.getElementById('features')
  const advantageSection = document.getElementById('advantages')
  const processSection = document.getElementById('process')
  const dataSection = document.querySelector('.data-section')

  if (featureSection && featureSection.offsetTop - windowHeight + 100 < scrollY) {
    isFeatureVisible.value = true
  }

  if (advantageSection && advantageSection.offsetTop - windowHeight + 100 < scrollY) {
    isAdvantageVisible.value = true
  }

  if (processSection && processSection.offsetTop - windowHeight + 100 < scrollY) {
    isProcessVisible.value = true
  }

  if (dataSection && dataSection.offsetTop - windowHeight + 100 < scrollY) {
    isDataVisible.value = true
  }
}

// 移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 播放演示
const playDemo = () => {
  ElMessage.info('演示视频功能开发中...')
}

// 显示联系方式
const showContact = () => {
  ElMessage.info('联系方式：support@ai-interview.com')
}

// 生命周期
onMounted(() => {
  // 开始打字机效果
  typeWriter()

  // 初始化Three.js
  setTimeout(() => {
    initThreeScene()
  }, 100)

  // 监听滚动
  window.addEventListener('scroll', handleScroll)

  // 添加平滑滚动
  const navLinks = document.querySelectorAll('a[href^="#"]')
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.getAttribute('href')
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
/* 基础样式 */
.home-container {
  min-height: 100vh;
  background: var(--bg-primary);
  overflow-x: hidden;
  position: relative;
}

/* 粒子背景 */
#particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 导航栏 */
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
  backdrop-filter: blur(10px);
}

.navbar.scrolled {
  top: 10px;
  padding: 10px 25px;
  background: rgba(10, 14, 39, 0.9);
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
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  width: 45px;
  height: 45px;
  background: var(--gradient-tech);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
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
  position: relative;
  transition: color 0.3s ease;
  font-weight: 500;
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
  padding: 10px 25px;
  background: var(--gradient-tech);
  border-radius: 25px;
  color: white !important;
  position: relative;
  overflow: hidden;
}

.glow-btn {
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
  }
  to {
    box-shadow:
      0 0 30px rgba(64, 158, 255, 0.8),
      0 0 40px rgba(64, 158, 255, 0.5);
  }
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.nav-toggle span {
  width: 25px;
  height: 2px;
  background: var(--text-primary);
  transition: all 0.3s ease;
}

/* Hero区域 */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 5%;
  z-index: 10;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(64, 158, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 158, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 50%, rgba(64, 158, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(103, 194, 58, 0.1) 0%, transparent 50%);
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 60px;
}

.hero-text {
  flex: 1;
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  color: #ffd700;
  font-size: 14px;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.hero-title {
  font-size: 4rem;
  line-height: 1.2;
  margin-bottom: 30px;
  font-weight: 800;
}

.title-line {
  display: block;
  margin-bottom: 10px;
}

.typing-text {
  color: var(--text-primary);
  position: relative;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 40px;
}

.highlight {
  color: var(--text-primary);
  font-weight: 600;
}

.hero-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 60px;
}

.hero-btn {
  padding: 15px 35px;
  font-size: 1.1rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 600;
}

.primary-btn {
  background: var(--gradient-tech);
  color: white;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.5);
}

.secondary-btn {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 5px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Hero视觉效果 */
.hero-visual {
  flex: 1;
  position: relative;
  height: 600px;
}

.three-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-cards {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-card {
  position: absolute;
  padding: 25px;
  text-align: center;
  animation: float 4s ease-in-out infinite;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.floating-card p {
  margin-top: 15px;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  opacity: 0.1;
  filter: blur(40px);
  pointer-events: none;
}

.card-1 {
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 40%;
  right: 25%;
  animation-delay: 1.5s;
}

.card-3 {
  bottom: 15%;
  right: 15%;
  animation-delay: 3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(2deg);
  }
  75% {
    transform: translateY(20px) rotate(-2deg);
  }
}

/* 滚动提示 */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-20px);
  }
  60% {
    transform: translateX(-50%) translateY(-10px);
  }
}

/* 功能特点 */
.features-section {
  padding: 120px 5%;
  position: relative;
  z-index: 10;
}

.section-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.1;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: var(--gradient-tech);
  top: -300px;
  left: -300px;
}

.shape-2 {
  width: 800px;
  height: 800px;
  background: var(--gradient-primary);
  bottom: -400px;
  right: -400px;
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-tag {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 20px;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 800;
}

.section-desc {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  padding: 40px 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
}

.icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  opacity: 0.2;
  transition: all 0.3s ease;
}

.feature-card:hover .icon-bg {
  transform: scale(1.1);
  opacity: 0.3;
}

.feature-icon .el-icon {
  position: relative;
  z-index: 1;
  color: white;
  line-height: 100px;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-hover {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--gradient-tech);
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-hover {
  transform: translateY(0);
}

.feature-hover ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.feature-hover li {
  color: white;
  padding: 5px 0;
  font-size: 14px;
}

/* 优势展示 */
.advantages-section {
  padding: 120px 5%;
  background: var(--bg-secondary);
  position: relative;
  z-index: 10;
}

.advantages-container {
  max-width: 1200px;
  margin: 0 auto;
}

.advantages-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.advantages-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.advantage-item {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.advantage-item:hover,
.advantage-item.active {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(64, 158, 255, 0.3);
  transform: translateX(10px);
}

.advantage-number {
  font-size: 2.5rem;
  font-weight: bold;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.advantage-info {
  flex: 1;
}

.advantage-info h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.advantage-info p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.advantage-arrow {
  color: var(--primary-color);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.advantage-item:hover .advantage-arrow,
.advantage-item.active .advantage-arrow {
  opacity: 1;
  transform: translateX(0);
}

.advantages-right {
  position: sticky;
  top: 100px;
}

.advantage-display {
  padding: 50px;
  text-align: center;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.display-content h3 {
  font-size: 1.5rem;
  margin: 20px 0 15px;
  color: var(--text-primary);
}

.display-content p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 30px;
}

.tech-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.tech-tag {
  padding: 8px 16px;
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 20px;
  color: var(--primary-color);
  font-size: 14px;
  transition: all 0.3s ease;
}

.tech-tag:hover {
  background: rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

/* 数据展示 */
.data-section {
  padding: 120px 5%;
  position: relative;
  overflow: hidden;
}

.data-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.data-bg video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.1;
}

.data-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.data-card {
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-10px);
}

.data-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.data-number {
  font-size: 3rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.data-label {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.data-progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 2s ease;
}

/* 使用流程 */
.process-section {
  padding: 120px 5%;
  background: var(--bg-secondary);
  position: relative;
}

.process-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.process-line {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

.line-progress {
  height: 100%;
  background: var(--gradient-tech);
  transition: width 0.5s ease;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  position: relative;
  z-index: 1;
}

.process-step {
  cursor: pointer;
  transition: all 0.3s ease;
}

.process-step.active .icon-circle {
  background: var(--gradient-tech);
  transform: scale(1.2);
}

.step-icon {
  text-align: center;
  margin-bottom: 30px;
}

.icon-circle {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.step-content {
  padding: 30px;
  text-align: center;
  min-height: 250px;
  transition: all 0.3s ease;
}

.process-step:hover .step-content {
  transform: translateY(-5px);
}

.step-content h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.step-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.step-image {
  margin-top: 20px;
}

/* CTA区域 */
.cta-section {
  padding: 120px 5%;
  position: relative;
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.cta-pattern {
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 35px,
    rgba(64, 158, 255, 0.05) 35px,
    rgba(64, 158, 255, 0.05) 70px
  );
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 800;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cta-subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.cta-btn {
  padding: 18px 40px;
  font-size: 1.1rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 600;
}

.cta-btn.primary {
  background: var(--gradient-tech);
  color: white;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.4);
}

.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(64, 158, 255, 0.6);
}

.cta-btn.secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 页脚 */
.footer {
  padding: 80px 5% 40px;
  background: var(--bg-secondary);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 60px;
}

.footer-section h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 12px;
}

.footer-section a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--text-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: var(--text-secondary);
  margin-bottom: 10px;
}

/* 移动端菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 400px;
  height: 100vh;
  background: var(--bg-secondary);
  z-index: 1001;
  transition: right 0.3s ease;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-content {
  padding: 80px 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.mobile-menu-content a {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.mobile-menu-content a:hover {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .hero-title {
    font-size: 3rem;
  }

  .advantages-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .advantages-right {
    position: relative;
    top: 0;
  }
}

@media (max-width: 992px) {
  .nav-links {
    display: none;
  }

  .nav-toggle {
    display: flex;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-visual {
    height: 400px;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-main {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .process-steps {
    grid-template-columns: 1fr;
  }

  .process-line {
    display: none;
  }

  .cta-actions {
    flex-direction: column;
    width: 100%;
  }

  .cta-btn {
    width: 100%;
    justify-content: center;
  }

  .footer-main {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .navbar {
    width: 95%;
    padding: 10px 20px;
  }

  .hero-section {
    padding: 0 20px;
    min-height: 100vh;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-btn {
    padding: 12px 25px;
    font-size: 1rem;
  }

  .floating-card {
    padding: 20px;
  }

  .data-grid {
    grid-template-columns: 1fr;
  }

  .advantage-item {
    flex-direction: column;
    text-align: center;
  }

  .advantage-display {
    padding: 30px 20px;
  }
}
</style>
