<template>
  <div class="knowledge-base-container">
    <div class="page-header">
      <h2 class="page-title">全方位面试知识库</h2>
      <p class="page-subtitle">涵盖各行业各岗位的系统化面试题库和知识点，助您全面准备</p>
    </div>

    <!-- 知识库导航 -->
    <div class="kb-navigation glass-card">
      <div class="nav-tabs">
        <div
          v-for="category in categories"
          :key="category.id"
          class="nav-tab"
          :class="{ active: activeCategory === category.id }"
          @click="switchCategory(category.id)"
        >
          <el-icon :size="20">
            <component :is="category.icon" />
          </el-icon>
          <span>{{ category.name }}</span>
          <el-badge :value="category.count" type="info" />
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="quick-access glass-card">
      <h3>快速入口</h3>
      <div class="access-grid">
        <div class="access-item" @click="navigateToPosition('it')">
          <el-icon :size="30" color="#409eff"><Monitor /></el-icon>
          <h4>IT互联网</h4>
          <p>前端/后端/算法</p>
        </div>
        <div class="access-item" @click="navigateToPosition('finance')">
          <el-icon :size="30" color="#67c23a"><Money /></el-icon>
          <h4>金融财经</h4>
          <p>投资/分析/风控</p>
        </div>
        <div class="access-item" @click="navigateToPosition('education')">
          <el-icon :size="30" color="#e6a23c"><Reading /></el-icon>
          <h4>教育培训</h4>
          <p>教师/教研/运营</p>
        </div>
        <div class="access-item" @click="openComingSoon">
          <el-icon :size="30" color="#f56c6c"><Briefcase /></el-icon>
          <h4>更多行业</h4>
          <p>持续更新中</p>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索题目、知识点、技术栈..."
          size="large"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="filter-section">
        <div class="filter-item">
          <span class="filter-label">难度：</span>
          <el-select
            v-model="selectedDifficulty"
            placeholder="选择难度"
            clearable
            @change="handleSearch"
          >
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">岗位：</span>
          <el-select v-model="selectedPosition" placeholder="选择岗位" clearable @change="handleSearch">
            <el-option v-for="pos in positions" :key="pos.value" :label="pos.label" :value="pos.value" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">标签：</span>
          <el-select v-model="selectedTag" placeholder="选择标签" clearable @change="handleSearch">
            <el-option v-for="tag in allTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">收藏：</span>
          <el-switch v-model="showOnlyFavorites" @change="handleSearch" />
        </div>

        <el-button @click="resetFilters">重置筛选</el-button>
        <el-button type="primary" @click="openAdvancedSearch">高级搜索</el-button>
      </div>

      <div class="hot-tags">
        <span class="tags-label">热门标签：</span>
        <el-tag
          v-for="tag in hotTags"
          :key="tag"
          :type="selectedTags.includes(tag) ? 'primary' : 'info'"
          effect="plain"
          round
          @click="toggleTag(tag)"
          style="cursor: pointer; margin-right: 10px"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <!-- 知识点列表 -->
    <div class="knowledge-content">
      <!-- 左侧：题目列表 -->
      <div class="content-left">
        <div class="list-header">
          <div class="result-info">
            <span>共找到 {{ totalQuestions }} 道题目</span>
            <el-select v-model="sortBy" size="small" @change="handleSort">
              <el-option label="默认排序" value="default" />
              <el-option label="难度排序" value="difficulty" />
              <el-option label="热度排序" value="popularity" />
              <el-option label="最新排序" value="newest" />
              <el-option label="收藏排序" value="favorites" />
            </el-select>
          </div>
          <div class="view-controls">
            <el-button-group>
              <el-button :type="viewMode === 'list' ? 'primary' : ''" @click="viewMode = 'list'">
                <el-icon><List /></el-icon>
              </el-button>
              <el-button :type="viewMode === 'grid' ? 'primary' : ''" @click="viewMode = 'grid'">
                <el-icon><Grid /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>

        <div class="question-list" :class="viewMode" v-loading="loading">
          <div
            v-for="item in filteredQuestions"
            :key="item.id"
            class="question-item glass-card"
            :class="{ active: selectedQuestion?.id === item.id }"
            @click="selectQuestion(item)"
          >
            <div class="question-header">
              <h4>{{ item.title }}</h4>
              <div class="question-actions">
                <el-button
                  :icon="item.collected ? 'StarFilled' : 'Star'"
                  :type="item.collected ? 'warning' : ''"
                  text
                  circle
                  size="small"
                  @click.stop="toggleCollect(item)"
                />
                <el-tag :type="getDifficultyType(item.difficulty)" size="small">
                  {{ item.difficulty }}
                </el-tag>
              </div>
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
              <span class="meta-item">
                <el-icon><Timer /></el-icon>
                {{ item.estimatedTime }}分钟
              </span>
            </div>
            <div class="question-tags">
              <el-tag v-for="tag in item.tags.slice(0, 3)" :key="tag" size="small" type="info">
                {{ tag }}
              </el-tag>
              <span v-if="item.tags.length > 3" class="more-tags">+{{ item.tags.length - 3 }}</span>
            </div>
            <div class="question-progress" v-if="item.progress">
              <el-progress :percentage="item.progress" :show-text="false" :stroke-width="4" />
              <span class="progress-text">学习进度: {{ item.progress }}%</span>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <el-pagination
          v-if="totalQuestions > pageSize"
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalQuestions"
          layout="prev, pager, next, jumper"
          small
          @current-change="handlePageChange"
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
                :icon="selectedQuestion.collected ? 'StarFilled' : 'Star'"
                circle
                @click="toggleCollect(selectedQuestion)"
              />
              <el-button :icon="'Share'" circle @click="shareQuestion" />
              <el-dropdown @command="handleCommand">
                <el-button :icon="'MoreFilled'" circle />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="report">举报问题</el-dropdown-item>
                    <el-dropdown-item command="suggest">建议修改</el-dropdown-item>
                    <el-dropdown-item command="export">导出题目</el-dropdown-item>
                    <el-dropdown-item command="print">打印题目</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <!-- 题目内容 -->
          <div class="detail-content">
            <div class="content-section">
              <h4>题目描述</h4>
              <div class="question-description">
                <p>{{ selectedQuestion.description }}</p>
                <div class="question-info">
                  <el-tag :type="getDifficultyType(selectedQuestion.difficulty)">
                    {{ selectedQuestion.difficulty }}
                  </el-tag>
                  <span class="question-stats">
                    <el-icon><View /></el-icon>
                    {{ selectedQuestion.views }} 次浏览
                  </span>
                  <span class="question-stats">
                    <el-icon><Star /></el-icon>
                    {{ selectedQuestion.stars }} 人收藏
                  </span>
                  <span class="question-stats">
                    <el-icon><Timer /></el-icon>
                    预计 {{ selectedQuestion.estimatedTime }} 分钟
                  </span>
                </div>
              </div>
            </div>

            <!-- 参考答案 -->
            <div class="content-section">
              <div class="section-header">
                <h4>参考答案</h4>
                <div class="answer-controls">
                  <el-button size="small" @click="toggleAnswerVisibility">
                    {{ showAnswer ? '隐藏答案' : '显示答案' }}
                  </el-button>
                  <el-button size="small" type="primary" @click="practiceAnswer">
                    练习回答
                  </el-button>
                </div>
              </div>
              <div v-if="showAnswer" class="answer-content">
                <div v-html="selectedQuestion.answer"></div>
                <div class="answer-rating">
                  <span>答案质量评分：</span>
                  <el-rate v-model="selectedQuestion.answerRating" disabled show-score />
                </div>
              </div>
              <div v-else class="answer-placeholder">
                <p>点击"显示答案"查看参考回答，或直接开始练习</p>
              </div>
            </div>

            <!-- 答题要点 -->
            <div class="content-section">
              <h4>
                <el-icon><Key /></el-icon>
                答题要点
              </h4>
              <ul class="key-points">
                <li v-for="(point, index) in selectedQuestion.keyPoints" :key="index">
                  <el-icon><CircleCheck /></el-icon>
                  {{ point }}
                </li>
              </ul>
            </div>

            <!-- 扩展知识 -->
            <div class="content-section">
              <h4>
                <el-icon><Reading /></el-icon>
                扩展知识
              </h4>
              <div class="extended-knowledge">
                <div v-for="knowledge in selectedQuestion.extendedKnowledge" :key="knowledge.title" class="knowledge-item">
                  <h5>{{ knowledge.title }}</h5>
                  <p>{{ knowledge.description }}</p>
                  <el-link :href="knowledge.link" target="_blank">详细了解 →</el-link>
                </div>
              </div>
            </div>

            <!-- 相关知识点 -->
            <div class="content-section">
              <h4>相关知识点</h4>
              <div class="related-topics">
                <el-tag
                  v-for="topic in selectedQuestion.relatedTopics"
                  :key="topic"
                  @click="searchByTopic(topic)"
                  style="cursor: pointer; margin-right: 10px; margin-bottom: 10px"
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

            <!-- 相似题目 -->
            <div class="content-section" v-if="similarQuestions.length > 0">
              <h4>相似题目</h4>
              <div class="similar-questions">
                <div
                  v-for="similar in similarQuestions"
                  :key="similar.id"
                  class="similar-item"
                  @click="selectQuestion(similar)"
                >
                  <h5>{{ similar.title }}</h5>
                  <div class="similar-meta">
                    <el-tag :type="getDifficultyType(similar.difficulty)" size="small">
                      {{ similar.difficulty }}
                    </el-tag>
                    <span>{{ similar.category }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 练习按钮 -->
            <div class="practice-section">
              <el-button type="primary" size="large" @click="practiceQuestion">
                <el-icon><VideoCamera /></el-icon>
                模拟回答
              </el-button>
              <el-button size="large" @click="addToMyQuestions">
                <el-icon><FolderAdd /></el-icon>
                加入我的题库
              </el-button>
              <el-button size="large" @click="generateSimilar">
                <el-icon><Magic /></el-icon>
                生成相似题目
              </el-button>
              <el-button size="large" @click="createLearningPath">
                <el-icon><Guide /></el-icon>
                创建学习路径
              </el-button>
            </div>
          </div>
        </div>

        <!-- 未选择题目 -->
        <div v-else class="no-selection glass-card">
          <el-empty description="请从左侧选择题目查看详情">
            <el-button type="primary" @click="randomQuestion"> 随机一题 </el-button>
            <el-button @click="openAIRecommend"> AI智能推荐 </el-button>
          </el-empty>
        </div>
      </div>
    </div>

    <!-- 学习统计 -->
    <div class="study-stats glass-card">
      <h3>学习统计概览</h3>
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
        <div class="stat-item">
          <div class="stat-icon">
            <el-icon :size="30" color="#909399"><Trophy /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ studyStats.rank }}</p>
            <p class="stat-label">全站排名</p>
          </div>
        </div>
      </div>
      <div class="stats-actions">
        <el-button @click="viewDetailedStats">查看详细统计</el-button>
        <el-button type="primary" @click="exportProgress">导出学习报告</el-button>
      </div>
    </div>

    <!-- 高级搜索对话框 -->
    <el-dialog v-model="showAdvancedSearch" title="高级搜索" width="600px">
      <el-form :model="advancedSearchForm" label-width="100px">
        <el-form-item label="关键词">
          <el-input v-model="advancedSearchForm.keywords" placeholder="输入关键词，用空格分隔" />
        </el-form-item>
        <el-form-item label="题目类型">
          <el-checkbox-group v-model="advancedSearchForm.types">
            <el-checkbox label="behavioral">行为面试</el-checkbox>
            <el-checkbox label="technical">技术面试</el-checkbox>
            <el-checkbox label="situational">情景面试</el-checkbox>
            <el-checkbox label="project">项目经验</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="难度范围">
          <el-slider v-model="advancedSearchForm.difficultyRange" range :marks="difficultyMarks" />
        </el-form-item>
        <el-form-item label="预计时长">
          <el-slider v-model="advancedSearchForm.timeRange" range :min="1" :max="60" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdvancedSearch = false">取消</el-button>
        <el-button type="primary" @click="performAdvancedSearch">搜索</el-button>
      </template>
    </el-dialog>

    <!-- 我的题库对话框 -->
    <el-dialog v-model="showMyQuestions" title="我的题库" width="80%">
      <div class="my-questions-content">
        <el-tabs v-model="myQuestionsTab">
          <el-tab-pane label="收藏题目" name="favorites">
            <div class="question-grid">
              <div
                v-for="question in myFavoriteQuestions"
                :key="question.id"
                class="question-card"
                @click="selectQuestion(question)"
              >
                <h5>{{ question.title }}</h5>
                <p>{{ question.category }} · {{ question.difficulty }}</p>
                <div class="card-actions">
                  <el-button size="small" @click.stop="practiceQuestion(question)">练习</el-button>
                  <el-button size="small" type="danger" @click.stop="removeFromFavorites(question)">移除</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="错题本" name="mistakes">
            <div class="question-grid">
              <div
                v-for="question in myMistakeQuestions"
                :key="question.id"
                class="question-card mistake"
                @click="selectQuestion(question)"
              >
                <h5>{{ question.title }}</h5>
                <p>{{ question.category }} · 错误次数: {{ question.mistakeCount }}</p>
                <div class="card-actions">
                  <el-button size="small" type="primary" @click.stop="retryQuestion(question)">重新练习</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="学习笔记" name="notes">
            <div class="notes-list">
              <div v-for="note in myNotes" :key="note.id" class="note-item">
                <h5>{{ note.questionTitle }}</h5>
                <p>{{ note.content }}</p>
                <div class="note-meta">
                  <span class="note-date">{{ formatDate(note.createTime) }}</span>
                  <el-button size="small" @click="editNote(note)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteNote(note)">删除</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="学习计划" name="plans">
            <div class="plans-list">
              <div v-for="plan in myLearningPlans" :key="plan.id" class="plan-item">
                <h5>{{ plan.title }}</h5>
                <p>{{ plan.description }}</p>
                <el-progress :percentage="plan.progress" />
                <div class="plan-actions">
                  <el-button size="small" type="primary" @click="continuePlan(plan)">继续学习</el-button>
                  <el-button size="small" @click="editPlan(plan)">编辑</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
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
  User,
  VideoCamera,
  Reading,
  CircleCheck,
  Clock,
  TrendCharts,
  FolderAdd,
  Monitor,
  Money,
  Briefcase,
  List,
  Grid,
  Key,
  Timer,
  Guide,
  Trophy
} from '@element-plus/icons-vue'

const router = useRouter()

// 状态管理
const activeCategory = ref('all')
const searchQuery = ref('')
const selectedTags = ref([])
const selectedQuestion = ref(null)
const currentPage = ref(1)
const pageSize = ref(12)
const loading = ref(false)
const showAnswer = ref(false)
const selectedDifficulty = ref('')
const selectedPosition = ref('')
const selectedTag = ref('')
const showOnlyFavorites = ref(false)
const sortBy = ref('default')
const viewMode = ref('list')
const showMyQuestions = ref(false)
const myQuestionsTab = ref('favorites')
const showAdvancedSearch = ref(false)

// 高级搜索表单
const advancedSearchForm = ref({
  keywords: '',
  types: [],
  difficultyRange: [1, 5],
  timeRange: [5, 30]
})

const difficultyMarks = {
  1: '简单',
  3: '中等',
  5: '困难'
}

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: 'Grid', count: 1850 },
  { id: 'frontend', name: '前端开发', icon: 'Monitor', count: 456 },
  { id: 'backend', name: '后端开发', icon: 'DataAnalysis', count: 342 },
  { id: 'algorithm', name: '算法数据结构', icon: 'Notebook', count: 298 },
  { id: 'general', name: '通用问题', icon: 'Briefcase', count: 187 },
  { id: 'system', name: '系统设计', icon: 'Platform', count: 165 },
  { id: 'behavioral', name: '行为面试', icon: 'ChatDotSquare', count: 173 },
  { id: 'finance', name: '金融财经', icon: 'Money', count: 129 },
  { id: 'education', name: '教育培训', icon: 'Reading', count: 100 }
])

// 岗位选项
const positions = ref([
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '算法工程师', value: 'algorithm' },
  { label: '产品经理', value: 'product' },
  { label: '投资分析师', value: 'investment' },
  { label: '教师', value: 'teacher' },
  { label: 'UI设计师', value: 'design' }
])

// 热门标签
const hotTags = ref([
  'JavaScript',
  'Vue.js',
  'React',
  'Node.js',
  'CSS',
  '性能优化',
  '项目经验',
  '团队协作',
  '系统设计',
  'TypeScript',
  '数据结构',
  '算法',
  '网络协议',
  '数据库',
  '微服务'
])

// 所有标签
const allTags = computed(() => {
  const tags = new Set()
  questions.value.forEach((q) => {
    q.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags)
})

// 题目数据（扩展的模拟数据）
const questions = ref([
  {
    id: 1,
    title: 'Vue3 相比 Vue2 有哪些重要更新？',
    category: '前端框架',
    difficulty: '中等',
    views: 2341,
    stars: 189,
    estimatedTime: 8,
    progress: 75,
    tags: ['Vue.js', '前端框架', '技术更新'],
    description: '这是一道考察对Vue框架发展和新特性理解的题目。面试官希望了解候选人是否关注技术发展，以及对新技术的理解深度。',
    answer: `Vue3 相比 Vue2 的重要更新包括：<br><br>
    <strong>1. 性能提升</strong><br>
    • 重写了虚拟DOM，更新性能提升1.3~2倍<br>
    • Tree-shaking支持，打包体积更小<br>
    • 编译时优化，静态提升等技术<br><br>

    <strong>2. Composition API</strong><br>
    • 提供了更灵活的代码组织方式<br>
    • 更好的TypeScript支持<br>
    • 解决了Options API的局限性<br><br>

    <strong>3. 新特性</strong><br>
    • Fragment：支持多个根节点<br>
    • Teleport：可以将组件渲染到DOM树的其他位置<br>
    • Suspense：异步组件的新方式<br>
    • 更好的响应式系统（基于Proxy）`,
    answerRating: 4.5,
    keyPoints: [
      '重点说明性能优化的具体表现',
      '解释Composition API解决的问题',
      '结合实际项目经验举例说明',
      '对比Options API的优劣势'
    ],
    extendedKnowledge: [
      {
        title: 'Vue3响应式原理深入',
        description: '详解Proxy相比Object.defineProperty的优势',
        link: 'https://vuejs.org/guide/extras/reactivity-in-depth.html'
      },
      {
        title: 'Composition API最佳实践',
        description: '如何在项目中合理使用Composition API',
        link: 'https://vuejs.org/guide/extras/composition-api-faq.html'
      }
    ],
    relatedTopics: [
      'Proxy vs Object.defineProperty',
      'Vue3 响应式原理',
      'setup函数',
      'Composition API',
      'Vue3 性能优化'
    ],
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
    estimatedTime: 15,
    progress: 30,
    tags: ['性能优化', '工程化', '最佳实践'],
    description: '这是一道综合性很强的题目，考察候选人对前端性能优化的全面理解和实践经验。',
    answer: `前端性能优化可以从以下几个方面进行：<br><br>
    <strong>1. 加载性能优化</strong><br>
    • 代码分割和懒加载<br>
    • 资源压缩（gzip、图片压缩）<br>
    • CDN加速<br>
    • HTTP缓存策略<br>
    • 预加载和预连接<br><br>

    <strong>2. 渲染性能优化</strong><br>
    • 减少重排重绘<br>
    • 使用CSS3动画代替JS动画<br>
    • 虚拟滚动<br>
    • 防抖节流<br><br>

    <strong>3. 代码层面优化</strong><br>
    • Web Worker处理复杂计算<br>
    • 避免内存泄漏<br>
    • 合理使用缓存策略`,
    answerRating: 4.8,
    keyPoints: [
      '从加载、渲染、代码三个维度展开',
      '每个优化点都给出具体实施方案',
      '结合性能监控工具说明优化效果',
      '提及最新的优化技术如Web Vitals'
    ],
    extendedKnowledge: [
      {
        title: 'Core Web Vitals详解',
        description: '了解Google最新的性能指标',
        link: 'https://web.dev/vitals/'
      },
      {
        title: '前端监控实践',
        description: '如何搭建完整的性能监控体系',
        link: 'https://web.dev/monitoring/'
      }
    ],
    relatedTopics: ['Lighthouse', 'Web Vitals', 'Performance API', 'Core Web Vitals', '图片优化', '缓存策略'],
    interviewerPerspective: '希望候选人不仅知道优化方法，更要理解背后的原理。能够根据实际场景选择合适的优化策略，并量化优化效果。',
    collected: true
  },
  // 可以继续添加更多题目...
])

// 计算属性
const totalQuestions = computed(() => filteredQuestions.value.length)

const filteredQuestions = computed(() => {
  let result = questions.value

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter((q) => {
      return q.category.includes(getCategoryName(activeCategory.value))
    })
  }

  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (q) =>
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // 按难度筛选
  if (selectedDifficulty.value) {
    result = result.filter((q) => q.difficulty === getDifficultyName(selectedDifficulty.value))
  }

  // 按岗位筛选
  if (selectedPosition.value) {
    result = result.filter((q) => q.tags.some(tag => tag.includes(selectedPosition.value)))
  }

  // 按标签筛选
  if (selectedTag.value) {
    result = result.filter((q) => q.tags.includes(selectedTag.value))
  }

  // 按标签筛选（多选）
  if (selectedTags.value.length > 0) {
    result = result.filter((q) => selectedTags.value.some((tag) => q.tags.includes(tag)))
  }

  // 收藏筛选
  if (showOnlyFavorites.value) {
    result = result.filter((q) => q.collected)
  }

  // 排序
  switch (sortBy.value) {
    case 'difficulty':
      result.sort((a, b) => {
        const difficultyOrder = { 简单: 1, 中等: 2, 困难: 3 }
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      })
      break
    case 'popularity':
      result.sort((a, b) => b.views - a.views)
      break
    case 'newest':
      result.sort((a, b) => b.id - a.id)
      break
    case 'favorites':
      result.sort((a, b) => b.stars - a.stars)
      break
    default:
      // 默认排序保持原顺序
      break
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 相似题目
const similarQuestions = computed(() => {
  if (!selectedQuestion.value) return []

  return questions.value
    .filter(
      (q) =>
        q.id !== selectedQuestion.value.id &&
        (q.category === selectedQuestion.value.category ||
          q.tags.some((tag) => selectedQuestion.value.tags.includes(tag)))
    )
    .slice(0, 4)
})

// 学习统计
const studyStats = ref({
  studied: 145,
  mastered: 89,
  hours: 68.5,
  accuracy: 87,
  rank: 1258
})

// 我的题库数据
const myFavoriteQuestions = computed(() => questions.value.filter((q) => q.collected))
const myMistakeQuestions = ref([
  { id: 101, title: 'Promise和async/await的区别', category: 'JavaScript', mistakeCount: 3 },
  { id: 102, title: 'React Hooks使用规则', category: 'React', mistakeCount: 2 }
])
const myNotes = ref([
  {
    id: 1,
    questionTitle: 'Vue3 响应式原理',
    content: '基于Proxy实现，比Object.defineProperty更强大，可以监听数组变化...',
    createTime: new Date('2024-01-15')
  }
])
const myLearningPlans = ref([
  {
    id: 1,
    title: '前端面试冲刺计划',
    description: '30天系统准备前端面试',
    progress: 65
  }
])

// 工具方法
const getCategoryName = (id) => {
  const categoryMap = {
    frontend: '前端',
    backend: '后端',
    algorithm: '算法',
    general: '通用',
    system: '系统',
    behavioral: '行为',
    finance: '金融',
    education: '教育'
  }
  return categoryMap[id] || ''
}

const getDifficultyName = (value) => {
  const difficultyMap = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return difficultyMap[value] || value
}

const getDifficultyType = (difficulty) => {
  const map = {
    简单: 'success',
    中等: 'warning',
    困难: 'danger'
  }
  return map[difficulty] || 'info'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 事件处理方法
const switchCategory = async (categoryId) => {
  activeCategory.value = categoryId
  currentPage.value = 1
  await loadQuestions()
}

const handleSearch = async () => {
  currentPage.value = 1
  await loadQuestions()
}

const handleSort = async () => {
  await loadQuestions()
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await loadQuestions()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDifficulty.value = ''
  selectedPosition.value = ''
  selectedTag.value = ''
  selectedTags.value = []
  showOnlyFavorites.value = false
  sortBy.value = 'default'
  handleSearch()
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  handleSearch()
}

const selectQuestion = async (question) => {
  selectedQuestion.value = question
  showAnswer.value = false

  // 记录浏览并增加浏览次数
  question.views++

  // TODO: 调用后端API记录学习历史
  // await apiService.question.recordView(question.id)
}

const toggleCollect = async (question) => {
  question.collected = !question.collected

  // TODO: 调用后端API
  // await apiService.question.toggleCollect(question.id, question.collected)

  ElMessage.success(question.collected ? '已收藏' : '已取消收藏')
}

const shareQuestion = () => {
  if (selectedQuestion.value) {
    const url = `${window.location.origin}/question/${selectedQuestion.value.id}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        ElMessage.success('题目链接已复制到剪贴板')
      })
      .catch(() => {
        ElMessage.error('复制失败')
      })
  }
}

const handleCommand = (command) => {
  switch (command) {
    case 'report':
      ElMessage.info('举报功能开发中...')
      break
    case 'suggest':
      ElMessage.info('建议修改功能开发中...')
      break
    case 'export':
      exportQuestion()
      break
    case 'print':
      printQuestion()
      break
  }
}

const exportQuestion = () => {
  if (selectedQuestion.value) {
    const content = `题目：${selectedQuestion.value.title}\n\n${selectedQuestion.value.description}\n\n参考答案：\n${selectedQuestion.value.answer.replace(/<[^>]*>/g, '')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedQuestion.value.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success('题目已导出')
  }
}

const printQuestion = () => {
  if (selectedQuestion.value) {
    window.print()
  }
}

const toggleAnswerVisibility = () => {
  showAnswer.value = !showAnswer.value
}

const practiceAnswer = () => {
  if (selectedQuestion.value) {
    router.push({
      path: '/dashboard/interview-practice',
      query: { questionId: selectedQuestion.value.id, mode: 'practice' }
    })
  }
}

const searchByTopic = (topic) => {
  searchQuery.value = topic
  handleSearch()
}

const practiceQuestion = (question = null) => {
  const targetQuestion = question || selectedQuestion.value
  if (targetQuestion) {
    router.push({
      path: '/dashboard/interview-practice',
      query: { questionId: targetQuestion.id }
    })
  }
}

const addToMyQuestions = () => {
  showMyQuestions.value = true
  ElMessage.success('已添加到我的题库')
}

const generateSimilar = async () => {
  ElMessage.info('AI正在生成相似题目...')
  // TODO: 调用AI生成相似题目
  setTimeout(() => {
    ElMessage.success('已生成3道相似题目')
  }, 2000)
}

const createLearningPath = () => {
  if (selectedQuestion.value) {
    router.push({
      path: '/dashboard/personalized-learning',
      query: {
        action: 'create-path',
        questionId: selectedQuestion.value.id
      }
    })
  }
}

const randomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.value.length)
  selectQuestion(questions.value[randomIndex])
}

const openAIRecommend = () => {
  ElMessage.info('AI正在分析您的学习情况，推荐合适题目...')
  // TODO: AI推荐逻辑
}

// 导航方法
const navigateToPosition = (type) => {
  router.push(`/dashboard/position-info/${type}`)
}

const openComingSoon = () => {
  ElMessage.info('更多行业即将上线，敬请期待！')
}

// 高级搜索
const openAdvancedSearch = () => {
  showAdvancedSearch.value = true
}

const performAdvancedSearch = () => {
  // TODO: 实现高级搜索逻辑
  showAdvancedSearch.value = false
  ElMessage.success('高级搜索完成')
}

// 统计相关
const viewDetailedStats = () => {
  router.push('/dashboard/interview-performance')
}

const exportProgress = () => {
  ElMessage.info('正在生成学习报告...')
  // TODO: 实现导出功能
}

// 我的题库操作
const removeFromFavorites = (question) => {
  question.collected = false
  ElMessage.success('已从收藏夹移除')
}

const retryQuestion = (question) => {
  practiceQuestion(question)
}

const editNote = (note) => {
  ElMessage.info('编辑笔记功能开发中...')
}

const deleteNote = (note) => {
  const index = myNotes.value.findIndex(n => n.id === note.id)
  myNotes.value.splice(index, 1)
  ElMessage.success('笔记已删除')
}

const continuePlan = (plan) => {
  router.push('/dashboard/personalized-learning')
}

const editPlan = (plan) => {
  ElMessage.info('编辑计划功能开发中...')
}

// 加载题目数据
const loadQuestions = async () => {
  try {
    loading.value = true
    // TODO: 调用后端API获取题目列表
    await new Promise((resolve) => setTimeout(resolve, 300))
  } catch (error) {
    ElMessage.error('加载题目失败')
    console.error('Load questions error:', error)
  } finally {
    loading.value = false
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

/* 导航标签 */
.kb-navigation {
  padding: 20px;
  margin-bottom: 30px;
}

.nav-tabs {
  display: flex;
  gap: 15px;
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

/* 快速入口 */
.quick-access {
  padding: 30px;
  margin-bottom: 30px;
}

.quick-access h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.access-item {
  text-align: center;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.access-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.access-item h4 {
  margin: 15px 0 5px;
  color: var(--text-primary);
}

.access-item p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-bar {
  max-width: 600px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  color: var(--text-secondary);
  font-size: 14px;
  white-space: nowrap;
}

.hot-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tags-label {
  color: var(--text-secondary);
  font-size: 14px;
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

.list-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-info {
  color: var(--text-secondary);
  font-size: 14px;
}

.view-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 题目列表 */
.question-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.question-list.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
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

.question-actions {
  display: flex;
  align-items: center;
  gap: 8px;
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
  align-items: center;
  margin-bottom: 10px;
}

.more-tags {
  color: var(--text-secondary);
  font-size: 12px;
}

.question-progress {
  margin-top: 10px;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 5px;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.answer-controls {
  display: flex;
  gap: 10px;
}

.question-description {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  line-height: 1.8;
}

.question-info {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-top: 15px;
}

.question-stats {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 13px;
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

.answer-rating {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.answer-placeholder {
  background: rgba(255, 255, 255, 0.03);
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  color: var(--text-secondary);
}

.key-points {
  margin: 0;
  padding: 0;
  list-style: none;
}

.key-points li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.extended-knowledge {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.knowledge-item {
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.knowledge-item h5 {
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.knowledge-item p {
  color: var(--text-secondary);
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.related-topics {
  display: flex;
  flex-wrap: wrap;
}

.interviewer-perspective {
  margin-top: 40px;
}

.similar-questions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.similar-item {
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.similar-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.similar-item h5 {
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-size: 0.9rem;
}

.similar-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.practice-section {
  margin-top: 40px;
  text-align: center;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
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
  margin-bottom: 25px;
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

.stats-actions {
  text-align: center;
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* 我的题库 */
.my-questions-content {
  max-height: 60vh;
  overflow-y: auto;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.question-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.question-card.mistake {
  border-left: 3px solid var(--danger-color);
}

.question-card h5 {
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.question-card p {
  color: var(--text-secondary);
  margin: 0 0 15px 0;
  font-size: 13px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.note-item {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.note-item h5 {
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.note-item p {
  color: var(--text-secondary);
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-date {
  color: var(--text-muted);
  font-size: 12px;
}

.plans-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plan-item {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.plan-item h5 {
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.plan-item p {
  color: var(--text-secondary);
  margin: 0 0 15px 0;
}

.plan-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .knowledge-content {
    flex-direction: column;
  }

  .content-left {
    max-width: 100%;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .access-grid {
    grid-template-columns: repeat(2, 1fr);
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

  .practice-section {
    flex-direction: column;
  }

  .practice-section .el-button {
    width: 100%;
  }

  .access-grid {
    grid-template-columns: 1fr;
  }

  .stats-actions {
    flex-direction: column;
  }
}
</style>
