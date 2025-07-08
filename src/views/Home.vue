<template>
  <div class="home-container">
    <div id="particles-bg"></div>

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
          <a href="#demo" class="nav-link">产品演示</a>
          <a href="#advantages" class="nav-link">核心优势</a>
          <a href="#process" class="nav-link">使用流程</a>
          <a href="#testimonials" class="nav-link">用户评价</a>
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

    <section class="hero-section">
      <div class="hero-bg">
        <div class="grid-overlay"></div>
        <div class="gradient-overlay"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text" data-aos="fade-right">
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
            <span class="highlight"
              >已帮助 <span class="count-up" data-value="17000">0</span>+
              名学生成功获得理想offer</span
            >
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
          <div class="hero-stats">
            <div class="stat-item" v-for="stat in heroStats" :key="stat.label">
              <div class="stat-number">
                <span :data-value="stat.value">0</span>{{ stat.suffix }}
              </div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        <div class="hero-visual" data-aos="fade-left">
          <div ref="threeContainer" class="three-container"></div>
          <div class="floating-cards">
            <div
              v-for="(card, index) in floatingCards"
              :key="index"
              class="floating-card glass-card parallax-card"
              :class="`card-${index + 1}`"
              :data-depth="(index + 1) * 0.2"
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
      <div class="scroll-indicator">
        <el-icon :size="24"><ArrowDown /></el-icon>
      </div>
    </section>

    <section id="features" class="features-section">
      <div class="section-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
      </div>
      <div class="section-content">
        <div class="section-header" data-aos="fade-up">
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
            data-aos="fade-up"
            :data-aos-delay="index * 100"
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
            <div class="feature-hover" :class="{ active: featureHover === index }">
              <ul>
                <li v-for="(point, i) in feature.details" :key="i">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="demo" class="demo-section">
      <div class="section-content">
        <div class="section-header" data-aos="fade-up">
          <span class="section-tag">DEMO</span>
          <h2 class="section-title">
            <span class="gradient-text">产品演示</span>
          </h2>
          <p class="section-desc">3分钟了解AI面试智能体的强大功能</p>
        </div>
        <div class="demo-container" data-aos="fade-up" data-aos-delay="200">
          <div class="demo-tabs">
            <div
              v-for="(demo, index) in demoVideos"
              :key="index"
              class="demo-tab"
              :class="{ active: activeDemoTab === index }"
              @click="switchDemo(index)"
            >
              <el-icon><component :is="demo.icon" /></el-icon>
              <span>{{ demo.title }}</span>
            </div>
          </div>
          <div class="demo-player glass-card">
            <video
              ref="demoPlayer"
              class="video-js vjs-default-skin vjs-big-play-centered"
              controls
              preload="auto"
              :poster="demoVideos[activeDemoTab].poster"
            >
              <source :src="demoVideos[activeDemoTab].src" type="video/mp4" />
              <p class="vjs-no-js">请启用JavaScript或使用支持HTML5视频的浏览器</p>
            </video>
          </div>
          <div class="demo-features">
            <div
              v-for="(feature, index) in demoVideos[activeDemoTab].features"
              :key="index"
              class="demo-feature"
              data-aos="fade-up"
              :data-aos-delay="index * 100 + 300"
            >
              <el-icon :color="feature.color"><component :is="feature.icon" /></el-icon>
              <span>{{ feature.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="advantages" class="advantages-section">
      <div class="advantages-container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-tag">ADVANTAGES</span>
          <h2 class="section-title">
            <span class="gradient-text">为什么选择我们</span>
          </h2>
        </div>
        <div class="advantages-content">
          <div class="advantages-left" data-aos="fade-right">
            <div
              v-for="(advantage, index) in advantages"
              :key="index"
              class="advantage-item"
              :class="{ active: activeAdvantage === index }"
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
            <div class="advantage-display glass-card" data-aos="fade-left">
              <transition name="fade" mode="out-in">
                <div
                  class="display-content"
                  :key="activeAdvantage"
                  v-if="advantages[activeAdvantage]"
                >
                  <el-icon :size="60" :color="advantages[activeAdvantage].color">
                    <component :is="advantages[activeAdvantage].icon" />
                  </el-icon>
                  <h3>{{ advantages[activeAdvantage].title }}</h3>
                  <p>{{ advantages[activeAdvantage].detail }}</p>
                  <div class="tech-tags">
                    <span
                      v-for="tag in advantages[activeAdvantage].tags"
                      :key="tag"
                      class="tech-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="data-section">
      <div class="data-bg"></div>
      <div class="data-content">
        <h2 class="section-title" data-aos="fade-up">
          <span class="gradient-text">真实数据说话</span>
        </h2>
        <div class="data-grid">
          <div
            v-for="(data, index) in dataStats"
            :key="index"
            class="data-card glass-card"
            data-aos="zoom-in"
            :data-aos-delay="index * 150"
          >
            <div class="data-icon">
              <el-icon :size="40" :color="data.color">
                <component :is="data.icon" />
              </el-icon>
            </div>
            <div class="data-number"><span :data-value="data.value">0</span>{{ data.suffix }}</div>
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

    <section id="process" class="process-section">
      <div class="section-header" data-aos="fade-up">
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
            :class="{ active: currentStep >= index }"
            data-aos="fade-up"
            :data-aos-delay="index * 200"
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

    <section id="testimonials" class="testimonials-section">
      <div class="section-content">
        <div class="section-header" data-aos="fade-up">
          <span class="section-tag">TESTIMONIALS</span>
          <h2 class="section-title">
            <span class="gradient-text">用户心声</span>
          </h2>
          <p class="section-desc">来自真实用户的评价</p>
        </div>
        <div class="testimonials-carousel" data-aos="fade-up" data-aos-delay="200">
          <div
            class="testimonial-item glass-card"
            v-for="(testimonial, index) in testimonials"
            :key="index"
          >
            <div class="testimonial-header">
              <el-avatar :size="60" :src="testimonial.avatar" icon="UserFilled" />
              <div class="testimonial-info">
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.title }}</p>
                <el-rate v-model="testimonial.rating" disabled />
              </div>
            </div>
            <div class="testimonial-content">
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-result">
              <el-tag type="success">{{ testimonial.result }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="section-content">
        <div class="section-header" data-aos="fade-up">
          <span class="section-tag">FAQ</span>
          <h2 class="section-title">
            <span class="gradient-text">常见问题</span>
          </h2>
        </div>
        <el-collapse v-model="activeFaq" class="faq-collapse">
          <el-collapse-item
            v-for="(faq, index) in faqs"
            :key="index"
            :title="faq.question"
            :name="index"
          >
            <p>{{ faq.answer }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-bg">
        <div class="cta-pattern"></div>
      </div>
      <div class="cta-content" data-aos="zoom-in">
        <h2 class="cta-title">准备好提升您的面试能力了吗？</h2>
        <p class="cta-subtitle">加入数万名成功学员，开启您的职业发展之路</p>
        <div class="cta-actions">
          <router-link to="/login" class="cta-btn primary">
            <span>免费试用</span>
            <el-icon><Right /></el-icon>
          </router-link>
          <button class="cta-btn secondary">
            <el-icon><Phone /></el-icon>
            <span>联系我们</span>
          </button>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-section">
            <h4>产品</h4>
            <ul>
              <li><a href="#features">功能介绍</a></li>
              <li><a href="#demo">使用教程</a></li>
              <li><a href="#">价格方案</a></li>
              <li><a href="#">更新日志</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>资源</h4>
            <ul>
              <li><a href="#">面试题库</a></li>
              <li><a href="#">学习资料</a></li>
              <li><a href="#testimonials">成功案例</a></li>
              <li><a href="#">博客文章</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>支持</h4>
            <ul>
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">联系客服</a></li>
              <li><a href="#">意见反馈</a></li>
              <li><a href="#faq">FAQ</a></li>
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
        <div class="footer-newsletter">
          <h4>订阅我们的Newsletter</h4>
          <p>获取最新的面试技巧和产品更新</p>
          <el-form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <el-input v-model="newsletterEmail" placeholder="输入您的邮箱" size="large">
              <template #append>
                <el-button @click="subscribeNewsletter" type="primary">订阅</el-button>
              </template>
            </el-input>
          </el-form>
        </div>
        <div class="footer-bottom">
          <div class="footer-social">
            <a href="#" target="_blank"
              ><el-icon><Link /></el-icon
            ></a>
            <a href="#" target="_blank"
              ><el-icon><Connection /></el-icon
            ></a>
            <a href="#" target="_blank"
              ><el-icon><Briefcase /></el-icon
            ></a>
          </div>
          <p>&copy; 2024 AI面试智能体. All rights reserved.</p>
          <p>Powered by 讯飞星火大模型</p>
        </div>
      </div>
    </footer>

    <div class="mobile-menu" :class="{ active: mobileMenuOpen }">
      <div class="mobile-menu-content">
        <a href="#features" @click="closeMobileMenu">功能特点</a>
        <a href="#demo" @click="closeMobileMenu">产品演示</a>
        <a href="#advantages" @click="closeMobileMenu">核心优势</a>
        <a href="#process" @click="closeMobileMenu">使用流程</a>
        <a href="#testimonials" @click="closeMobileMenu">用户评价</a>
        <router-link to="/login" @click="closeMobileMenu">登录/注册</router-link>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showBackTop" class="back-top" @click="scrollToTop">
        <el-icon><Top /></el-icon>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElMessage,
  ElRate,
  ElAvatar,
  ElTag,
  ElCollapse,
  ElCollapseItem,
  ElForm,
  ElInput,
  ElButton,
} from 'element-plus'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AOS from 'aos'
import 'aos/dist/aos.css'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

import {
  Monitor,
  Microphone,
  VideoCamera,
  Document,
  TrendCharts,
  School,
  Timer,
  Trophy,
  Right,
  ArrowDown,
  VideoPlay,
  ArrowRight,
  Phone,
  Platform,
  Connection,
  Promotion,
  UserFilled,
  Link,
  Briefcase,
  Top,
  CircleCheck,
  Star,
  ChatLineSquare,
  User,
  DocumentAdd,
  DataAnalysis,
} from '@element-plus/icons-vue'

gsap.registerPlugin(ScrollTrigger)
const router = useRouter()

// --- 响应式数据 (合并自两个版本) ---
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const typedText = ref('')
const featureHover = ref(null)
const activeAdvantage = ref(0)
const currentStep = ref(0)
const showBackTop = ref(false)
const activeDemoTab = ref(0)
const activeFaq = ref(['0'])
const newsletterEmail = ref('')
const threeContainer = ref(null)
const demoPlayer = ref(null)
let videoPlayerInstance = null
let scene, camera, renderer, particles

// --- 数据定义 (合并自两个版本) ---

const heroStats = ref([
  { value: 300, suffix: '%+', label: '面试通过率提升' },
  { value: 17000, suffix: '+', label: '成功学员' },
  { value: 30, suffix: '%+', label: '薪资涨幅' },
])
const floatingCards = ref([
  { icon: 'Microphone', text: '语音分析', color: '#409eff' },
  { icon: 'VideoCamera', text: '表情识别', color: '#67c23a' },
  { icon: 'Document', text: '内容评测', color: '#e6a23c' },
])
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
const typingTexts = ['多模态面试评测系统', '智能面试辅导平台', '个性化能力提升方案']

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
const processSteps = ref([
  { title: '注册登录', description: '创建账号，完善个人信息', icon: 'User', color: '#409eff' },
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
const processProgress = computed(() => (currentStep.value / (processSteps.value.length - 1)) * 100)

const demoVideos = ref([
  {
    title: '练习模式',
    icon: 'Timer',
    src: '/demo/practice-mode.mp4',
    poster: '/demo/practice-poster.jpg',
    features: [
      { icon: 'CircleCheck', text: '实时AI反馈', color: '#67c23a' },
      { icon: 'Star', text: '随时暂停思考', color: '#e6a23c' },
      { icon: 'ChatLineSquare', text: '智能提示系统', color: '#409eff' },
    ],
  },
  {
    title: '模拟面试',
    icon: 'VideoCamera',
    src: '/demo/simulation-mode.mp4',
    poster: '/demo/simulation-poster.jpg',
    features: [
      { icon: 'Platform', text: '真实面试场景', color: '#f56c6c' },
      { icon: 'TrendCharts', text: '多维度评估', color: '#409eff' },
      { icon: 'Document', text: '详细分析报告', color: '#67c23a' },
    ],
  },
  {
    title: '能力分析',
    icon: 'TrendCharts',
    src: '/demo/analysis.mp4',
    poster: '/demo/analysis-poster.jpg',
    features: [
      { icon: 'Star', text: '五维能力模型', color: '#e6a23c' },
      { icon: 'Promotion', text: '进步追踪', color: '#67c23a' },
      { icon: 'School', text: '个性化建议', color: '#409eff' },
    ],
  },
])
const testimonials = ref([
  {
    name: '张同学',
    title: '北京大学 计算机专业',
    avatar: '/avatars/user1.jpg',
    rating: 5,
    content:
      '通过AI面试智能体的练习，我成功拿到了字节跳动的offer。特别是模拟面试功能，让我提前适应了真实面试的节奏。',
    result: '成功入职字节跳动',
  },
  {
    name: '李同学',
    title: '清华大学 软件工程',
    avatar: '/avatars/user2.jpg',
    rating: 5,
    content:
      '个性化的学习路径让我能够针对性地提升薄弱环节，面试表现分析非常专业，帮助我认识到了很多之前没注意到的问题。',
    result: '获得阿里巴巴offer',
  },
  {
    name: '王同学',
    title: '上海交大 金融专业',
    avatar: '/avatars/user3.jpg',
    rating: 5,
    content:
      '作为跨专业求职的学生，这个平台帮我快速了解了技术岗位的要求，知识库内容非常全面，让我少走了很多弯路。',
    result: '成功转行互联网',
  },
])
const faqs = ref([
  {
    question: '如何开始使用AI面试智能体？',
    answer:
      '只需三步：1.注册账号并完善个人信息；2.上传简历获得个性化题库；3.选择练习或模拟模式开始面试。系统会根据您的表现提供详细的反馈和改进建议。',
  },
  {
    question: '面试评分是如何计算的？',
    answer:
      '我们采用五维评估模型，从专业知识、表达能力、逻辑思维、应变能力和职业素养五个维度进行综合评分。每个维度都有具体的评分标准和权重，确保评分的客观性和准确性。',
  },
  {
    question: '支持哪些类型的面试？',
    answer:
      '目前支持技术面试、HR面试、群面等多种面试形式，覆盖互联网、金融、教育等多个行业。每种面试类型都有针对性的题库和评估标准。',
  },
  {
    question: '如何保护我的隐私？',
    answer:
      '我们严格遵守隐私保护法规，所有面试数据都经过加密存储，仅用于生成个人分析报告。您可以随时删除自己的数据，我们不会将数据用于其他商业用途。',
  },
  {
    question: '是否支持英文面试？',
    answer:
      '是的，我们支持中英文双语面试。系统可以识别和分析英文回答，并提供相应的语言建议，帮助您提升英文面试能力。',
  },
])

// --- 方法 ---
let textIndex = 0,
  charIndex = 0,
  isDeleting = false
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
const initThreeScene = () => {
  if (!threeContainer.value) return
  scene = new THREE.Scene()
  const width = threeContainer.value.clientWidth
  const height = threeContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  threeContainer.value.appendChild(renderer.domElement)

  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 1500
  const posArray = new Float32Array(particlesCount * 3)
  const colorArray = new Float32Array(particlesCount * 3)
  for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 10
    posArray[i + 1] = (Math.random() - 0.5) * 10
    posArray[i + 2] = (Math.random() - 0.5) * 10
    const color = new THREE.Color()
    color.setHSL(Math.random() * 0.1 + 0.55, 0.7, 0.6)
    colorArray[i] = color.r
    colorArray[i + 1] = color.g
    colorArray[i + 2] = color.b
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  })
  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  let mouseX = 0,
    mouseY = 0
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1
  })
  const animate = () => {
    requestAnimationFrame(animate)
    particles.rotation.x += 0.0005 + mouseY * 0.0005
    particles.rotation.y += 0.0005 + mouseX * 0.0005
    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', () => {
    if (!threeContainer.value) return
    const newWidth = threeContainer.value.clientWidth
    const newHeight = threeContainer.value.clientHeight
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
  })
}
const animateNumbers = () => {
  const elements = document.querySelectorAll('.count-up, .stat-number span, .data-number span')
  elements.forEach((el) => {
    const endValue = parseInt(el.dataset.value, 10)
    gsap.to(el, {
      innerText: endValue,
      duration: 2.5,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%' },
    })
  })
}
const initParallax = () => {
  gsap.utils.toArray('.parallax-card').forEach((card) => {
    const depth = card.dataset.depth || 0.5
    gsap.to(card, {
      y: (index, target) => -ScrollTrigger.maxScroll(window) * depth * 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  })
}
const switchDemo = (index) => {
  activeDemoTab.value = index
  if (videoPlayerInstance) {
    videoPlayerInstance.src({ src: demoVideos.value[index].src, type: 'video/mp4' })
    videoPlayerInstance.poster(demoVideos.value[index].poster)
    videoPlayerInstance.load()
  }
}
const playDemo = () => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })
const subscribeNewsletter = () => {
  if (!newsletterEmail.value) {
    ElMessage.warning('请输入邮箱地址')
    return
  }
  ElMessage.success('订阅成功！感谢您的关注')
  newsletterEmail.value = ''
}
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  showBackTop.value = window.scrollY > 500
}
const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value)
const closeMobileMenu = () => (mobileMenuOpen.value = false)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
  AOS.init({ duration: 1000, once: true, offset: 100 })
  typeWriter()
  nextTick(() => {
    initThreeScene()
    if (demoPlayer.value) {
      videoPlayerInstance = videojs(demoPlayer.value, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        language: 'zh-CN',
      })
    }
    animateNumbers()
    initParallax()
  })
  window.addEventListener('scroll', handleScroll)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.getAttribute('href')
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
        closeMobileMenu()
      }
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (renderer) renderer.dispose()
  if (videoPlayerInstance) videoPlayerInstance.dispose()
  ScrollTrigger.killAll()
})
</script>

<style scoped>
/* 导入字体 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* --- 基础样式 --- */
.home-container {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  --bg-primary: #0a0e27;
  --bg-secondary: #10163a;
  --text-primary: #ffffff;
  --text-secondary: #a8b2d1;
  --primary-color: #409eff;
  --gradient-tech: linear-gradient(135deg, #409eff 0%, #764ba2 100%);
  --gradient-primary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  background: var(--bg-primary);
  overflow-x: hidden;
  position: relative;
}
#particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}
.glass-card {
  background: rgba(23, 29, 66, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
.gradient-text {
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

/* --- 导航栏 --- */
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
  backdrop-filter: blur(20px) saturate(180%);
  background: rgba(10, 14, 39, 0.75);
}
.navbar.scrolled {
  top: 10px;
  padding: 10px 25px;
  background: rgba(10, 14, 39, 0.9);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
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
}
.logo-icon {
  width: 45px;
  height: 45px;
  background: var(--gradient-tech);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-primary);
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
}
.nav-link:hover {
  color: var(--text-primary);
}
.login-btn {
  padding: 10px 25px;
  background: var(--gradient-tech);
  border-radius: 25px;
  color: white !important;
}
.glow-btn {
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}
@keyframes glow {
  to {
    box-shadow: 0 0 30px rgba(64, 158, 255, 0.8);
  }
}
.nav-toggle {
  display: none;
}

/* --- Hero 区域 --- */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 5%;
  z-index: 1;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(64, 158, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 158, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
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
}
.hero-title {
  font-size: 4rem;
  line-height: 1.2;
  margin-bottom: 30px;
  font-weight: 800;
}
.title-line {
  display: block;
}
.typing-text {
  color: var(--text-primary);
}
.cursor {
  animation: blink 1s infinite;
}
@keyframes blink {
  50% {
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
}
.secondary-btn {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid rgba(255, 255, 255, 0.2);
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
  color: var(--text-primary);
}
.hero-visual {
  flex: 1;
  position: relative;
  height: 600px;
  perspective: 1000px;
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
}
.floating-card {
  position: absolute;
  padding: 25px;
  text-align: center;
  will-change: transform;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
.floating-card p {
  margin-top: 15px;
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
}
.card-2 {
  top: 40%;
  right: 25%;
}
.card-3 {
  bottom: 15%;
  right: 15%;
}
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s ease-in-out infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -15px);
  }
}

/* --- 功能特点 --- */
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
.feature-card:hover .feature-hover,
.feature-hover.active {
  transform: translateY(0);
}
.feature-hover ul {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
}
.feature-hover li {
  color: white;
  padding: 5px 0;
  font-size: 14px;
}

/* --- 产品演示 --- */
.demo-section {
  padding: 120px 5%;
  background: var(--bg-secondary);
  position: relative;
}
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
}
.demo-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.demo-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}
.demo-tab.active,
.demo-tab:hover {
  background: var(--gradient-tech);
  color: white;
  transform: scale(1.05);
}
.demo-player {
  margin-bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
.demo-player .video-js {
  width: 100%;
  border-radius: 20px;
}
.demo-features {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}
.demo-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  font-size: 16px;
}

/* --- 优势展示 --- */
.advantages-section {
  padding: 120px 5%;
  background: var(--bg-primary);
  position: relative;
}
.advantages-container {
  max-width: 1200px;
  margin: 0 auto;
}
.advantages-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: flex-start;
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
.advantage-info h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
}
.advantage-arrow {
  color: var(--primary-color);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}
.advantage-item.active .advantage-arrow,
.advantage-item:hover .advantage-arrow {
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
}

/* --- 数据展示 --- */
.data-section {
  padding: 120px 5%;
  position: relative;
  background: var(--bg-secondary);
}
.data-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
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

/* --- 使用流程 --- */
.process-section {
  padding: 120px 5%;
  background: var(--bg-primary);
}
.process-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}
.process-line {
  position: absolute;
  top: 30px;
  left: 12.5%;
  right: 12.5%;
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
}
.process-step {
  cursor: pointer;
  text-align: center;
  opacity: 1;
  transform: translateY(0);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.step-icon {
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
  transition: all 0.3s ease;
  position: relative;
}
.process-step.active .icon-circle {
  background: var(--gradient-tech);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
}
.step-content {
  padding: 30px;
  min-height: 250px;
  transition: all 0.3s ease;
  opacity: 1;
}
.process-step:not(.active):hover .step-content {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.step-content h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
}
.step-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}
.step-image {
  margin-top: 20px;
}

/* --- 用户评价 --- */
.testimonials-section {
  padding: 120px 5%;
  background: var(--bg-secondary);
}
.testimonials-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}
.testimonial-item {
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.testimonial-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}
.testimonial-info h4 {
  margin: 0 0 5px 0;
}
.testimonial-info p {
  margin: 0 0 10px 0;
  color: var(--text-secondary);
  font-size: 14px;
}
.testimonial-content {
  flex: 1;
  margin-bottom: 20px;
}
.testimonial-content p {
  color: var(--text-primary);
  line-height: 1.8;
  font-style: italic;
}
.testimonial-result {
  text-align: right;
}

/* --- FAQ --- */
.faq-section {
  padding: 120px 5%;
  background: var(--bg-primary);
}
.faq-collapse {
  max-width: 800px;
  margin: 0 auto;
  border: none;
}
.faq-collapse :deep(.el-collapse-item) {
  margin-bottom: 10px;
}
.faq-collapse :deep(.el-collapse-item__header) {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 1.1rem;
  padding: 20px;
  border-radius: 10px;
  border: none;
}
.faq-collapse :deep(.el-collapse-item__wrap) {
  background: transparent;
  border: none;
}
.faq-collapse :deep(.el-collapse-item__content) {
  color: var(--text-secondary);
  padding: 0 20px 20px 20px;
  line-height: 1.8;
}

/* --- CTA --- */
.cta-section {
  padding: 120px 5%;
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
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
}
.cta-title {
  font-size: 3rem;
  margin-bottom: 20px;
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
/* 修复关键点：这是您需要的按钮样式 */
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

/* “免费试用”按钮的颜色和效果 */
.cta-btn.primary {
  /* 使用更明亮的渐变色 */
  background: linear-gradient(135deg, #38a2ff 0%, #0072ff 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 114, 255, 0.3);
}

/* 鼠标悬停时，按钮上浮并增强阴影，使其更具吸引力 */
.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 114, 255, 0.5);
}

/* “联系我们”按钮的样式 */
.cta-btn.secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* --- 页脚 --- */
.footer {
  padding: 80px 5% 40px;
  background: linear-gradient(to bottom, var(--bg-primary), #050816);
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
.footer-newsletter {
  max-width: 500px;
  margin: 60px auto 40px;
  text-align: center;
}
.footer-newsletter p {
  color: var(--text-secondary);
  margin-bottom: 20px;
}
.footer-bottom {
  text-align: center;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.footer-social {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}
.footer-social a {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}
.footer-social a:hover {
  background: var(--gradient-tech);
  color: white;
  transform: translateY(-3px);
}

/* --- 移动端 & 回到顶部 --- */
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
}
.back-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--gradient-tech);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.4);
  transition: all 0.3s ease;
  z-index: 999;
}
.back-top:hover {
  transform: translateY(-5px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- 响应式 --- */
@media (max-width: 1200px) {
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
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }
  .hero-visual {
    height: 400px;
    width: 100%;
  }
  .hero-actions,
  .hero-stats {
    justify-content: center;
  }
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }
  .process-line {
    left: 25%;
    right: 25%;
  }
  .footer-main {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .hero-title,
  .cta-title,
  .section-title {
    font-size: 2.2rem;
  }
  .features-grid,
  .testimonials-carousel,
  .data-grid,
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
</style>
