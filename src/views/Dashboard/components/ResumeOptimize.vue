<template>
  <div class="resume-optimize-container">
    <div class="page-header">
      <h2 class="page-title">简历优化</h2>
      <p class="page-subtitle">AI智能分析，让您的简历更具竞争力</p>
    </div>

    <!-- 选择简历 -->
    <div class="resume-selection glass-card">
      <h3>选择要优化的简历</h3>
      <div class="resume-list">
        <div
          v-for="resume in resumes"
          :key="resume.id"
          class="resume-item"
          :class="{ selected: selectedResume?.id === resume.id }"
          @click="selectResume(resume)"
        >
          <el-icon class="file-icon"><Document /></el-icon>
          <div class="resume-info">
            <h4>{{ resume.name }}</h4>
            <p>{{ formatFileSize(resume.size) }} · {{ formatDate(resume.uploadTime) }}</p>
          </div>
          <el-icon v-if="selectedResume?.id === resume.id" class="check-icon">
            <CircleCheck />
          </el-icon>
        </div>
      </div>

      <div v-if="resumes.length === 0" class="no-resume">
        <el-empty description="暂无简历">
          <el-button type="primary" @click="$router.push('/dashboard/resume-manage')">
            上传简历
          </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 优化选项 -->
    <div v-if="selectedResume" class="optimize-options glass-card">
      <h3>优化选项</h3>
      <div class="options-grid">
        <div
          v-for="option in optimizeOptions"
          :key="option.id"
          class="option-card"
          :class="{ selected: selectedOptions.includes(option.id) }"
          @click="toggleOption(option.id)"
        >
          <el-icon :size="40" :color="option.color">
            <component :is="option.icon" />
          </el-icon>
          <h4>{{ option.title }}</h4>
          <p>{{ option.description }}</p>
          <div class="option-check">
            <el-checkbox v-model="selectedOptions" :label="option.id" />
          </div>
        </div>
      </div>
    </div>

    <!-- 开始优化按钮 -->
    <div v-if="selectedResume && selectedOptions.length > 0" class="action-section">
      <el-button
        type="primary"
        size="large"
        @click="startOptimize"
        :loading="optimizing"
        class="optimize-btn"
      >
        <el-icon><Magic /></el-icon>
        开始AI优化
      </el-button>
    </div>

    <!-- 优化进度 -->
    <div v-if="optimizing" class="optimize-progress glass-card">
      <h3>AI正在分析优化您的简历...</h3>
      <el-progress :percentage="optimizeProgress" :status="progressStatus">
        <template #default="{ percentage }">
          <span class="percentage-text">{{ percentage }}%</span>
        </template>
      </el-progress>
      <div class="progress-steps">
        <div
          v-for="(step, index) in progressSteps"
          :key="index"
          class="progress-step"
          :class="{
            active: currentStep === index,
            completed: currentStep > index
          }"
        >
          <el-icon>
            <component :is="step.icon" />
          </el-icon>
          <span>{{ step.text }}</span>
        </div>
      </div>
    </div>

    <!-- 优化结果 -->
    <div v-if="optimizeResult" class="optimize-result">
      <!-- 总体评分 -->
      <div class="score-overview glass-card">
        <h3>简历评分</h3>
        <div class="score-display">
          <div class="score-circle">
            <el-progress
              type="circle"
              :percentage="optimizeResult.overallScore"
              :width="120"
              :stroke-width="8"
            >
              <template #default="{ percentage }">
                <span class="score-text">{{ percentage }}</span>
              </template>
            </el-progress>
          </div>
          <div class="score-details">
            <div class="score-item">
              <span class="label">内容质量</span>
              <el-rate v-model="optimizeResult.contentQuality" disabled show-score />
            </div>
            <div class="score-item">
              <span class="label">格式规范</span>
              <el-rate v-model="optimizeResult.formatScore" disabled show-score />
            </div>
            <div class="score-item">
              <span class="label">关键词匹配</span>
              <el-rate v-model="optimizeResult.keywordMatch" disabled show-score />
            </div>
          </div>
        </div>
      </div>

      <!-- 详细分析 -->
      <div class="analysis-details glass-card">
        <h3>详细分析报告</h3>
        <el-tabs v-model="activeTab">
          <!-- 优化建议 -->
          <el-tab-pane label="优化建议" name="suggestions">
            <div class="suggestions-list">
              <div
                v-for="(suggestion, index) in optimizeResult.suggestions"
                :key="index"
                class="suggestion-item"
                :class="suggestion.type"
              >
                <el-icon>
                  <component :is="getSuggestionIcon(suggestion.type)" />
                </el-icon>
                <div class="suggestion-content">
                  <h5>{{ suggestion.title }}</h5>
                  <p>{{ suggestion.description }}</p>
                  <div v-if="suggestion.examples" class="examples">
                    <p><strong>建议修改为：</strong></p>
                    <ul>
                      <li v-for="example in suggestion.examples" :key="example">
                        {{ example }}
                      </li>
                    </ul>
                  </div>
                </div>
                <el-button
                  v-if="suggestion.actionable"
                  type="primary"
                  size="small"
                  @click="applySuggestion(suggestion)"
                >
                  应用建议
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 关键词分析 -->
          <el-tab-pane label="关键词分析" name="keywords">
            <div class="keyword-analysis">
              <div class="keyword-section">
                <h4>推荐添加的关键词</h4>
                <div class="keyword-tags">
                  <el-tag
                    v-for="keyword in optimizeResult.recommendedKeywords"
                    :key="keyword"
                    type="success"
                    effect="light"
                    class="keyword-tag"
                  >
                    {{ keyword }}
                  </el-tag>
                </div>
              </div>
              <div class="keyword-section">
                <h4>已包含的关键词</h4>
                <div class="keyword-tags">
                  <el-tag
                    v-for="keyword in optimizeResult.existingKeywords"
                    :key="keyword"
                    type="primary"
                    effect="light"
                    class="keyword-tag"
                  >
                    {{ keyword }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 格式建议 -->
          <el-tab-pane label="格式建议" name="format">
            <div class="format-suggestions">
              <div
                v-for="(format, index) in optimizeResult.formatSuggestions"
                :key="index"
                class="format-item"
              >
                <el-icon><DocumentCopy /></el-icon>
                <div class="format-content">
                  <h5>{{ format.title }}</h5>
                  <p>{{ format.description }}</p>
                </div>
                <el-switch
                  v-model="format.enabled"
                  @change="toggleFormatSuggestion(format)"
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 对比预览 -->
      <div class="comparison-preview glass-card">
        <h3>优化前后对比</h3>
        <div class="comparison-container">
          <div class="preview-section">
            <h4>优化前</h4>
            <div class="preview-content original">
              <el-scrollbar height="400px">
                <div class="content-text">
                  {{ optimizeResult.originalContent }}
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="preview-section">
            <h4>优化后</h4>
            <div class="preview-content optimized">
              <el-scrollbar height="400px">
                <div class="content-text">
                  {{ optimizeResult.optimizedContent }}
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>

      <!-- 下载优化结果 -->
      <div class="download-section">
        <el-button type="primary" size="large" @click="downloadOptimized">
          <el-icon><Download /></el-icon>
          下载优化后的简历
        </el-button>
        <el-button size="large" @click="saveAndApply">
          <el-icon><Check /></el-icon>
          保存并应用
        </el-button>
        <el-button size="large" @click="restartOptimize">
          <el-icon><RefreshRight /></el-icon>
          重新优化
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document, CircleCheck, Download, Check, RefreshRight,
  DocumentCopy, DataAnalysis, EditPen, Promotion, Star,
  InfoFilled, WarningFilled, SuccessFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const resumes = ref([])
const selectedResume = ref(null)
const selectedOptions = ref([])
const optimizing = ref(false)
const optimizeProgress = ref(0)
const currentStep = ref(-1)
const optimizeResult = ref(null)
const activeTab = ref('suggestions')

// 优化选项
const optimizeOptions = ref([
  {
    id: 'content',
    title: '内容优化',
    description: '优化工作经历、项目经验等内容表达',
    icon: 'EditPen',
    color: '#409eff'
  },
  {
    id: 'keywords',
    title: '关键词优化',
    description: '添加行业相关关键词，提高匹配度',
    icon: 'Star',
    color: '#67c23a'
  },
  {
    id: 'format',
    title: '格式优化',
    description: '调整排版布局，使简历更美观',
    icon: 'DocumentCopy',
    color: '#e6a23c'
  },
  {
    id: 'structure',
    title: '结构优化',
    description: '重新组织简历结构，突出重点',
    icon: 'DataAnalysis',
    color: '#f56c6c'
  }
])

// 优化进度步骤
const progressSteps = ref([
  { icon: 'Document', text: '分析简历内容' },
  { icon: 'DataAnalysis', text: '智能诊断问题' },
  { icon: 'Magic', text: '生成优化方案' },
  { icon: 'Check', text: '完成优化' }
])

const progressStatus = computed(() => {
  if (optimizeProgress.value === 100) return 'success'
  if (optimizeProgress.value > 0) return ''
  return ''
})

// 方法
const selectResume = (resume) => {
  selectedResume.value = resume
}

const toggleOption = (optionId) => {
  const index = selectedOptions.value.indexOf(optionId)
  if (index > -1) {
    selectedOptions.value.splice(index, 1)
  } else {
    selectedOptions.value.push(optionId)
  }
}

const startOptimize = async () => {
  if (!selectedResume.value || selectedOptions.value.length === 0) {
    ElMessage.warning('请选择简历和优化选项')
    return
  }

  optimizing.value = true
  optimizeProgress.value = 0
  currentStep.value = 0

  try {
    // TODO: 调用后端API进行简历优化
    // const response = await apiService.resume.optimize({
    //   resumeId: selectedResume.value.id,
    //   options: selectedOptions.value
    // })

    // 模拟优化过程
    for (let i = 0; i <= 3; i++) {
      currentStep.value = i
      await new Promise(resolve => setTimeout(resolve, 1500))
      optimizeProgress.value = (i + 1) * 25
    }

    // 模拟优化结果
    optimizeResult.value = {
      overallScore: 85,
      contentQuality: 4,
      formatScore: 4,
      keywordMatch: 5,
      suggestions: [
        {
          type: 'warning',
          title: '工作经历描述过于简单',
          description: '建议使用STAR法则（情境、任务、行动、结果）来描述工作经历，更具说服力。',
          examples: [
            '负责用户增长 → 通过A/B测试和数据分析，将用户留存率提升了25%',
            '参与项目开发 → 独立负责核心模块开发，使项目性能提升30%'
          ],
          actionable: true
        },
        {
          type: 'success',
          title: '技能关键词匹配良好',
          description: '您的技能部分与目标岗位要求匹配度较高，建议保持。',
          actionable: false
        },
        {
          type: 'info',
          title: '添加项目成果量化',
          description: '建议在项目经历中加入具体的数据和成果，如用户数、性能提升等。',
          examples: [
            '优化了系统性能 → 系统响应时间从2秒降低到0.5秒',
            '提升了用户体验 → 用户满意度从85%提升到95%'
          ],
          actionable: true
        }
      ],
      recommendedKeywords: ['Vue.js', 'React', 'Node.js', 'TypeScript', '敏捷开发'],
      existingKeywords: ['JavaScript', 'HTML', 'CSS', 'Git', '团队协作'],
      formatSuggestions: [
        {
          title: '统一字体格式',
          description: '建议使用统一的字体大小和样式',
          enabled: true
        },
        {
          title: '优化段落间距',
          description: '调整段落间距，提高可读性',
          enabled: true
        }
      ],
      originalContent: '这里是原始简历内容...',
      optimizedContent: '这里是优化后的简历内容...'
    }

    ElMessage.success('简历优化完成！')

  } catch (error) {
    ElMessage.error('优化失败，请重试')
    console.error('Optimize error:', error)
  } finally {
    optimizing.value = false
  }
}

const getSuggestionIcon = (type) => {
  const icons = {
    warning: 'WarningFilled',
    success: 'SuccessFilled',
    info: 'InfoFilled'
  }
  return icons[type] || 'InfoFilled'
}

const applySuggestion = (suggestion) => {
  ElMessage.success('建议已应用到优化版本中')
}

const toggleFormatSuggestion = (format) => {
  ElMessage.info(`${format.enabled ? '启用' : '禁用'}了${format.title}`)
}

const downloadOptimized = () => {
  // TODO: 实现下载功能
  ElMessage.success('正在准备下载...')
}

const saveAndApply = async () => {
  try {
    // TODO: 调用后端API保存优化结果
    // await apiService.resume.saveOptimized(optimizeResult.value)

    ElMessage.success('优化结果已保存')
    router.push('/dashboard/resume-manage')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const restartOptimize = () => {
  optimizeResult.value = null
  selectedOptions.value = []
  optimizeProgress.value = 0
  currentStep.value = -1
}

// 工具方法
const formatFileSize = (size) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / 1024 / 1024).toFixed(1) + ' MB'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 加载简历列表
const loadResumes = async () => {
  try {
    // TODO: 调用后端API获取简历列表
    // const response = await apiService.resume.getList()
    // resumes.value = response.data

    // 模拟数据
    resumes.value = [
      {
        id: 1,
        name: '前端开发工程师_简历.pdf',
        size: 1024 * 256,
        uploadTime: new Date('2024-01-15')
      },
      {
        id: 2,
        name: '产品经理_简历.docx',
        size: 1024 * 312,
        uploadTime: new Date('2024-01-10')
      }
    ]
  } catch (error) {
    ElMessage.error('加载简历列表失败')
  }
}

onMounted(() => {
  loadResumes()
})
</script>

<style scoped>
.resume-optimize-container {
  max-width: 1200px;
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

/* 简历选择 */
.resume-selection {
  padding: 30px;
  margin-bottom: 30px;
}

.resume-selection h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.resume-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.resume-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.resume-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.resume-item.selected {
  border-color: var(--primary-color);
  background: rgba(64, 158, 255, 0.1);
}

.file-icon {
  font-size: 40px;
  color: var(--primary-color);
}

.resume-info {
  flex: 1;
}

.resume-info h4 {
  color: var(--text-primary);
  margin: 0 0 5px 0;
}

.resume-info p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
}

.check-icon {
  color: var(--success-color);
  font-size: 24px;
}

/* 优化选项 */
.optimize-options {
  padding: 30px;
  margin-bottom: 30px;
}

.optimize-options h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.option-card {
  padding: 25px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
}

.option-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.05);
}

.option-card.selected {
  border-color: var(--primary-color);
  background: rgba(64, 158, 255, 0.1);
}

.option-card h4 {
  color: var(--text-primary);
  margin: 15px 0 10px 0;
}

.option-card p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.option-check {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* 行动区域 */
.action-section {
  text-align: center;
  margin-bottom: 30px;
}

.optimize-btn {
  padding: 15px 40px;
  font-size: 1.1rem;
}

/* 优化进度 */
.optimize-progress {
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
}

.optimize-progress h3 {
  color: var(--text-primary);
  margin-bottom: 20px;
}

.percentage-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-primary);
}

.progress-steps {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.progress-step.active {
  opacity: 1;
  color: var(--primary-color);
  transform: scale(1.1);
}

.progress-step.completed {
  opacity: 1;
  color: var(--success-color);
}

/* 优化结果 */
.optimize-result {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.score-overview {
  padding: 30px;
}

.score-overview h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.score-display {
  display: flex;
  align-items: center;
  gap: 40px;
}

.score-circle {
  flex-shrink: 0;
}

.score-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.score-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score-item .label {
  width: 100px;
  color: var(--text-secondary);
}

/* 分析详情 */
.analysis-details {
  padding: 30px;
}

.analysis-details h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.suggestion-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border-left: 4px solid;
}

.suggestion-item.warning {
  border-left-color: #e6a23c;
}

.suggestion-item.success {
  border-left-color: #67c23a;
}

.suggestion-item.info {
  border-left-color: #409eff;
}

.suggestion-content {
  flex: 1;
}

.suggestion-content h5 {
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.suggestion-content p {
  color: var(--text-secondary);
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.examples {
  margin-top: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.examples ul {
  margin: 10px 0 0 20px;
  color: var(--text-secondary);
}

.keyword-analysis {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.keyword-section h4 {
  color: var(--text-primary);
  margin-bottom: 15px;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword-tag {
  margin: 0;
}

.format-suggestions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.format-content {
  flex: 1;
}

.format-content h5 {
  color: var(--text-primary);
  margin: 0 0 5px 0;
}

.format-content p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
}

/* 对比预览 */
.comparison-preview {
  padding: 30px;
}

.comparison-preview h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.comparison-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.preview-section h4 {
  color: var(--text-primary);
  margin-bottom: 15px;
}

.preview-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 20px;
}

.content-text {
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 下载区域 */
.download-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .score-display {
    flex-direction: column;
    text-align: center;
  }

  .comparison-container {
    grid-template-columns: 1fr;
  }

  .download-section {
    flex-direction: column;
  }
}
</style>
