<template>
  <div class="interview-practice-container">
    <!-- 未开始状态 -->
    <div v-if="!hasStarted" class="start-section">
      <div class="page-header">
        <h2 class="page-title">面试练习模式</h2>
        <p class="page-subtitle">AI陪练模式，可随时暂停思考，获得实时指导</p>
      </div>

      <!-- 设置面板 -->
      <div class="settings-panel glass-card">
        <h3>面试设置</h3>

        <el-form label-width="120px">
          <el-form-item label="选择岗位">
            <el-select v-model="settings.position" placeholder="请选择面试岗位">
              <el-option label="前端开发" value="frontend" />
              <el-option label="后端开发" value="backend" />
              <el-option label="产品经理" value="product" />
              <el-option label="UI设计师" value="design" />
              <el-option label="数据分析" value="data" />
            </el-select>
          </el-form-item>

          <el-form-item label="难度等级">
            <el-radio-group v-model="settings.difficulty">
              <el-radio label="junior">初级</el-radio>
              <el-radio label="medium">中级</el-radio>
              <el-radio label="senior">高级</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="练习时长">
            <el-slider
              v-model="settings.duration"
              :min="10"
              :max="60"
              :step="5"
              show-input
            />
          </el-form-item>

          <el-form-item label="题目类型">
            <el-checkbox-group v-model="settings.questionTypes">
              <el-checkbox label="behavioral">行为面试题</el-checkbox>
              <el-checkbox label="technical">技术面试题</el-checkbox>
              <el-checkbox label="situational">情景面试题</el-checkbox>
              <el-checkbox label="project">项目经验题</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <div class="settings-actions">
          <button class="start-btn tech-button" @click="startPractice">
            开始练习
          </button>
        </div>
      </div>

      <!-- 练习说明 -->
      <div class="practice-tips glass-card">
        <h3>练习模式特点</h3>
        <div class="tips-grid">
          <div class="tip-item">
            <el-icon :size="30" color="#67c23a"><CircleCheck /></el-icon>
            <h4>随时暂停</h4>
            <p>遇到困难可以暂停思考，不计入评分</p>
          </div>
          <div class="tip-item">
            <el-icon :size="30" color="#409eff"><Opportunity /></el-icon>
            <h4>AI提示</h4>
            <p>可以获取AI的回答建议和提示</p>
          </div>
          <div class="tip-item">
            <el-icon :size="30" color="#e6a23c"><ChatLineRound /></el-icon>
            <h4>实时反馈</h4>
            <p>每个问题结束后立即获得反馈</p>
          </div>
          <div class="tip-item">
            <el-icon :size="30" color="#f56c6c"><TrendCharts /></el-icon>
            <h4>进步追踪</h4>
            <p>记录练习数据，追踪能力提升</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试进行中 -->
    <div v-else class="interview-section">
      <!-- 顶部控制栏 -->
      <div class="control-bar glass-card">
        <div class="control-left">
          <el-tag type="success">练习模式</el-tag>
          <span class="question-progress">
            第 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }} 题
          </span>
        </div>

        <div class="control-center">
          <div class="timer" :class="{ paused: isPaused }">
            <el-icon><Timer /></el-icon>
            <span>{{ formatTime(elapsedTime) }}</span>
          </div>
        </div>

        <div class="control-right">
          <el-button
            :type="isPaused ? 'success' : 'warning'"
            @click="togglePause"
          >
            <el-icon>
              <VideoPlay v-if="isPaused" />
              <VideoPause v-else />
            </el-icon>
            {{ isPaused ? '继续' : '暂停' }}
          </el-button>
          <el-button type="danger" @click="endPractice">
            结束练习
          </el-button>
        </div>
      </div>

      <!-- 视频区域 -->
      <div class="video-section">
        <div class="video-container glass-card">
          <video ref="videoRef" autoplay muted></video>
          <div v-if="!cameraEnabled" class="video-placeholder">
            <el-icon :size="60"><VideoCamera /></el-icon>
            <p>摄像头未开启</p>
            <el-button type="primary" size="small" @click="enableCamera">
              开启摄像头
            </el-button>
          </div>
        </div>

        <!-- AI面试官 -->
        <div class="interviewer-container glass-card">
          <div class="interviewer-avatar">
            <el-avatar :size="80">
              <el-icon :size="40"><User /></el-icon>
            </el-avatar>
            <span class="interviewer-name">AI面试官</span>
          </div>

          <div class="current-question">
            <h3>当前问题：</h3>
            <p>{{ currentQuestion.text }}</p>
          </div>

          <!-- AI助手 -->
          <div v-if="showHint" class="ai-hint animate__animated animate__fadeIn">
            <h4><el-icon><Bulb /></el-icon> AI提示</h4>
            <p>{{ currentQuestion.hint }}</p>
          </div>
        </div>
      </div>

      <!-- 回答控制 -->
      <div class="answer-controls glass-card">
        <div class="controls-main">
          <el-button
            v-if="!isRecording"
            type="primary"
            size="large"
            @click="startRecording"
          >
            <el-icon><Microphone /></el-icon>
            开始回答
          </el-button>
          <el-button
            v-else
            type="danger"
            size="large"
            @click="stopRecording"
          >
            <el-icon><VideoPause /></el-icon>
            结束回答
          </el-button>

          <el-button
            type="info"
            size="large"
            @click="getHint"
            :disabled="hintUsed"
          >
            <el-icon><Bulb /></el-icon>
            获取提示
          </el-button>

          <el-button
            size="large"
            @click="skipQuestion"
          >
            <el-icon><Right /></el-icon>
            跳过问题
          </el-button>
        </div>

        <!-- 录音状态 -->
        <div v-if="isRecording" class="recording-status">
          <span class="recording-dot"></span>
          正在录音...
        </div>
      </div>

      <!-- 实时反馈 -->
      <div v-if="currentFeedback" class="feedback-section glass-card animate__animated animate__fadeIn">
        <h3>AI反馈</h3>
        <div class="feedback-content">
          <div class="feedback-score">
            <el-rate
              v-model="currentFeedback.score"
              disabled
              show-score
              text-color="#ff9900"
            />
          </div>
          <div class="feedback-text">
            <p><strong>优点：</strong>{{ currentFeedback.pros }}</p>
            <p><strong>建议：</strong>{{ currentFeedback.cons }}</p>
            <p><strong>参考答案：</strong>{{ currentFeedback.reference }}</p>
          </div>
        </div>
        <el-button type="primary" @click="nextQuestion">
          下一题
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  CircleCheck,
  Opportunity,
  ChatLineRound,
  TrendCharts,
  Timer,
  VideoPlay,
  VideoPause,
  VideoCamera,
  User,
  Microphone,
  Bulb,
  Right
} from '@element-plus/icons-vue'

const router = useRouter()

// 状态管理
const hasStarted = ref(false)
const isPaused = ref(false)
const isRecording = ref(false)
const cameraEnabled = ref(false)
const showHint = ref(false)
const hintUsed = ref(false)

// 练习设置
const settings = ref({
  position: 'frontend',
  difficulty: 'medium',
  duration: 30,
  questionTypes: ['behavioral', 'technical']
})

// 视频相关
const videoRef = ref(null)
let mediaStream = null

// 题目相关
const currentQuestionIndex = ref(0)
const totalQuestions = ref(5)
const currentQuestion = ref({
  text: '请做一下自我介绍，包括您的教育背景、工作经验和技能特长。',
  hint: '建议按照"个人信息-教育背景-项目经验-技能特长-职业规划"的结构来组织回答，时间控制在2-3分钟。',
  type: 'behavioral'
})
const currentFeedback = ref(null)

// 计时器
const elapsedTime = ref(0)
let timerInterval = null

// 模拟题库
const questions = [
  {
    text: '请做一下自我介绍，包括您的教育背景、工作经验和技能特长。',
    hint: '建议按照"个人信息-教育背景-项目经验-技能特长-职业规划"的结构来组织回答。',
    type: 'behavioral'
  },
  {
    text: '说说您对前端开发的理解，以及您认为一个优秀的前端工程师应该具备哪些能力？',
    hint: '可以从技术能力、工程能力、协作能力、学习能力等多个维度来回答。',
    type: 'technical'
  },
  {
    text: '请介绍一个您最有成就感的项目，包括项目背景、您的角色和贡献。',
    hint: '使用STAR法则：Situation（情境）、Task（任务）、Action（行动）、Result（结果）。',
    type: 'project'
  },
  {
    text: '当您与团队成员意见不一致时，您会如何处理？',
    hint: '展示您的沟通能力、团队协作精神和解决冲突的能力。',
    type: 'situational'
  },
  {
    text: '您有什么想问我的吗？',
    hint: '可以询问公司文化、团队情况、项目挑战、职业发展等方面的问题。',
    type: 'behavioral'
  }
]

// 开始练习
const startPractice = async () => {
  const hasResume = localStorage.getItem('userResume')
  if (!hasResume) {
    const confirm = await ElMessageBox.confirm(
      '检测到您还未上传简历，建议先上传简历以获得个性化的面试题目。是否继续？',
      '提示',
      {
        confirmButtonText: '继续练习',
        cancelButtonText: '去上传简历',
        type: 'warning'
      }
    ).catch(() => false)

    if (!confirm) {
      router.push('/dashboard/resume-manage')
      return
    }
  }

  hasStarted.value = true
  startTimer()
  enableCamera()
}

// 开启摄像头
const enableCamera = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
    }
    cameraEnabled.value = true
  } catch (error) {
    ElMessage.error('无法访问摄像头，请检查权限设置')
    console.error('Camera error:', error)
  }
}

// 计时器功能
const startTimer = () => {
  timerInterval = setInterval(() => {
    if (!isPaused.value) {
      elapsedTime.value++
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 暂停/继续
const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    ElMessage.info('练习已暂停，点击继续按钮恢复')
  }
}

// 录音控制
const startRecording = () => {
  isRecording.value = true
  ElMessage.success('开始录音，请回答问题')
}

const stopRecording = () => {
  isRecording.value = false
  // 模拟AI分析和反馈
  setTimeout(() => {
    currentFeedback.value = {
      score: 4,
      pros: '回答结构清晰，表达流畅，重点突出。',
      cons: '可以增加一些具体的案例来支撑观点，让回答更有说服力。',
      reference: '参考答案：应该从个人基本信息开始，然后介绍教育背景和主要技能，接着重点说明相关项目经验，最后表达对应聘岗位的兴趣和匹配度。'
    }
  }, 1500)
}

// 获取提示
const getHint = () => {
  showHint.value = true
  hintUsed.value = true
  ElMessage.info('已显示AI提示，本题将不计入综合评分')
}

// 跳过问题
const skipQuestion = () => {
  nextQuestion()
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    currentQuestion.value = questions[currentQuestionIndex.value]
    currentFeedback.value = null
    showHint.value = false
    hintUsed.value = false
  } else {
    endPractice()
  }
}

// 结束练习
const endPractice = async () => {
  const confirm = await ElMessageBox.confirm(
    '确定要结束本次练习吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).catch(() => false)

  if (confirm) {
    // 清理资源
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
    }
    if (timerInterval) {
      clearInterval(timerInterval)
    }

    ElMessage.success('练习结束，正在生成报告...')
    router.push('/dashboard/interview-performance')
  }
}

// 生命周期
onUnmounted(() => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.interview-practice-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 开始页面样式 */
.start-section {
  max-width: 800px;
  margin: 0 auto;
}

.settings-panel {
  padding: 30px;
  margin-bottom: 30px;
}

.settings-panel h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.settings-actions {
  text-align: center;
  margin-top: 30px;
}

.start-btn {
  padding: 15px 50px;
  font-size: 1.1rem;
}

/* 练习说明 */
.practice-tips {
  padding: 30px;
}

.practice-tips h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.tip-item {
  text-align: center;
}

.tip-item h4 {
  margin: 15px 0 10px;
  color: var(--text-primary);
}

.tip-item p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 面试进行中样式 */
.interview-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 控制栏 */
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
}

.control-left,
.control-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.question-progress {
  color: var(--text-secondary);
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.timer.paused {
  color: var(--warning-color);
}

/* 视频区域 */
.video-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 400px;
}

.video-container,
.interviewer-container {
  position: relative;
  overflow: hidden;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.video-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.video-placeholder p {
  margin: 15px 0;
}

/* AI面试官 */
.interviewer-container {
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.interviewer-avatar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.interviewer-name {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.current-question h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.current-question p {
  font-size: 1.2rem;
  color: var(--text-primary);
  line-height: 1.8;
}

.ai-hint {
  margin-top: 20px;
  padding: 15px;
  background: rgba(103, 194, 58, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.ai-hint h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--secondary-color);
  margin-bottom: 10px;
}

.ai-hint p {
  color: var(--text-primary);
  line-height: 1.6;
}

/* 回答控制 */
.answer-controls {
  padding: 25px;
  text-align: center;
}

.controls-main {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.recording-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--danger-color);
}

.recording-dot {
  width: 10px;
  height: 10px;
  background: var(--danger-color);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 反馈区域 */
.feedback-section {
  padding: 30px;
}

.feedback-section h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.feedback-content {
  margin-bottom: 25px;
}

.feedback-score {
  margin-bottom: 20px;
}

.feedback-text p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.feedback-text strong {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .video-section {
    grid-template-columns: 1fr;
    height: auto;
  }

  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .control-bar {
    flex-wrap: wrap;
    gap: 15px;
  }

  .controls-main {
    flex-wrap: wrap;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
