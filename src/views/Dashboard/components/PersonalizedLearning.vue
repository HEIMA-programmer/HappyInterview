<template>
  <div class="personalized-learning-container">
    <div class="page-header">
      <h2 class="page-title">个性化学习路径</h2>
      <p class="page-subtitle">基于您的面试表现，AI为您定制专属学习计划</p>
    </div>

    <!-- 学习进度概览 -->
    <div class="progress-overview glass-card">
      <div class="overview-left">
        <h3>当前学习计划</h3>
        <h4>{{ currentPlan.name }}</h4>
        <p>{{ currentPlan.description }}</p>
        <div class="plan-meta">
          <span><el-icon><Calendar /></el-icon> 开始时间：{{ currentPlan.startDate }}</span>
          <span><el-icon><Timer /></el-icon> 预计时长：{{ currentPlan.duration }}</span>
        </div>
      </div>
      <div class="overview-right">
        <div class="progress-ring">
          <el-progress
            type="circle"
            :percentage="currentPlan.progress"
            :width="150"
            :stroke-width="10"
          >
            <template #default="{ percentage }">
              <span class="progress-text">
                <span class="percentage">{{ percentage }}%</span>
                <span class="label">完成度</span>
              </span>
            </template>
          </el-progress>
        </div>
        <div class="progress-stats">
          <div class="stat">
            <span class="stat-value">{{ currentPlan.completedLessons }}</span>
            <span class="stat-label">已完成课程</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ currentPlan.totalLessons }}</span>
            <span class="stat-label">总课程数</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日学习任务 -->
    <div class="daily-tasks glass-card">
      <div class="section-header">
        <h3>今日学习任务</h3>
        <el-tag :type="dailyTasks.completed === dailyTasks.total ? 'success' : 'primary'">
          {{ dailyTasks.completed }} / {{ dailyTasks.total }} 完成
        </el-tag>
      </div>

      <div class="task-list">
        <div
          v-for="task in dailyTasks.tasks"
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed }"
        >
          <el-checkbox v-model="task.completed" @change="updateTaskStatus(task)">
            <div class="task-content">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <div class="task-meta">
                <el-tag size="small" type="info">{{ task.type }}</el-tag>
                <span class="task-duration">
                  <el-icon><Clock /></el-icon>
                  {{ task.duration }}分钟
                </span>
              </div>
            </div>
          </el-checkbox>
          <el-button
            v-if="!task.completed"
            type="primary"
            size="small"
            @click="startTask(task)"
          >
            开始学习
          </el-button>
        </div>
      </div>
    </div>

    <!-- 学习路径 -->
    <div class="learning-path glass-card">
      <h3>完整学习路径</h3>

      <div class="path-timeline">
        <div
          v-for="(stage, index) in learningPath"
          :key="stage.id"
          class="path-stage"
          :class="{
            active: stage.id === currentStage,
            completed: stage.progress === 100
          }"
        >
          <div class="stage-marker">
            <div class="marker-dot">
              <el-icon v-if="stage.progress === 100" :size="20">
                <CircleCheck />
              </el-icon>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="marker-line" v-if="index < learningPath.length - 1"></div>
          </div>

          <div class="stage-content">
            <div class="stage-header">
              <h4>{{ stage.name }}</h4>
              <el-progress
                :percentage="stage.progress"
                :status="stage.progress === 100 ? 'success' : ''"
              />
            </div>

            <p class="stage-description">{{ stage.description }}</p>

            <div class="stage-modules">
              <div
                v-for="module in stage.modules"
                :key="module.id"
                class="module-item"
                @click="viewModule(module)"
              >
                <el-icon :color="module.completed ? '#67c23a' : '#909399'">
                  <component :is="module.completed ? 'CircleCheck' : 'Circle'" />
                </el-icon>
                <span>{{ module.name }}</span>
                <el-tag size="small">{{ module.lessons }}课时</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐资源 -->
    <div class="recommended-resources">
      <h3>推荐学习资源</h3>

      <div class="resource-grid">
        <div
          v-for="resource in recommendedResources"
          :key="resource.id"
          class="resource-card glass-card hover-float"
        >
          <div class="resource-type">
            <el-icon :size="30" :color="resource.color">
              <component :is="resource.icon" />
            </el-icon>
          </div>

          <div class="resource-info">
            <h4>{{ resource.title }}</h4>
            <p>{{ resource.description }}</p>

            <div class="resource-meta">
              <span class="meta-item">
                <el-icon><User /></el-icon>
                {{ resource.author }}
              </span>
              <span class="meta-item">
                <el-icon><Star /></el-icon>
                {{ resource.rating }}
              </span>
              <span class="meta-item">
                <el-icon><Clock /></el-icon>
                {{ resource.duration }}
              </span>
            </div>

            <div class="resource-tags">
              <el-tag
                v-for="tag in resource.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <div class="resource-action">
            <el-button type="primary" @click="startResource(resource)">
              {{ resource.actionText }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习成就 -->
    <div class="achievements glass-card">
      <h3>学习成就</h3>

      <div class="achievement-list">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="achievement-item"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">
            <el-icon :size="40" :color="achievement.unlocked ? achievement.color : '#666'">
              <Trophy />
            </el-icon>
          </div>
          <div class="achievement-info">
            <h5>{{ achievement.name }}</h5>
            <p>{{ achievement.description }}</p>
            <el-progress
              v-if="!achievement.unlocked"
              :percentage="achievement.progress"
              :show-text="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  Timer,
  Clock,
  CircleCheck,
  User,
  Star,
  Trophy
} from '@element-plus/icons-vue'

const router = useRouter()

// 当前学习计划
const currentPlan = ref({
  name: '前端面试强化计划',
  description: '针对您的薄弱环节定制的30天提升计划',
  startDate: '2024-01-01',
  duration: '30天',
  progress: 65,
  completedLessons: 26,
  totalLessons: 40
})

// 今日任务
const dailyTasks = ref({
  completed: 2,
  total: 4,
  tasks: [
    {
      id: 1,
      title: '复习JavaScript闭包原理',
      description: '深入理解闭包的形成原因和应用场景',
      type: '理论学习',
      duration: 30,
      completed: true
    },
    {
      id: 2,
      title: '练习算法题：链表反转',
      description: '掌握链表操作的基本技巧',
      type: '编程练习',
      duration: 45,
      completed: true
    },
    {
      id: 3,
      title: '模拟面试：项目经验介绍',
      description: '练习STAR法则描述项目经验',
      type: '面试练习',
      duration: 20,
      completed: false
    },
    {
      id: 4,
      title: '阅读：Vue3源码解析',
      description: '了解响应式系统的实现原理',
      type: '深度阅读',
      duration: 60,
      completed: false
    }
  ]
})

// 当前阶段
const currentStage = ref('stage2')

// 学习路径
const learningPath = ref([
  {
    id: 'stage1',
    name: '基础巩固',
    description: '夯实前端基础知识，建立知识体系',
    progress: 100,
    modules: [
      { id: 'm1', name: 'HTML/CSS进阶', lessons: 8, completed: true },
      { id: 'm2', name: 'JavaScript核心', lessons: 12, completed: true },
      { id: 'm3', name: '浏览器原理', lessons: 6, completed: true }
    ]
  },
  {
    id: 'stage2',
    name: '框架深入',
    description: '深入学习主流框架，掌握底层原理',
    progress: 60,
    modules: [
      { id: 'm4', name: 'Vue3全家桶', lessons: 10, completed: true },
      { id: 'm5', name: 'React生态', lessons: 10, completed: false },
      { id: 'm6', name: '状态管理', lessons: 5, completed: false }
    ]
  },
  {
    id: 'stage3',
    name: '工程实践',
    description: '提升工程化能力和项目经验',
    progress: 0,
    modules: [
      { id: 'm7', name: '构建工具', lessons: 6, completed: false },
      { id: 'm8', name: '性能优化', lessons: 8, completed: false },
      { id: 'm9', name: '测试部署', lessons: 5, completed: false }
    ]
  },
  {
    id: 'stage4',
    name: '面试冲刺',
    description: '针对性面试训练，查漏补缺',
    progress: 0,
    modules: [
      { id: 'm10', name: '高频面试题', lessons: 15, completed: false },
      { id: 'm11', name: '项目复盘', lessons: 5, completed: false },
      { id: 'm12', name: '模拟面试', lessons: 10, completed: false }
    ]
  }
])

// 推荐资源
const recommendedResources = ref([
  {
    id: 1,
    type: 'video',
    icon: 'VideoCamera',
    color: '#409eff',
    title: 'Vue3源码全解析',
    description: '从零开始手写Vue3响应式系统，深入理解框架原理',
    author: '技术大牛',
    rating: 4.8,
    duration: '8小时',
    tags: ['Vue3', '源码', '进阶'],
    actionText: '开始学习'
  },
  {
    id: 2,
    type: 'document',
    icon: 'Document',
    color: '#67c23a',
    title: '前端面试题精选100道',
    description: '覆盖前端各个知识点的高频面试题及详解',
    author: '面试官',
    rating: 4.9,
    duration: '预计3天',
    tags: ['面试题', '全面'],
    actionText: '查看文档'
  },
  {
    id: 3,
    type: 'practice',
    icon: 'Headset',
    color: '#e6a23c',
    title: '1对1模拟面试',
    description: '真人面试官在线模拟，提供专业反馈',
    author: '资深面试官',
    rating: 5.0,
    duration: '45分钟',
    tags: ['实战', '反馈'],
    actionText: '预约面试'
  },
  {
    id: 4,
    type: 'book',
    icon: 'Reading',
    color: '#f56c6c',
    title: '《JavaScript高级程序设计》',
    description: '前端必读经典，深入理解JavaScript',
    author: 'Nicholas C. Zakas',
    rating: 4.9,
    duration: '30天读完',
    tags: ['经典', 'JavaScript'],
    actionText: '开始阅读'
  }
])

// 学习成就
const achievements = ref([
  {
    id: 1,
    name: '初出茅庐',
    description: '完成第一个学习任务',
    unlocked: true,
    color: '#67c23a',
    progress: 100
  },
  {
    id: 2,
    name: '持之以恒',
    description: '连续7天完成学习任务',
    unlocked: true,
    color: '#409eff',
    progress: 100
  },
  {
    id: 3,
    name: '面试达人',
    description: '完成10次模拟面试',
    unlocked: false,
    color: '#e6a23c',
    progress: 60
  },
  {
    id: 4,
    name: '知识专家',
    description: '掌握100个知识点',
    unlocked: false,
    color: '#f56c6c',
    progress: 45
  }
])

// 更新任务状态
const updateTaskStatus = async (task) => {
  // TODO: 调用后端API更新任务状态
  // await apiService.learning.updateTaskStatus(task.id, task.completed)

  if (task.completed) {
    dailyTasks.value.completed++
    ElMessage.success('恭喜完成学习任务！')
  } else {
    dailyTasks.value.completed--
  }
}

// 开始任务
const startTask = (task) => {
  // TODO: 根据任务类型跳转到相应页面
  switch (task.type) {
    case '面试练习':
      router.push('/dashboard/interview-practice')
      break
    case '编程练习':
      ElMessage.info('跳转到编程练习平台...')
      break
    default:
      ElMessage.info('开始学习任务...')
  }
}

// 查看模块详情
const viewModule = (module) => {
  // TODO: 跳转到模块详情页
  ElMessage.info(`查看模块：${module.name}`)
}

// 开始学习资源
const startResource = (resource) => {
  // TODO: 根据资源类型进行不同处理
  ElMessage.info(`开始学习：${resource.title}`)
}
</script>

<style scoped>
.personalized-learning-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 学习进度概览 */
.progress-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  margin-bottom: 30px;
}

.overview-left {
  flex: 1;
}

.overview-left h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.overview-left h4 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.overview-left p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.plan-meta {
  display: flex;
  gap: 30px;
  color: var(--text-secondary);
  font-size: 14px;
}

.plan-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.overview-right {
  display: flex;
  align-items: center;
  gap: 40px;
}

.progress-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-text .percentage {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.progress-text .label {
  font-size: 14px;
  color: var(--text-secondary);
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-stats .stat {
  text-align: center;
}

.progress-stats .stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.progress-stats .stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
}

/* 今日任务 */
.daily-tasks {
  padding: 30px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h3 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.task-item.completed {
  opacity: 0.6;
}

.task-content {
  flex: 1;
}

.task-content h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.task-content p {
  margin: 0 0 10px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.task-duration {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 13px;
}

/* 学习路径 */
.learning-path {
  padding: 30px;
  margin-bottom: 30px;
}

.learning-path h3 {
  font-size: 1.3rem;
  margin-bottom: 30px;
  color: var(--text-primary);
}

.path-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.path-stage {
  display: flex;
  gap: 30px;
  position: relative;
}

.stage-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.marker-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-weight: bold;
  z-index: 1;
}

.path-stage.active .marker-dot {
  background: var(--gradient-tech);
  border-color: transparent;
  color: white;
}

.path-stage.completed .marker-dot {
  background: #67c23a;
  border-color: transparent;
  color: white;
}

.marker-line {
  width: 2px;
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  margin: 5px 0;
}

.path-stage.completed .marker-line {
  background: #67c23a;
}

.stage-content {
  flex: 1;
  padding-bottom: 40px;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stage-header h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
}

.stage-description {
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
}

.stage-modules {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.module-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

/* 推荐资源 */
.recommended-resources {
  margin-bottom: 30px;
}

.recommended-resources h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.resource-card {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resource-type {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-info {
  flex: 1;
}

.resource-info h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.resource-info p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 15px;
}

.resource-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  font-size: 13px;
  color: var(--text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.resource-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 学习成就 */
.achievements {
  padding: 30px;
}

.achievements h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.achievement-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.achievement-item:not(.unlocked) {
  opacity: 0.5;
}

.achievement-item.unlocked {
  background: rgba(103, 194, 58, 0.1);
}

.achievement-icon {
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
}

.achievement-info h5 {
  margin: 0 0 5px 0;
  color: var(--text-primary);
}

.achievement-info p {
  margin: 0 0 10px 0;
  color: var(--text-secondary);
  font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .progress-overview {
    flex-direction: column;
    gap: 30px;
  }

  .overview-right {
    width: 100%;
    justify-content: center;
  }

  .task-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>
