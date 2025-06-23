<template>
  <div class="history-container">
    <div class="page-header">
      <h2 class="page-title">历史会话记录</h2>
      <p class="page-subtitle">回顾您的面试历程，追踪成长轨迹</p>
    </div>

    <!-- 筛选和统计 -->
    <div class="filter-section glass-card">
      <div class="filter-left">
        <el-select v-model="filters.type" placeholder="面试类型" clearable>
          <el-option label="全部类型" value="" />
          <el-option label="模拟面试" value="simulation" />
          <el-option label="练习模式" value="practice" />
        </el-select>

        <el-select v-model="filters.position" placeholder="岗位类型" clearable>
          <el-option label="全部岗位" value="" />
          <el-option label="前端开发" value="frontend" />
          <el-option label="后端开发" value="backend" />
          <el-option label="产品经理" value="product" />
          <el-option label="算法工程师" value="algorithm" />
        </el-select>

        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />

        <el-button type="primary" @click="handleSearch">
          搜索
        </el-button>
        <el-button @click="resetFilters">
          重置
        </el-button>
      </div>

      <div class="filter-right">
        <div class="stat-item">
          <span class="stat-label">总计</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">本月</span>
          <span class="stat-value">{{ monthCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均分</span>
          <span class="stat-value">{{ avgScore }}</span>
        </div>
      </div>
    </div>

    <!-- 历史记录列表 -->
    <div class="history-list">
      <div
        v-for="record in historyRecords"
        :key="record.id"
        class="history-card glass-card hover-float"
        @click="viewDetail(record)"
      >
        <div class="card-header">
          <div class="header-left">
            <el-tag :type="record.type === 'simulation' ? 'primary' : 'success'" size="small">
              {{ record.type === 'simulation' ? '模拟面试' : '练习模式' }}
            </el-tag>
            <span class="interview-date">{{ formatDate(record.date) }}</span>
          </div>
          <div class="header-right">
            <el-rate
              v-model="record.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}分"
            />
          </div>
        </div>

        <div class="card-content">
          <h3 class="interview-title">
            {{ record.company }} - {{ record.position }}
            <span class="interview-round">{{ record.round }}</span>
          </h3>

          <div class="interview-info">
            <div class="info-item">
              <el-icon><Timer /></el-icon>
              <span>时长：{{ record.duration }}</span>
            </div>
            <div class="info-item">
              <el-icon><ChatDotSquare /></el-icon>
              <span>问题：{{ record.questionCount }}个</span>
            </div>
            <div class="info-item">
              <el-icon><User /></el-icon>
              <span>面试官：{{ record.interviewer }}</span>
            </div>
          </div>

          <!-- 能力评分概览 -->
          <div class="score-overview">
            <div
              v-for="(score, key) in record.scores"
              :key="key"
              class="score-item"
            >
              <span class="score-label">{{ scoreLabels[key] }}</span>
              <el-progress
                :percentage="score"
                :color="getScoreColor(score)"
                :stroke-width="6"
              />
            </div>
          </div>

          <!-- 关键反馈 -->
          <div class="key-feedback">
            <p class="feedback-title">关键反馈：</p>
            <p class="feedback-content">{{ record.keyFeedback }}</p>
          </div>
        </div>

        <div class="card-footer">
          <el-button size="small" @click.stop="viewReport(record)">
            <el-icon><Document /></el-icon>
            查看报告
          </el-button>
          <el-button size="small" @click.stop="playback(record)">
            <el-icon><VideoPlay /></el-icon>
            视频回放
          </el-button>
          <el-button size="small" @click.stop="practiceAgain(record)">
            <el-icon><RefreshRight /></el-icon>
            再次练习
          </el-button>
          <el-button size="small" text type="danger" @click.stop="deleteRecord(record)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="historyRecords.length === 0" class="empty-state">
      <el-empty description="暂无面试记录">
        <el-button type="primary" @click="startInterview">
          开始面试
        </el-button>
      </el-empty>
    </div>

    <!-- 分页 -->
    <div v-if="totalCount > pageSize" class="pagination-wrap">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
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
              {{ currentRecord.rating }}分
            </el-descriptions-item>
          </el-descriptions>
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
  </div>
</template>

<script>
export default {
  name: 'HistoryView'
}
</script>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Timer,
  ChatDotSquare,
  User,
  Document,
  VideoPlay,
  RefreshRight,
  Delete,
  QuestionFilled,
  Comment
} from '@element-plus/icons-vue'

const router = useRouter()

// 筛选条件
const filters = ref({
  type: '',
  position: '',
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(25)

// 统计数据
const monthCount = ref(12)
const avgScore = ref(85.5)

// 历史记录数据（模拟数据）
const historyRecords = ref([
  {
    id: 1,
    type: 'simulation',
    date: '2024-01-20 14:30',
    company: '字节跳动',
    position: '前端开发工程师',
    round: '一面',
    duration: '45分钟',
    questionCount: 8,
    interviewer: 'AI面试官-张经理',
    rating: 4.5,
    scores: {
      professional: 90,
      expression: 85,
      logic: 88,
      adaptability: 82,
      attitude: 92
    },
    keyFeedback: '技术基础扎实，项目经验丰富。建议在回答时增加更多具体的技术细节和数据支撑。',
    qaRecords: [
      {
        timestamp: '14:30:15',
        question: '请做一下自我介绍',
        answer: '我是一名前端开发工程师，有3年的开发经验...',
        feedback: '自我介绍结构清晰，但可以更突出与岗位的匹配度'
      },
      {
        timestamp: '14:35:20',
        question: '介绍一下你最有成就感的项目',
        answer: '我参与开发的电商平台项目，日活用户达到100万...',
        feedback: '项目介绍详细，数据支撑充分'
      }
    ]
  },
  {
    id: 2,
    type: 'practice',
    date: '2024-01-19 10:00',
    company: '模拟公司',
    position: '前端开发工程师',
    round: '练习',
    duration: '30分钟',
    questionCount: 5,
    interviewer: 'AI陪练助手',
    rating: 4.0,
    scores: {
      professional: 85,
      expression: 82,
      logic: 86,
      adaptability: 80,
      attitude: 88
    },
    keyFeedback: '基础知识掌握良好，需要加强算法和数据结构方面的准备。'
  },
  {
    id: 3,
    type: 'simulation',
    date: '2024-01-18 16:00',
    company: '阿里巴巴',
    position: '高级前端工程师',
    round: '二面',
    duration: '60分钟',
    questionCount: 10,
    interviewer: 'AI面试官-李总监',
    rating: 4.2,
    scores: {
      professional: 88,
      expression: 84,
      logic: 87,
      adaptability: 83,
      attitude: 90
    },
    keyFeedback: '技术深度不错，但在系统设计方面还需要更多积累。建议多了解大型项目的架构设计。'
  }
])

// 分数标签映射
const scoreLabels = {
  professional: '专业知识',
  expression: '表达能力',
  logic: '逻辑思维',
  adaptability: '应变能力',
  attitude: '职业素养'
}

// 当前查看的记录
const showDetailDialog = ref(false)
const currentRecord = ref(null)

// 获取分数颜色
const getScoreColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#409eff'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 格式化日期
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 搜索
const handleSearch = async () => {
  // TODO: 调用后端API搜索
  // const params = {
  //   type: filters.value.type,
  //   position: filters.value.position,
  //   startDate: filters.value.dateRange?.[0],
  //   endDate: filters.value.dateRange?.[1],
  //   page: currentPage.value,
  //   pageSize: pageSize.value
  // }
  // const { list, total } = await apiService.interview.getHistory(params)
  // historyRecords.value = list
  // totalCount.value = total

  ElMessage.success('搜索完成')
}

// 重置筛选
const resetFilters = () => {
  filters.value = {
    type: '',
    position: '',
    dateRange: []
  }
  handleSearch()
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  handleSearch()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  handleSearch()
}

// 查看详情
const viewDetail = (record) => {
  currentRecord.value = record
  showDetailDialog.value = true
}

// 查看报告
const viewReport = (record) => {
  // TODO: 跳转到报告页面
  router.push(`/dashboard/report/${record.id}`)
}

// 视频回放
const playback = () => {
  // TODO: 跳转到回放页面
  ElMessage.info('视频回放功能开发中...')
}

// 再次练习
const practiceAgain = (record) => {
  ElMessageBox.confirm(
    '是否基于这次面试的设置再次练习？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    router.push({
      path: '/dashboard/interview-practice',
      query: {
        position: record.position,
        company: record.company
      }
    })
  })
}

// 删除记录
const deleteRecord = async (record) => {
  try {
    await ElMessageBox.confirm(
      '删除后将无法恢复，确定要删除这条记录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用后端API删除
    // await apiService.interview.delete(record.id)

    const index = historyRecords.value.findIndex(r => r.id === record.id)
    historyRecords.value.splice(index, 1)
    totalCount.value--

    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 开始面试
const startInterview = () => {
  router.push('/dashboard/interview-practice')
}

// 加载数据
const loadHistory = async () => {
  // TODO: 调用后端API获取历史记录
  // const { list, total } = await apiService.interview.getHistory({
  //   page: currentPage.value,
  //   pageSize: pageSize.value
  // })
  // historyRecords.value = list
  // totalCount.value = total
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 筛选区域 */
.filter-section {
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-left {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  flex: 1;
}

.filter-right {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

/* 历史记录列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.history-card {
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.interview-date {
  color: var(--text-secondary);
  font-size: 14px;
}

.card-content {
  margin-bottom: 20px;
}

.interview-title {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.interview-round {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 10px;
}

.interview-info {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 14px;
}

/* 能力评分 */
.score-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.score-label {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 关键反馈 */
.key-feedback {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid var(--primary-color);
}

.feedback-title {
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.feedback-content {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
}

/* 分页 */
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 30px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }

  .filter-left,
  .filter-right {
    width: 100%;
    justify-content: center;
  }

  .interview-info {
    flex-direction: column;
    gap: 10px;
  }

  .card-footer {
    flex-wrap: wrap;
  }
}
</style>
