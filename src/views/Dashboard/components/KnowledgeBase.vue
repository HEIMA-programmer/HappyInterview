<template>
  <div class="knowledge-base-container">
    <div class="page-header">
      <h2 class="page-title">面试知识库</h2>
      <p class="page-subtitle">系统化的面试题库和知识点，助您全面准备</p>
    </div>

    <!-- 知识库导航 -->
    <div class="kb-navigation glass-card">
      <div class="nav-tabs">
        <div
          v-for="category in categories"
          :key="category.id"
          class="nav-tab"
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          <el-icon :size="20">
            <component :is="category.icon" />
          </el-icon>
          <span>{{ category.name }}</span>
          <el-badge :value="category.count" type="info" />
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索题目、知识点..."
        size="large"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>

      <div class="filter-tags">
        <el-tag
          v-for="tag in hotTags"
          :key="tag"
          :type="selectedTags.includes(tag) ? 'primary' : 'info'"
          effect="plain"
          round
          @click="toggleTag(tag)"
          style="cursor: pointer; margin-right: 10px;"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <!-- 知识点列表 -->
    <div class="knowledge-content">
      <!-- 左侧：题目列表 -->
      <div class="content-left">
        <div class="question-list">
          <div
            v-for="item in filteredQuestions"
            :key="item.id"
            class="question-item glass-card"
            :class="{ active: selectedQuestion?.id === item.id }"
            @click="selectQuestion(item)"
          >
            <div class="question-header">
              <h4>{{ item.title }}</h4>
              <el-tag :type="getDifficultyType(item.difficulty)" size="small">
                {{ item.difficulty }}
              </el-tag>
            </div>
            <div class="question-meta">
              <span class="meta-item">
                <el-icon><Collection /></el-icon>
                {{ item.category }}
              </span>
              <span class="meta-item">
                <el-icon><View /></el-icon>
                {{ item.views }}
              </span>
              <span class="meta-item">
                <el-icon><Star /></el-icon>
                {{ item.stars }}
              </span>
            </div>
            <div class="question-tags">
              <el-tag
                v-for="tag in item.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalQuestions"
          layout="prev, pager, next"
          small
        />
      </div>

      <!-- 右侧：详细内容 -->
      <div class="content-right">
        <div v-if="selectedQuestion" class="question-detail glass-card">
          <!-- 题目信息 -->
          <div class="detail-header">
            <h3>{{ selectedQuestion.title }}</h3>
            <div class="detail-actions">
              <el-button
                :type="selectedQuestion.collected ? 'warning' : ''"
                :icon="Star"
                circle
                @click="toggleCollect"
              />
              <el-button
                :icon="Share"
                circle
                @click="shareQuestion"
              />
            </div>
          </div>

          <!-- 题目内容 -->
          <div class="detail-content">
            <div class="content-section">
              <h4>题目描述</h4>
              <p>{{ selectedQuestion.description }}</p>
            </div>

            <!-- 参考答案 -->
            <div class="content-section">
              <h4>参考答案</h4>
              <div class="answer-content">
                <p v-html="selectedQuestion.answer"></p>
              </div>
            </div>

            <!-- 答题要点 -->
            <div class="content-section">
              <h4>答题要点</h4>
              <ul class="key-points">
                <li v-for="(point, index) in selectedQuestion.keyPoints" :key="index">
                  {{ point }}
                </li>
              </ul>
            </div>

            <!-- 相关知识点 -->
            <div class="content-section">
              <h4>相关知识点</h4>
              <div class="related-topics">
                <el-tag
                  v-for="topic in selectedQuestion.relatedTopics"
                  :key="topic"
                  @click="searchByTopic(topic)"
                  style="cursor: pointer; margin-right: 10px; margin-bottom: 10px;"
                >
                  {{ topic }}
                </el-tag>
              </div>
            </div>

            <!-- 面试官视角 -->
            <div class="content-section interviewer-perspective">
              <h4>
                <el-icon><User /></el-icon>
                面试官视角
              </h4>
              <el-alert type="info" :closable="false">
                {{ selectedQuestion.interviewerPerspective }}
              </el-alert>
            </div>

            <!-- 练习按钮 -->
            <div class="practice-section">
              <el-button type="primary" size="large" @click="practiceQuestion">
                <el-icon><VideoCamera /></el-icon>
                模拟回答
              </el-button>
              <el-button size="large" @click="viewSimilar">
                查看相似题目
              </el-button>
            </div>
          </div>
        </div>

        <!-- 未选择题目 -->
        <div v-else class="no-selection glass-card">
          <el-empty description="请从左侧选择题目查看详情">
            <el-button type="primary" @click="randomQuestion">
              随机一题
            </el-button>
          </el-empty>
        </div>
      </div>
    </div>

    <!-- 学习统计 -->
    <div class="study-stats glass-card">
      <h3>学习统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon">
            <el-icon :size="30" color="#409eff"><Reading /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ studyStats.studied }}</p>
            <p class="stat-label">已学习</p>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <el-icon :size="30" color="#67c23a"><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ studyStats.mastered }}</p>
            <p class="stat-label">已掌握</p>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <el-icon :size="30" color="#e6a23c"><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ studyStats.hours }}h</p>
            <p class="stat-label">学习时长</p>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <el-icon :size="30" color="#f56c6c"><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ studyStats.accuracy }}%</p>
            <p class="stat-label">正确率</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Search,
  Collection,
  View,
  Star,
  Share,
  User,
  VideoCamera,
  Reading,
  CircleCheck,
  Clock,
  TrendCharts
} from '@element-plus/icons-vue'


const router = useRouter()

// 状态管理
const activeCategory = ref('frontend')
const searchQuery = ref('')
const selectedTags = ref([])
const selectedQuestion = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)

// 分类数据
const categories = ref([
  { id: 'frontend', name: '前端开发', icon: 'Monitor', count: 156 },
  { id: 'backend', name: '后端开发', icon: 'DataAnalysis', count: 142 },
  { id: 'algorithm', name: '算法数据结构', icon: 'Notebook', count: 98 },
  { id: 'general', name: '通用问题', icon: 'Briefcase', count: 87 }
])

// 热门标签
const hotTags = ref([
  'JavaScript', 'Vue.js', 'React', 'Node.js', 'CSS',
  '性能优化', '项目经验', '团队协作', '系统设计'
])

// 题目数据（模拟数据）
const questions = ref([
  {
    id: 1,
    title: 'Vue3 相比 Vue2 有哪些重要更新？',
    category: '前端框架',
    difficulty: '中等',
    views: 2341,
    stars: 189,
    tags: ['Vue.js', '前端框架', '技术更新'],
    description: '这是一道考察对Vue框架发展和新特性理解的题目。面试官希望了解候选人是否关注技术发展，以及对新技术的理解深度。',
    answer: `Vue3 相比 Vue2 的重要更新包括：<br>
1. <strong>性能提升</strong>：重写了虚拟DOM，更新性能提升1.3~2倍<br>
2. <strong>Composition API</strong>：提供了更灵活的代码组织方式<br>
3. <strong>TypeScript支持</strong>：源码使用TypeScript重写，提供更好的类型推导<br>
4. <strong>Tree-shaking</strong>：更小的打包体积<br>
5. <strong>Fragment</strong>：支持多个根节点<br>
6. <strong>Teleport</strong>：可以将组件渲染到DOM树的其他位置<br>
7. <strong>Suspense</strong>：异步组件的新方式`,
    keyPoints: [
      '重点说明性能优化的具体表现',
      '解释Composition API解决的问题',
      '结合实际项目经验举例说明',
      '对比Options API的优劣'
    ],
    relatedTopics: ['Proxy vs Object.defineProperty', 'Vue3 响应式原理', 'setup函数'],
    interviewerPerspective: '考察候选人对前端框架发展的关注度，以及是否有实际使用经验。优秀的候选人会结合具体场景说明各特性的应用。',
    collected: false
  },
  {
    id: 2,
    title: '如何实现前端性能优化？',
    category: '性能优化',
    difficulty: '困难',
    views: 3456,
    stars: 267,
    tags: ['性能优化', '工程化', '最佳实践'],
    description: '这是一道综合性很强的题目，考察候选人对前端性能优化的全面理解和实践经验。',
    answer: `前端性能优化可以从以下几个方面进行：<br>
1. <strong>加载性能优化</strong><br>
   - 代码分割和懒加载<br>
   - 资源压缩（gzip、图片压缩）<br>
   - CDN加速<br>
   - HTTP缓存策略<br>
2. <strong>渲染性能优化</strong><br>
   - 减少重排重绘<br>
   - 使用CSS3动画代替JS动画<br>
   - 虚拟滚动<br>
3. <strong>代码层面优化</strong><br>
   - 防抖节流<br>
   - Web Worker处理复杂计算<br>
   - 避免内存泄漏`,
    keyPoints: [
      '从加载、渲染、代码三个维度展开',
      '每个优化点都给出具体实施方案',
      '结合性能监控工具说明优化效果',
      '提及最新的优化技术如Web Vitals'
    ],
    relatedTopics: ['Lighthouse', 'Web Vitals', 'Performance API'],
    interviewerPerspective: '希望候选人不仅知道优化方法，更要理解背后的原理。能够根据实际场景选择合适的优化策略，并量化优化效果。',
    collected: true
  }
])

// 计算属性
const totalQuestions = computed(() => questions.value.length)

const filteredQuestions = computed(() => {
  let result = questions.value

  // 按分类筛选
  result = result.filter(() => {
    // TODO: 根据activeCategory筛选
    return true
  })

  // 按搜索词筛选
  if (searchQuery.value) {
    result = result.filter(q =>
      q.title.includes(searchQuery.value) ||
      q.tags.some(tag => tag.includes(searchQuery.value))
    )
  }

  // 按标签筛选
  if (selectedTags.value.length > 0) {
    result = result.filter(q =>
      selectedTags.value.some(tag => q.tags.includes(tag))
    )
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 学习统计
const studyStats = ref({
  studied: 45,
  mastered: 32,
  hours: 28.5,
  accuracy: 85
})

// 获取难度类型
const getDifficultyType = (difficulty) => {
  const map = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return map[difficulty] || 'info'
}

// 切换标签
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  // TODO: 调用API搜索
  ElMessage.success('搜索完成')
}

// 选择题目
const selectQuestion = async (question) => {
  selectedQuestion.value = question

  // TODO: 记录浏览历史
  // await apiService.question.recordView(question.id)
}

// 收藏/取消收藏
const toggleCollect = () => {
  if (selectedQuestion.value) {
    selectedQuestion.value.collected = !selectedQuestion.value.collected
    ElMessage.success(selectedQuestion.value.collected ? '收藏成功' : '已取消收藏')
  }
}

// 分享题目
const shareQuestion = () => {
  if (selectedQuestion.value) {
    // TODO: 实现分享功能
    ElMessage.info('分享功能开发中...')
  }
}

// 按主题搜索
const searchByTopic = (topic) => {
  searchQuery.value = topic
  handleSearch()
}

// 练习题目
const practiceQuestion = () => {
  if (selectedQuestion.value) {
    router.push({
      path: '/dashboard/interview-practice',
      query: { questionId: selectedQuestion.value.id }
    })
  }
}

// 查看相似题目
const viewSimilar = () => {
  if (selectedQuestion.value) {
    // TODO: 实现相似题目推荐
    ElMessage.info('相似题目推荐功能开发中...')
  }
}

// 随机题目
const randomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.value.length)
  selectQuestion(questions.value[randomIndex])
}

// 加载题目数据
const loadQuestions = async () => {
  try {
    // TODO: 调用后端API获取题目列表
    // const data = await apiService.question.getList({
    //   category: activeCategory.value,
    //   page: currentPage.value,
    //   pageSize: pageSize.value
    // })
    // questions.value = data.list
    // totalQuestions.value = data.total
  } catch {
    ElMessage.error('加载题目失败')
  }
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.knowledge-base-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 导航标签 */
.kb-navigation {
  padding: 20px;
  margin-bottom: 30px;
}

.nav-tabs {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-tab.active {
  background: var(--gradient-tech);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
}

/* 搜索区域 */
.search-section {
  margin-bottom: 30px;
}

.filter-tags {
  margin-top: 15px;
}

/* 知识内容区 */
.knowledge-content {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.content-left {
  flex: 1;
  max-width: 500px;
}

.content-right {
  flex: 2;
}

/* 题目列表 */
.question-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.question-item {
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-item:hover {
  transform: translateX(5px);
}

.question-item.active {
  border-left: 3px solid var(--primary-color);
  background: rgba(64, 158, 255, 0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.question-header h4 {
  flex: 1;
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.question-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.question-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 题目详情 */
.question-detail {
  padding: 30px;
  min-height: 600px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-header h3 {
  flex: 1;
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.detail-actions {
  display: flex;
  gap: 10px;
}

.content-section {
  margin-bottom: 30px;
}

.content-section h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.answer-content {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  line-height: 1.8;
}

.answer-content :deep(strong) {
  color: var(--primary-color);
}

.key-points {
  margin: 0;
  padding-left: 20px;
}

.key-points li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 8px;
}

.related-topics {
  display: flex;
  flex-wrap: wrap;
}

.interviewer-perspective {
  margin-top: 40px;
}

.practice-section {
  margin-top: 40px;
  text-align: center;
}

/* 无选择状态 */
.no-selection {
  padding: 100px 50px;
  text-align: center;
}

/* 学习统计 */
.study-stats {
  padding: 30px;
}

.study-stats h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0;
}

.stat-label {
  color: var(--text-secondary);
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .knowledge-content {
    flex-direction: column;
  }

  .content-left {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .nav-tabs {
    justify-content: center;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
