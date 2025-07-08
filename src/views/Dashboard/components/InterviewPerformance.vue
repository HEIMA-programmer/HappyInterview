<template>
  <div class="performance-container">
    <div class="page-header">
      <h2 class="page-title">面试表现分析</h2>
      <p class="page-subtitle">全方位评估您的面试能力，追踪进步轨迹</p>
    </div>

    <!-- 综合评分 -->
    <div class="overview-section">
      <div class="score-card glass-card">
        <div class="score-main">
          <div class="score-circle">
            <svg width="200" height="200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255, 255, 255, 0.1)"
                stroke-width="20"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                :stroke="scoreColor"
                stroke-width="20"
                fill="none"
                :stroke-dasharray="scoreCircumference"
                :stroke-dashoffset="scoreOffset"
                transform="rotate(-90 100 100)"
                style="transition: stroke-dashoffset 1s ease"
              />
            </svg>
            <div class="score-text">
              <span class="score-number">{{ overallScore }}</span>
              <span class="score-label">综合评分</span>
            </div>
          </div>
        </div>
        <div class="score-info">
          <h3>表现评级：{{ scoreLevel }}</h3>
          <p>{{ scoreComment }}</p>
          <div class="score-stats">
            <div class="stat-item">
              <span class="stat-label">超过了</span>
              <span class="stat-value">{{ betterThan }}%</span>
              <span class="stat-label">的用户</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">本月提升</span>
              <span class="stat-value">{{ improvement }}%</span>
              <span class="stat-label">↑</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 能力雷达图 -->
    <div class="radar-section glass-card">
      <div class="section-header">
        <h3>能力维度分析</h3>
        <el-button-group>
          <el-button
            v-for="period in periods"
            :key="period.value"
            :type="selectedPeriod === period.value ? 'primary' : ''"
            @click="changePeriod(period.value)"
            size="small"
          >
            {{ period.label }}
          </el-button>
        </el-button-group>
      </div>
      <div ref="radarChart" class="radar-chart"></div>
    </div>

    <!-- 详细指标 -->
    <div class="metrics-section">
      <h3>详细指标分析</h3>
      <div class="metrics-grid">
        <div
          v-for="metric in detailMetrics"
          :key="metric.name"
          class="metric-card glass-card hover-float"
        >
          <div class="metric-header">
            <el-icon :size="30" :color="metric.color">
              <component :is="metric.icon" />
            </el-icon>
            <span class="metric-name">{{ metric.name }}</span>
          </div>
          <div class="metric-score">
            <span class="score">{{ metric.score }}</span>
            <span class="total">/100</span>
          </div>
          <el-progress
            :percentage="metric.score"
            :color="metric.color"
            :show-text="false"
          />
          <div class="metric-details">
            <p class="metric-desc">{{ metric.description }}</p>
            <div class="metric-tags">
              <el-tag
                v-for="tag in metric.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="metric-feedback">
            <h5>改进建议</h5>
            <ul>
              <li v-for="(suggestion, index) in metric.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
          <div class="metric-actions">
            <el-button size="small" @click="startTargetedPractice(metric.name)">
              针对练习
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史趋势 -->
    <div class="trend-section glass-card">
      <div class="section-header">
        <h3>能力提升趋势</h3>
        <el-select v-model="trendDimension" size="small" @change="updateTrendChart">
          <el-option label="综合评分" value="overall" />
          <el-option label="专业知识" value="professional" />
          <el-option label="表达能力" value="expression" />
          <el-option label="逻辑思维" value="logic" />
        </el-select>
      </div>
      <div ref="trendChart" class="trend-chart"></div>
    </div>

    <!-- 面试记录 -->
    <div class="records-section glass-card">
      <h3>最近面试记录</h3>
      <el-table :data="recentRecords" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'simulation' ? 'primary' : 'success'">
              {{ scope.row.type === 'simulation' ? '模拟面试' : '练习模式' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="岗位" />
        <el-table-column prop="duration" label="时长" />
        <el-table-column prop="score" label="得分" width="100">
          <template #default="scope">
            <span class="score-text" :style="{ color: getScoreColor(scope.row.score) }">
              {{ scope.row.score }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">
              查看详情
            </el-button>
            <el-button size="small" type="primary" @click="replay(scope.row)">
              回放
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 个性化建议 -->
    <div class="advice-section glass-card">
      <h3>AI个性化建议</h3>
      <div class="advice-content">
        <el-alert
          v-for="(advice, index) in personalAdvice"
          :key="index"
          :type="advice.type"
          :closable="false"
          show-icon
        >
          <template #title>
            {{ advice.title }}
          </template>
          <template #default>
            <p>{{ advice.content }}</p>
            <el-button
              v-if="advice.action"
              type="text"
              size="small"
              @click="handleAdviceAction(advice.action, advice.actionData)"
            >
              {{ advice.actionText }} →
            </el-button>
          </template>
        </el-alert>
      </div>
    </div>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="面试详情"
      width="80%"
      top="5vh"
    >
      <div class="detail-content" v-if="currentRecord">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="面试类型">
              {{ currentRecord.type === 'simulation' ? '模拟面试' : '练习模式' }}
            </el-descriptions-item>
            <el-descriptions-item label="面试公司">
              {{ currentRecord.company }}
            </el-descriptions-item>
            <el-descriptions-item label="应聘岗位">
              {{ currentRecord.position }}
            </el-descriptions-item>
            <el-descriptions-item label="面试时间">
              {{ formatDate(currentRecord.date) }}
            </el-descriptions-item>
            <el-descriptions-item label="面试时长">
              {{ currentRecord.duration }}
            </el-descriptions-item>
            <el-descriptions-item label="综合评分">
              {{ currentRecord.score }}分
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 详细分析 -->
        <div class="detail-section">
          <h4>详细分析</h4>
          <div class="analysis-charts">
            <div class="chart-container">
              <h5>能力雷达图</h5>
              <div ref="detailRadarChart" class="detail-radar-chart"></div>
            </div>
            <div class="chart-container">
              <h5>表现时间线</h5>
              <div ref="timelineChart" class="timeline-chart"></div>
            </div>
          </div>
        </div>

        <!-- 问答记录 -->
        <div class="detail-section">
          <h4>问答记录</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(qa, index) in currentRecord.qaRecords"
              :key="index"
              :timestamp="qa.timestamp"
            >
              <div class="qa-item">
                <div class="question">
                  <el-icon><QuestionFilled /></el-icon>
                  <span>{{ qa.question }}</span>
                </div>
                <div class="answer">
                  <el-icon><Comment /></el-icon>
                  <span>{{ qa.answer }}</span>
                </div>
                <div class="qa-feedback" v-if="qa.feedback">
                  <el-tag type="info" size="small">AI反馈</el-tag>
                  <span>{{ qa.feedback }}</span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>

    <!-- 回放对话框 -->
    <el-dialog
      v-model="showReplayDialog"
      title="面试回放"
      width="90%"
      top="5vh"
    >
      <div class="replay-content">
        <div class="video-container">
          <video
            ref="replayVideo"
            controls
            class="replay-video"
            @loadedmetadata="onVideoLoaded"
          >
            <source :src="replayVideoSrc" type="video/mp4">
            您的浏览器不支持视频播放
          </video>
        </div>
        <div class="replay-controls">
          <el-button @click="playFromTimestamp('00:05:30')">跳转到自我介绍</el-button>
          <el-button @click="playFromTimestamp('00:12:15')">跳转到技术问答</el-button>
          <el-button @click="playFromTimestamp('00:18:45')">跳转到项目介绍</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import {
  Reading,
  ChatLineSquare,
  TrendCharts,
  Timer,
  Trophy,
  QuestionFilled,
  Comment
} from '@element-plus/icons-vue'

const router = useRouter()

// 图表实例
let radarChartInstance = null
let trendChartInstance = null
let detailRadarChartInstance = null
let timelineChartInstance = null

const radarChart = ref(null)
const trendChart = ref(null)
const detailRadarChart = ref(null)
const timelineChart = ref(null)
const replayVideo = ref(null)

// 数据状态
const overallScore = ref(85)
const selectedPeriod = ref('current')
const trendDimension = ref('overall')
const showDetailDialog = ref(false)
const showReplayDialog = ref(false)
const currentRecord = ref(null)
const replayVideoSrc = ref('')

// 时间周期选项
const periods = [
  { label: '本次', value: 'current' },
  { label: '近一周', value: 'week' },
  { label: '近一月', value: 'month' }
]

// 计算属性
const scoreCircumference = computed(() => `${2 * Math.PI * 90}`)
const scoreOffset = computed(() => {
  const percentage = (100 - overallScore.value) / 100
  return percentage * 2 * Math.PI * 90
})

const scoreColor = computed(() => {
  if (overallScore.value >= 90) return '#67c23a'
  if (overallScore.value >= 80) return '#409eff'
  if (overallScore.value >= 70) return '#e6a23c'
  return '#f56c6c'
})

const scoreLevel = computed(() => {
  if (overallScore.value >= 90) return '优秀'
  if (overallScore.value >= 80) return '良好'
  if (overallScore.value >= 70) return '中等'
  if (overallScore.value >= 60) return '及格'
  return '待提升'
})

const scoreComment = computed(() => {
  if (overallScore.value >= 90) return '您的面试表现非常出色，保持这个状态！'
  if (overallScore.value >= 80) return '表现良好，还有一些细节可以优化'
  if (overallScore.value >= 70) return '基础扎实，需要加强某些方面的训练'
  return '建议多加练习，重点提升薄弱环节'
})

const betterThan = ref(78)
const improvement = ref(12)

// 详细指标数据
const detailMetrics = ref([
  {
    name: '专业知识',
    score: 90,
    icon: 'Reading',
    color: '#409eff',
    description: '技术深度和广度的综合评估',
    tags: ['算法', '数据结构', '框架原理'],
    suggestions: [
      '建议深入学习Vue3的响应式原理',
      '加强对算法复杂度分析的理解'
    ]
  },
  {
    name: '表达能力',
    score: 85,
    icon: 'ChatLineSquare',
    color: '#67c23a',
    description: '语言组织和沟通效果评估',
    tags: ['逻辑清晰', '语速适中'],
    suggestions: [
      '回答时可以更多使用STAR法则',
      '适当增加一些具体的案例说明'
    ]
  },
  {
    name: '逻辑思维',
    score: 88,
    icon: 'TrendCharts',
    color: '#e6a23c',
    description: '问题分析和解决方案的逻辑性',
    tags: ['结构化思维', '问题拆解'],
    suggestions: [
      '在复杂问题上可以先理清思路再回答',
      '多使用"首先、其次、最后"等结构化表达'
    ]
  },
  {
    name: '应变能力',
    score: 82,
    icon: 'Timer',
    color: '#f56c6c',
    description: '面对压力和突发问题的处理能力',
    tags: ['冷静应对', '灵活变通'],
    suggestions: [
      '遇到不会的问题可以坦诚说明思考过程',
      '多练习一些压力面试场景'
    ]
  },
  {
    name: '职业素养',
    score: 92,
    icon: 'Trophy',
    color: '#909399',
    description: '职业态度和综合素质评估',
    tags: ['积极主动', '团队意识'],
    suggestions: [
      '保持当前的职业态度',
      '可以多了解目标公司的文化价值观'
    ]
  }
])

// 最近面试记录
const recentRecords = ref([
  {
    id: 1,
    date: '2024-01-20',
    type: 'simulation',
    company: '字节跳动',
    position: '前端开发',
    duration: '35分钟',
    score: 85,
    qaRecords: [
      {
        timestamp: '14:30:15',
        question: '请做一下自我介绍',
        answer: '我是一名前端开发工程师，有3年的开发经验...',
        feedback: '自我介绍结构清晰，但可以更突出与岗位的匹配度'
      }
    ]
  },
  {
    id: 2,
    date: '2024-01-19',
    type: 'practice',
    company: '模拟公司',
    position: '前端开发',
    duration: '28分钟',
    score: 82
  }
])

// 个性化建议
const personalAdvice = ref([
  {
    type: 'success',
    title: '优势保持',
    content: '您的专业知识和职业素养表现优秀，这是您的核心竞争力。建议继续保持并深化这些优势。',
    action: 'knowledge',
    actionText: '查看知识库',
    actionData: { category: 'advanced' }
  },
  {
    type: 'warning',
    title: '重点提升',
    content: '应变能力是您目前的相对短板，建议通过压力面试练习来提升这方面的能力。',
    action: 'practice',
    actionText: '开始压力练习',
    actionData: { type: 'stress', difficulty: 'hard' }
  },
  {
    type: 'info',
    title: '学习建议',
    content: '基于您的面试表现，推荐学习《程序员面试宝典》中的行为面试章节，提升软技能。',
    action: 'learning',
    actionText: '查看学习资源',
    actionData: { resource: 'interview-guide', chapter: 'behavioral' }
  }
])

// 方法
const changePeriod = (period) => {
  selectedPeriod.value = period
  updateRadarChart()
}

const updateTrendChart = () => {
  if (!trendChartInstance) return

  // TODO: 根据选择的维度更新趋势图数据
  // const data = await apiService.performance.getTrendData(trendDimension.value)

  // 模拟更新数据
  const dates = []
  const scores = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }))
    scores.push(Math.floor(Math.random() * 15 + 75 + i * 0.3))
  }

  trendChartInstance.setOption({
    xAxis: { data: dates },
    series: [{ data: scores }]
  })
}

const startTargetedPractice = (metricName) => {
  ElMessage.success(`正在为您准备${metricName}的专项练习...`)

  // 根据不同指标跳转到相应的练习
  const practiceRoutes = {
    '专业知识': '/dashboard/knowledge-base?category=technical',
    '表达能力': '/dashboard/interview-practice?focus=expression',
    '逻辑思维': '/dashboard/interview-practice?focus=logic',
    '应变能力': '/dashboard/interview-practice?type=stress',
    '职业素养': '/dashboard/personalized-learning?focus=professional'
  }

  const route = practiceRoutes[metricName]
  if (route) {
    router.push(route)
  }
}

const viewDetail = (record) => {
  currentRecord.value = record
  showDetailDialog.value = true

  // 延迟初始化详情图表
  nextTick(() => {
    initDetailCharts()
  })
}

const replay = (record) => {
  // TODO: 从后端获取回放视频URL
  // replayVideoSrc.value = await apiService.interview.getReplayUrl(record.id)

  // 模拟视频URL
  replayVideoSrc.value = '/mock-interview-replay.mp4'
  currentRecord.value = record
  showReplayDialog.value = true

  ElMessage.info('正在加载面试回放...')
}

const playFromTimestamp = (timestamp) => {
  if (replayVideo.value) {
    // 将时间戳转换为秒数
    const parts = timestamp.split(':')
    const seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    replayVideo.value.currentTime = seconds
    replayVideo.value.play()
  }
}

const onVideoLoaded = () => {
  ElMessage.success('视频加载完成')
}

const handleAdviceAction = (action, actionData) => {
  switch (action) {
    case 'knowledge':
      router.push(`/dashboard/knowledge-base?category=${actionData.category}`)
      break
    case 'practice':
      if (actionData.type === 'stress') {
        ElMessage.success('正在为您准备压力面试场景...')
        router.push(`/dashboard/interview-practice?type=${actionData.type}&difficulty=${actionData.difficulty}`)
      } else {
        router.push('/dashboard/interview-practice')
      }
      break
    case 'learning':
      router.push(`/dashboard/personalized-learning?resource=${actionData.resource}&chapter=${actionData.chapter}`)
      break
    default:
      ElMessage.info('功能开发中...')
  }
}

const getScoreColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#409eff'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 图表初始化方法
const initRadarChart = () => {
  if (!radarChart.value) return

  radarChartInstance = echarts.init(radarChart.value)
  updateRadarChart()
}

const updateRadarChart = () => {
  if (!radarChartInstance) return

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: { color: '#fff' }
    },
    radar: {
      indicator: [
        { name: '专业知识', max: 100 },
        { name: '表达能力', max: 100 },
        { name: '逻辑思维', max: 100 },
        { name: '应变能力', max: 100 },
        { name: '职业素养', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: '65%',
      splitNumber: 5,
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      splitArea: { areaStyle: { color: ['rgba(64, 158, 255, 0.05)', 'rgba(64, 158, 255, 0.1)'] } },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
      axisLabel: { color: 'var(--text-secondary)' }
    },
    series: [{
      name: '能力评分',
      type: 'radar',
      data: [
        {
          value: [90, 85, 88, 82, 92],
          name: '当前能力',
          lineStyle: { color: '#409eff', width: 2 },
          areaStyle: { color: 'rgba(64, 158, 255, 0.3)' },
          itemStyle: { color: '#409eff' }
        },
        {
          value: [85, 80, 82, 78, 88],
          name: '上月能力',
          lineStyle: { color: '#67c23a', width: 2, type: 'dashed' },
          areaStyle: { color: 'rgba(103, 194, 58, 0.2)' },
          itemStyle: { color: '#67c23a' }
        }
      ]
    }]
  }

  radarChartInstance.setOption(option)
}

const initTrendChart = () => {
  if (!trendChart.value) return

  trendChartInstance = echarts.init(trendChart.value)

  const dates = []
  const scores = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }))
    scores.push(Math.floor(Math.random() * 15 + 75 + i * 0.3))
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: { color: '#fff' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
      axisLabel: { color: 'var(--text-secondary)' }
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
      axisLabel: { color: 'var(--text-secondary)' },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      name: '评分趋势',
      type: 'line',
      smooth: true,
      data: scores,
      lineStyle: { color: '#409eff', width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
        ])
      },
      itemStyle: { color: '#409eff' },
      markLine: {
        data: [{ type: 'average', name: '平均值' }],
        lineStyle: { color: '#67c23a' }
      }
    }]
  }

  trendChartInstance.setOption(option)
}

const initDetailCharts = () => {
  // 详情雷达图
  if (detailRadarChart.value && !detailRadarChartInstance) {
    detailRadarChartInstance = echarts.init(detailRadarChart.value)
    // 使用当前记录的具体数据
    const option = {
      radar: {
        indicator: [
          { name: '专业知识', max: 100 },
          { name: '表达能力', max: 100 },
          { name: '逻辑思维', max: 100 },
          { name: '应变能力', max: 100 },
          { name: '职业素养', max: 100 }
        ],
        radius: '65%'
      },
      series: [{
        type: 'radar',
        data: [{
          value: [88, 82, 85, 79, 90],
          name: '本次面试',
          lineStyle: { color: '#409eff' },
          areaStyle: { color: 'rgba(64, 158, 255, 0.3)' }
        }]
      }]
    }
    detailRadarChartInstance.setOption(option)
  }

  // 时间线图表
  if (timelineChart.value && !timelineChartInstance) {
    timelineChartInstance = echarts.init(timelineChart.value)
    const option = {
      xAxis: { type: 'category', data: ['开始', '自我介绍', '技术问答', '项目介绍', '提问环节', '结束'] },
      yAxis: { type: 'value', max: 100 },
      series: [{
        type: 'line',
        data: [0, 85, 88, 82, 90, 85],
        lineStyle: { color: '#67c23a' },
        itemStyle: { color: '#67c23a' }
      }]
    }
    timelineChartInstance.setOption(option)
  }
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initRadarChart()
    initTrendChart()

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      radarChartInstance?.resize()
      trendChartInstance?.resize()
      detailRadarChartInstance?.resize()
      timelineChartInstance?.resize()
    })
  })
})
</script>

<style scoped>
/* 保持原有样式，添加新的样式 */
.performance-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.page-subtitle {
  color: var(--text-secondary);
}

/* 综合评分 */
.overview-section {
  margin-bottom: 30px;
}

.score-card {
  display: flex;
  align-items: center;
  padding: 40px;
  gap: 60px;
}

.score-main {
  flex-shrink: 0;
}

.score-circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-number {
  display: block;
  font-size: 3rem;
  font-weight: bold;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.score-label {
  display: block;
  color: var(--text-secondary);
  margin-top: 5px;
}

.score-info {
  flex: 1;
}

.score-info h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.score-info p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 25px;
}

.score-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

/* 雷达图 */
.radar-section {
  padding: 30px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0;
}

.radar-chart {
  height: 400px;
}

/* 详细指标 */
.metrics-section {
  margin-bottom: 30px;
}

.metrics-section h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.metric-card {
  padding: 25px;
  transition: all 0.3s ease;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.metric-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-primary);
}

.metric-score {
  margin-bottom: 10px;
}

.metric-score .score {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-primary);
}

.metric-score .total {
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.metric-details {
  margin: 15px 0;
}

.metric-desc {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 10px;
}

.metric-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.metric-feedback {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.metric-feedback h5 {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.metric-feedback ul {
  margin: 0;
  padding-left: 20px;
}

.metric-feedback li {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.8;
}

.metric-actions {
  margin-top: 15px;
  text-align: center;
}

/* 趋势图 */
.trend-section {
  padding: 30px;
  margin-bottom: 30px;
}

.trend-chart {
  height: 300px;
}

/* 面试记录 */
.records-section {
  padding: 30px;
  margin-bottom: 30px;
}

.records-section h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.score-text {
  font-weight: bold;
}

/* 个性化建议 */
.advice-section {
  padding: 30px;
}

.advice-section h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.advice-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 详情对话框 */
.detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.analysis-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.chart-container h5 {
  color: var(--text-primary);
  margin-bottom: 15px;
  text-align: center;
}

.detail-radar-chart,
.timeline-chart {
  height: 300px;
}

.qa-item {
  padding: 15px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.question,
.answer {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  line-height: 1.6;
}

.question {
  color: var(--text-primary);
  font-weight: bold;
}

.answer {
  color: var(--text-secondary);
}

.qa-feedback {
  margin-top: 10px;
  padding: 10px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.qa-feedback .el-tag {
  margin-right: 10px;
}

/* 回放对话框 */
.replay-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-container {
  text-align: center;
}

.replay-video {
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: 8px;
}

.replay-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .score-card {
    flex-direction: column;
    text-align: center;
  }

  .score-stats {
    justify-content: center;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .analysis-charts {
    grid-template-columns: 1fr;
  }
}
</style>
