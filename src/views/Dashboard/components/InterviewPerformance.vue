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
            @click="selectedPeriod = period.value"
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
        </div>
      </div>
    </div>

    <!-- 历史趋势 -->
    <div class="trend-section glass-card">
      <div class="section-header">
        <h3>能力提升趋势</h3>
        <el-select v-model="trendDimension" size="small">
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
        <el-table-column label="操作" width="150">
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
              @click="handleAdviceAction(advice.action)"
            >
              {{ advice.actionText }} →
            </el-button>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'


const router = useRouter()

// 图表实例
let radarChartInstance = null
let trendChartInstance = null
const radarChart = ref(null)
const trendChart = ref(null)

// 数据状态
const overallScore = ref(85)
const selectedPeriod = ref('current')
const trendDimension = ref('overall')

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
    position: '前端开发',
    duration: '35分钟',
    score: 85
  },
  {
    id: 2,
    date: '2024-01-19',
    type: 'practice',
    position: '前端开发',
    duration: '28分钟',
    score: 82
  },
  {
    id: 3,
    date: '2024-01-18',
    type: 'simulation',
    position: '全栈开发',
    duration: '40分钟',
    score: 78
  }
])

// 个性化建议
const personalAdvice = ref([
  {
    type: 'success',
    title: '优势保持',
    content: '您的专业知识和职业素养表现优秀，这是您的核心竞争力。建议继续保持并深化这些优势。',
    action: 'knowledge',
    actionText: '查看知识库'
  },
  {
    type: 'warning',
    title: '重点提升',
    content: '应变能力是您目前的相对短板，建议通过压力面试练习来提升这方面的能力。',
    action: 'practice',
    actionText: '开始压力练习'
  },
  {
    type: 'info',
    title: '学习建议',
    content: '基于您的面试表现，推荐学习《程序员面试宝典》中的行为面试章节，提升软技能。',
    action: 'learning',
    actionText: '查看学习资源'
  }
])

// 初始化雷达图
const initRadarChart = () => {
  if (!radarChart.value) return

  radarChartInstance = echarts.init(radarChart.value)

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      }
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
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(64, 158, 255, 0.05)', 'rgba(64, 158, 255, 0.1)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisLabel: {
        color: 'var(--text-secondary)'
      }
    },
    series: [
      {
        name: '能力评分',
        type: 'radar',
        data: [
          {
            value: [90, 85, 88, 82, 92],
            name: '当前能力',
            lineStyle: {
              color: '#409eff',
              width: 2
            },
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.3)'
            },
            itemStyle: {
              color: '#409eff'
            }
          },
          {
            value: [85, 80, 82, 78, 88],
            name: '上月能力',
            lineStyle: {
              color: '#67c23a',
              width: 2,
              type: 'dashed'
            },
            areaStyle: {
              color: 'rgba(103, 194, 58, 0.2)'
            },
            itemStyle: {
              color: '#67c23a'
            }
          }
        ]
      }
    ]
  }

  radarChartInstance.setOption(option)

  // TODO: 从后端获取真实数据
  // const data = await apiService.analysis.getReport(currentInterviewId)
  // 更新图表数据
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChart.value) return

  trendChartInstance = echarts.init(trendChart.value)

  const dates = []
  const scores = []

  // 生成模拟数据
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
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisLabel: {
        color: 'var(--text-secondary)'
      }
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisLabel: {
        color: 'var(--text-secondary)'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    series: [
      {
        name: '评分趋势',
        type: 'line',
        smooth: true,
        data: scores,
        lineStyle: {
          color: '#409eff',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ])
        },
        itemStyle: {
          color: '#409eff'
        },
        markLine: {
          data: [
            {
              type: 'average',
              name: '平均值',
              label: {
                formatter: '平均: {c}'
              }
            }
          ],
          lineStyle: {
            color: '#67c23a'
          }
        }
      }
    ]
  }

  trendChartInstance.setOption(option)
}

// 获取分数颜色
const getScoreColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#409eff'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 查看详情
const viewDetail = (record) => {
  // TODO: 跳转到详细报告页面
  console.log('查看详情', record)
}

// 回放
const replay = (record) => {
  // TODO: 跳转到回放页面
  console.log('回放', record)
}

// 处理建议操作
const handleAdviceAction = (action) => {
  switch (action) {
    case 'knowledge':
      router.push('/dashboard/knowledge-base')
      break
    case 'practice':
      router.push('/dashboard/interview-practice')
      break
    case 'learning':
      router.push('/dashboard/personalized-learning')
      break
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
    })
  })

  // TODO: 加载真实数据
  // loadPerformanceData()
})
</script>

<style scoped>
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
}
</style>
