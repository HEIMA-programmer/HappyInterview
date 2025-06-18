<template>
  <div class="resume-manage-container">
    <div class="page-header">
      <h2 class="page-title">简历管理</h2>
      <p class="page-subtitle">上传和管理您的简历，获得个性化的面试体验</p>
    </div>

    <!-- 上传区域 -->
    <div class="upload-section glass-card">
      <el-upload
        class="resume-uploader"
        drag
        action="#"
        :before-upload="beforeUpload"
        :on-success="handleUploadSuccess"
        :file-list="fileList"
        :limit="3"
        accept=".pdf,.doc,.docx"
      >
        <div class="upload-content">
          <el-icon class="upload-icon"><UploadFilled /></el-icon>
          <div class="upload-text">
            <p class="main-text">拖拽文件到此处或点击上传</p>
            <p class="sub-text">支持 PDF、DOC、DOCX 格式，最多上传3份简历</p>
          </div>
        </div>
      </el-upload>
    </div>

    <!-- 简历列表 -->
    <div class="resume-list" v-if="resumes.length > 0">
      <h3>我的简历</h3>
      <div class="resume-grid">
        <div
          v-for="resume in resumes"
          :key="resume.id"
          class="resume-card glass-card hover-float"
          :class="{ active: resume.isActive }"
        >
          <div class="resume-header">
            <el-icon :size="40" class="file-icon">
              <Document />
            </el-icon>
            <el-tag
              v-if="resume.isActive"
              type="success"
              size="small"
              class="active-tag"
            >
              当前使用
            </el-tag>
          </div>

          <div class="resume-info">
            <h4 class="resume-name">{{ resume.name }}</h4>
            <p class="resume-meta">
              <span>{{ formatFileSize(resume.size) }}</span>
              <span class="separator">·</span>
              <span>{{ formatDate(resume.uploadTime) }}</span>
            </p>
            <div class="resume-tags">
              <el-tag
                v-for="tag in resume.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <div class="resume-actions">
            <el-button
              v-if="!resume.isActive"
              type="primary"
              size="small"
              @click="setActiveResume(resume.id)"
            >
              设为当前
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="previewResume(resume)"
            >
              预览
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              @click="deleteResume(resume.id)"
            >
              删除
            </el-button>
          </div>

          <!-- 分析进度 -->
          <div v-if="resume.analyzing" class="analysis-progress">
            <p>AI正在分析简历...</p>
            <el-progress :percentage="resume.progress" />
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="暂无简历，请上传您的简历">
        <el-button type="primary" @click="scrollToUpload">
          立即上传
        </el-button>
      </el-empty>
    </div>

    <!-- 简历解析结果 -->
    <div v-if="activeResume && activeResume.parsed" class="parse-result glass-card">
      <h3>简历解析结果</h3>
      <div class="parse-content">
        <div class="parse-item">
          <span class="parse-label">姓名：</span>
          <span class="parse-value">{{ activeResume.parsed.name || '未识别' }}</span>
        </div>
        <div class="parse-item">
          <span class="parse-label">求职意向：</span>
          <span class="parse-value">{{ activeResume.parsed.position || '未识别' }}</span>
        </div>
        <div class="parse-item">
          <span class="parse-label">工作经验：</span>
          <span class="parse-value">{{ activeResume.parsed.experience || '未识别' }}</span>
        </div>
        <div class="parse-item">
          <span class="parse-label">技能标签：</span>
          <div class="parse-tags">
            <el-tag
              v-for="skill in activeResume.parsed.skills"
              :key="skill"
              size="small"
            >
              {{ skill }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tips-section">
      <el-alert
        title="温馨提示"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <ul class="tips-list">
            <li>上传简历后，AI会自动解析并生成个性化的面试题库</li>
            <li>您可以上传多份简历，针对不同岗位进行针对性练习</li>
            <li>简历信息仅用于生成面试题目，我们会严格保护您的隐私</li>
          </ul>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, UploadFilled } from '@element-plus/icons-vue'

// 响应式数据
const fileList = ref([])
const resumes = ref([
  {
    id: 1,
    name: '张三_前端开发_简历.pdf',
    size: 1024 * 256, // 256KB
    uploadTime: new Date('2024-01-15'),
    isActive: true,
    analyzing: false,
    progress: 100,
    tags: ['前端开发', '3年经验', 'Vue'],
    parsed: {
      name: '张三',
      position: '前端开发工程师',
      experience: '3年',
      skills: ['Vue.js', 'React', 'Node.js', 'TypeScript']
    }
  }
])

// 计算当前激活的简历
const activeResume = computed(() => {
  return resumes.value.find(r => r.isActive)
})

// 文件上传前的校验
const beforeUpload = (file) => {
  const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isValidType) {
    ElMessage.error('只能上传 PDF、DOC、DOCX 格式的文件！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB！')
    return false
  }

  return true
}

// 上传成功处理
const handleUploadSuccess = (response, file) => {
  // 模拟上传成功
  const newResume = {
    id: Date.now(),
    name: file.name,
    size: file.size,
    uploadTime: new Date(),
    isActive: resumes.value.length === 0,
    analyzing: true,
    progress: 0,
    tags: [],
    parsed: null
  }

  resumes.value.push(newResume)

  // 模拟AI分析过程
  simulateAnalysis(newResume)
}

// 模拟AI分析
const simulateAnalysis = (resume) => {
  const interval = setInterval(() => {
    resume.progress += 20
    if (resume.progress >= 100) {
      clearInterval(interval)
      resume.analyzing = false

      // 模拟解析结果
      resume.parsed = {
        name: '用户姓名',
        position: '求职岗位',
        experience: '工作年限',
        skills: ['技能1', '技能2', '技能3']
      }
      resume.tags = ['技术岗', '本科', '应届生']

      ElMessage.success('简历分析完成！')
    }
  }, 500)
}

// 设置当前使用的简历
const setActiveResume = (id) => {
  resumes.value.forEach(resume => {
    resume.isActive = resume.id === id
  })
  ElMessage.success('已切换当前使用的简历')
}

// 预览简历
const previewResume = () => {
  ElMessage.info(`预览功能开发中...`)
}

// 删除简历
const deleteResume = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这份简历吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const index = resumes.value.findIndex(r => r.id === id)
    const wasActive = resumes.value[index].isActive
    resumes.value.splice(index, 1)

    // 如果删除的是当前使用的简历，自动切换到第一份
    if (wasActive && resumes.value.length > 0) {
      resumes.value[0].isActive = true
    }

    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / 1024 / 1024).toFixed(1) + ' MB'
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 滚动到上传区域
const scrollToUpload = () => {
  document.querySelector('.upload-section').scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.resume-manage-container {
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

/* 上传区域 */
.upload-section {
  padding: 40px;
  margin-bottom: 40px;
}

.resume-uploader :deep(.el-upload) {
  width: 100%;
}

.resume-uploader :deep(.el-upload-dragger) {
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.resume-uploader :deep(.el-upload-dragger:hover) {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.05);
}

.upload-content {
  padding: 40px;
  text-align: center;
}

.upload-icon {
  font-size: 60px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.upload-text .main-text {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.upload-text .sub-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 简历列表 */
.resume-list {
  margin-bottom: 40px;
}

.resume-list h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.resume-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.resume-card {
  padding: 25px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.resume-card.active {
  border: 2px solid var(--primary-color);
}

.resume-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
}

.file-icon {
  color: var(--primary-color);
}

.active-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.resume-info {
  margin-bottom: 20px;
}

.resume-name {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 8px;
  word-break: break-all;
}

.resume-meta {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.separator {
  margin: 0 8px;
}

.resume-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.resume-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.analysis-progress {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.analysis-progress p {
  color: var(--text-secondary);
  margin-bottom: 10px;
}

/* 解析结果 */
.parse-result {
  padding: 30px;
  margin-bottom: 30px;
}

.parse-result h3 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.parse-content {
  display: grid;
  gap: 15px;
}

.parse-item {
  display: flex;
  align-items: flex-start;
}

.parse-label {
  width: 100px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.parse-value {
  color: var(--text-primary);
}

.parse-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
}

/* 提示信息 */
.tips-section {
  margin-top: 40px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.8;
}

.tips-list li {
  color: var(--text-secondary);
}
</style>
