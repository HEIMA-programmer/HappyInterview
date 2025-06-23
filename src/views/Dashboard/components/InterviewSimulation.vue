<template>
  <div class="interview-simulation-container">
    <!-- 未开始状态 -->
    <div v-if="!hasStarted" class="start-section">
      <div class="page-header">
        <h2 class="page-title">面试模拟模式</h2>
        <p class="page-subtitle">完全模拟真实面试场景，全程无中断，获得综合评测报告</p>
      </div>

      <!-- 设置面板 -->
      <div class="settings-panel glass-card">
        <h3>面试设置</h3>

        <el-form label-width="120px">
          <el-form-item label="面试公司">
            <el-select v-model="settings.company" placeholder="选择模拟的公司类型">
              <el-option label="互联网大厂" value="tech">
                <span style="float: left">互联网大厂</span>
                <span style="float: right; color: var(--text-secondary); font-size: 13px">
                  偏技术深度，节奏较快
                </span>
              </el-option>
              <el-option label="外企" value="foreign">
                <span style="float: left">外企</span>
                <span style="float: right; color: var(--text-secondary); font-size: 13px">
                  重视英语表达，注重软技能
                </span>
              </el-option>
              <el-option label="国企/事业单位" value="state">
                <span style="float: left">国企/事业单位</span>
                <span style="float: right; color: var(--text-secondary); font-size: 13px">
                  偏综合素质，稳重为主
                </span>
              </el-option>
              <el-option label="创业公司" value="startup">
                <span style="float: left">创业公司</span>
                <span style="float: right; color: var(--text-secondary); font-size: 13px">
                  看重潜力，灵活多变
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="面试岗位">
            <el-select v-model="settings.position" placeholder="请选择面试岗位">
              <el-option label="前端开发" value="frontend" />
              <el-option label="后端开发" value="backend" />
              <el-option label="算法工程师" value="algorithm" />
              <el-option label="产品经理" value="product" />
              <el-option label="UI设计师" value="design" />
            </el-select>
          </el-form-item>

          <el-form-item label="面试轮次">
            <el-radio-group v-model="settings.round">
              <el-radio label="first">初试</el-radio>
              <el-radio label="second">复试</el-radio>
              <el-radio label="final">终面</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="面试时长">
            <el-select v-model="settings.duration">
              <el-option :label="'30分钟'" :value="30" />
              <el-option :label="'45分钟'" :value="45" />
              <el-option :label="'60分钟'" :value="60" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="settings-tips">
          <el-alert type="warning" :closable="false" show-icon>
            <template #title>
              模拟模式注意事项
            </template>
            <template #default>
              <ul>
                <li>面试过程不可暂停，请确保有充足时间</li>
                <li>全程录音录像，用于后续分析</li>
                <li>结束后生成详细的面试评测报告</li>
              </ul>
            </template>
          </el-alert>
        </div>

        <div class="settings-actions">
          <button class="start-btn tech-button" @click="startSimulation">
            开始模拟面试
          </button>
        </div>
      </div>
    </div>

    <!-- 面试进行中 -->
    <div v-else class="interview-main">
      <!-- 左侧：虚拟面试官和交互区 -->
      <div class="interview-left">
        <!-- 虚拟数字人容器 -->
        <div class="avatar-container glass-card">
          <div ref="avatarCanvas" class="avatar-canvas"></div>
          <div class="interviewer-info">
            <h3>{{ currentInterviewer.name }}</h3>
            <p>{{ currentInterviewer.title }}</p>
          </div>
        </div>

        <!-- 对话显示区 -->
        <div class="dialogue-container glass-card">
          <div class="dialogue-header">
            <el-icon><ChatLineSquare /></el-icon>
            <span>对话内容</span>
          </div>
          <div class="dialogue-content" ref="dialogueScroll">
            <div
              v-for="(item, index) in dialogueHistory"
              :key="index"
              class="dialogue-item"
              :class="item.role"
            >
              <div class="dialogue-avatar">
                <el-icon v-if="item.role === 'interviewer'"><User /></el-icon>
                <el-icon v-else><UserFilled /></el-icon>
              </div>
              <div class="dialogue-bubble">
                <p>{{ item.content }}</p>
                <span class="dialogue-time">{{ formatTime(item.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 语音输入控制 -->
        <div class="voice-control glass-card">
          <div class="voice-status">
            <div v-if="isListening" class="voice-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>{{ voiceStatus }}</p>
          </div>
          <button
            class="voice-btn"
            :class="{ active: isRecording }"
            @click="toggleRecording"
          >
            <el-icon :size="30">
              <Microphone v-if="!isRecording" />
              <CircleClose v-else />
            </el-icon>
          </button>
          <div class="voice-tips">
            {{ isRecording ? '点击结束回答' : '点击开始回答' }}
          </div>
        </div>
      </div>

      <!-- 右侧：会话记录和状态 -->
      <div class="interview-right">
        <!-- 面试进度 -->
        <div class="progress-card glass-card">
          <h4>面试进度</h4>
          <el-progress
            :percentage="progressPercentage"
            :status="progressStatus"
          />
          <div class="progress-info">
            <span>已进行：{{ formatDuration(elapsedTime) }}</span>
            <span>剩余：{{ formatDuration(remainingTime) }}</span>
          </div>
        </div>

        <!-- 会话记录 -->
        <div class="session-record glass-card">
          <div class="record-header">
            <h4>会话记录</h4>
            <el-tag size="small" type="danger">
              <el-icon><VideoCamera /></el-icon>
              录制中
            </el-tag>
          </div>

          <div class="record-timeline">
            <el-timeline>
              <el-timeline-item
                v-for="(record, index) in sessionRecords"
                :key="index"
                :timestamp="record.time"
                :type="record.type"
                :hollow="true"
              >
                <div class="record-content">
                  <p class="record-question">{{ record.question }}</p>
                  <p class="record-answer" v-if="record.answer">
                    {{ record.answer }}
                  </p>
                  <div class="record-metrics" v-if="record.metrics">
                    <el-tag
                      v-for="(value, key) in record.metrics"
                      :key="key"
                      size="small"
                      type="info"
                    >
                      {{ key }}: {{ value }}
                    </el-tag>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>

        <!-- 实时提醒 -->
        <div class="reminder-card glass-card">
          <h4>智能提醒</h4>
          <div class="reminder-list">
            <div
              v-for="(tip, index) in currentTips"
              :key="index"
              class="reminder-item"
              :class="tip.type"
            >
              <el-icon>
                <WarningFilled v-if="tip.type === 'warning'" />
                <SuccessFilled v-if="tip.type === 'success'" />
                <InfoFilled v-if="tip.type === 'info'" />
              </el-icon>
              <span>{{ tip.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试结束弹窗 -->
    <el-dialog
      v-model="showEndDialog"
      title="面试已结束"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="end-dialog-content">
        <el-result icon="success">
          <template #title>
            <p>恭喜您完成本次模拟面试！</p>
          </template>
          <template #sub-title>
            <p>AI正在为您生成详细的面试评测报告...</p>
          </template>
          <template #extra>
            <el-button type="primary" @click="viewReport">
              查看报告
            </el-button>
            <el-button @click="backToList">
              返回列表
            </el-button>
          </template>
        </el-result>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as THREE from 'three'
import {
  User,
  UserFilled,
  ChatLineSquare,
  Microphone,
  CircleClose,
  VideoCamera,
  WarningFilled,
  SuccessFilled,
  InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// 状态管理
const hasStarted = ref(false)
const isRecording = ref(false)
const isListening = ref(false)
const showEndDialog = ref(false)

// 面试设置
const settings = ref({
  company: 'tech',
  position: 'frontend',
  round: 'first',
  duration: 30
})

// 虚拟面试官信息
const currentInterviewer = ref({
  name: '李面试官',
  title: '技术面试官',
  avatar: 'interviewer-1'
})

// 对话历史
const dialogueHistory = ref([])
const sessionRecords = ref([])
const currentTips = ref([])

// 语音状态
const voiceStatus = ref('点击麦克风开始回答')

// 时间管理
const elapsedTime = ref(0)
const totalTime = computed(() => settings.value.duration * 60)
const remainingTime = computed(() => Math.max(0, totalTime.value - elapsedTime.value))
const progressPercentage = computed(() => Math.round((elapsedTime.value / totalTime.value) * 100))
const progressStatus = computed(() => {
  if (progressPercentage.value >= 90) return 'exception'
  if (progressPercentage.value >= 70) return 'warning'
  return ''
})

// Three.js相关
let scene, camera, renderer, avatarMesh
const avatarCanvas = ref(null)

// 对话滚动容器
const dialogueScroll = ref(null)

// 初始化虚拟数字人
const initAvatar = () => {
  if (!avatarCanvas.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0e27)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    45,
    avatarCanvas.value.clientWidth / avatarCanvas.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 5)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(avatarCanvas.value.clientWidth, avatarCanvas.value.clientHeight)
  avatarCanvas.value.appendChild(renderer.domElement)

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(0, 1, 1)
  scene.add(directionalLight)

  // 创建简单的数字人模型（这里用基础几何体代替）
  // TODO: 后续接入真实的3D数字人模型
  const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8)
  const material = new THREE.MeshPhongMaterial({ color: 0x4a90e2 })
  avatarMesh = new THREE.Mesh(geometry, material)
  scene.add(avatarMesh)

  // 动画循环
  animate()
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)

  // 简单的动画效果
  if (avatarMesh) {
    avatarMesh.rotation.y += 0.005
    if (isListening.value) {
      // 说话时的动画
      avatarMesh.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.05
    }
  }

  renderer?.render(scene, camera)
}

// 开始模拟面试
const startSimulation = async () => {
  try {
    // TODO: 调用后端API开始面试
    // const { interviewId, questions } = await apiService.interview.start({
    //   type: 'simulation',
    //   ...settings.value
    // })

    hasStarted.value = true

    // 初始化虚拟数字人
    nextTick(() => {
      initAvatar()
    })

    // 开始计时
    startTimer()

    // 模拟面试官开场
    setTimeout(() => {
      addDialogue('interviewer', '您好，我是今天的面试官。首先请您做一个简单的自我介绍。')
      addSessionRecord('自我介绍', 'primary')
    }, 2000)

  } catch (error) {
    ElMessage.error('开始面试失败：' + error.message)
  }
}

// 添加对话
const addDialogue = (role, content) => {
  dialogueHistory.value.push({
    role,
    content,
    timestamp: new Date()
  })

  // 自动滚动到底部
  nextTick(() => {
    if (dialogueScroll.value) {
      dialogueScroll.value.scrollTop = dialogueScroll.value.scrollHeight
    }
  })
}

// 添加会话记录
const addSessionRecord = (question, type = 'primary', answer = '', metrics = null) => {
  sessionRecords.value.push({
    time: formatTime(new Date()),
    question,
    type,
    answer,
    metrics
  })
}

// 切换录音状态
const toggleRecording = () => {
  if (!isRecording.value) {
    startRecording()
  } else {
    stopRecording()
  }
}

// 开始录音
const startRecording = async () => {
  try {
    // TODO: 实现真实的录音功能
    isRecording.value = true
    isListening.value = true
    voiceStatus.value = '正在录音...'

    // 添加实时提醒
    addTip('info', '保持适中语速，注意表达清晰')

  } catch {
    ElMessage.error('无法访问麦克风')
  }
}

// 停止录音
const stopRecording = () => {
  isRecording.value = false
  isListening.value = false
  voiceStatus.value = '正在处理...'

  // 模拟处理回答
  setTimeout(() => {
    const answer = '我毕业于XX大学计算机专业，有3年前端开发经验...'
    addDialogue('candidate', answer)

    // 更新会话记录
    if (sessionRecords.value.length > 0) {
      const lastRecord = sessionRecords.value[sessionRecords.value.length - 1]
      lastRecord.answer = answer
      lastRecord.metrics = {
        语速: '适中',
        流畅度: '良好',
        音量: '正常'
      }
    }

    voiceStatus.value = '等待下一个问题...'

    // 模拟面试官继续提问
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }, 1500)
}

// 下一个问题
const nextQuestion = () => {
  const questions = [
    '能介绍一下您最有成就感的项目吗？',
    '您如何看待前端技术的发展趋势？',
    '遇到技术难题时，您通常如何解决？',
    '您对我们公司有什么了解？',
    '您还有什么想问我的吗？'
  ]

  const currentQuestionIndex = sessionRecords.value.length
  if (currentQuestionIndex < questions.length) {
    addDialogue('interviewer', questions[currentQuestionIndex])
    addSessionRecord(questions[currentQuestionIndex], 'primary')
  } else {
    endInterview()
  }
}

// 添加提醒
const addTip = (type, message) => {
  currentTips.value.push({ type, message })
  if (currentTips.value.length > 3) {
    currentTips.value.shift()
  }
}

// 计时器
let timerInterval = null
const startTimer = () => {
  timerInterval = setInterval(() => {
    elapsedTime.value++

    // 时间提醒
    if (remainingTime.value === 300) {
      addTip('warning', '还剩5分钟')
    } else if (remainingTime.value === 60) {
      addTip('warning', '还剩1分钟')
    }

    // 时间到自动结束
    if (elapsedTime.value >= totalTime.value) {
      endInterview()
    }
  }, 1000)
}

// 结束面试
const endInterview = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }

  showEndDialog.value = true

  // TODO: 调用后端API结束面试
  // await apiService.interview.end(interviewId)
}

// 查看报告
const viewReport = () => {
  router.push('/dashboard/interview-performance')
}

// 返回列表
const backToList = () => {
  router.push('/dashboard')
}

// 格式化时间
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

// 清理资源
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.interview-simulation-container {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

/* 开始页面样式 */
.start-section {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
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

.settings-tips {
  margin: 25px 0;
}

.settings-tips ul {
  margin: 0;
  padding-left: 20px;
  line-height: 1.8;
}

.settings-actions {
  text-align: center;
  margin-top: 30px;
}

.start-btn {
  padding: 15px 50px;
  font-size: 1.1rem;
}

/* 面试主界面 */
.interview-main {
  flex: 1;
  display: flex;
  gap: 20px;
}

/* 左侧区域 */
.interview-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-container {
  height: 400px;
  position: relative;
  overflow: hidden;
}

.avatar-canvas {
  width: 100%;
  height: 320px;
}

.interviewer-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: var(--text-primary);
}

.interviewer-info h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.interviewer-info p {
  color: var(--text-secondary);
}

/* 对话区域 */
.dialogue-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.dialogue-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dialogue-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: 300px;
}

.dialogue-item {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.dialogue-item.candidate {
  flex-direction: row-reverse;
}

.dialogue-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-tech);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialogue-bubble {
  max-width: 70%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  position: relative;
}

.dialogue-item.interviewer .dialogue-bubble {
  border-top-left-radius: 0;
}

.dialogue-item.candidate .dialogue-bubble {
  background: var(--gradient-tech);
  border-top-right-radius: 0;
}

.dialogue-bubble p {
  margin: 0;
  line-height: 1.6;
}

.dialogue-time {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 5px;
}

/* 语音控制 */
.voice-control {
  padding: 20px;
  text-align: center;
}

.voice-status {
  margin-bottom: 20px;
}

.voice-wave {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  gap: 3px;
}

.voice-wave span {
  display: inline-block;
  width: 3px;
  height: 20px;
  background: var(--primary-color);
  border-radius: 3px;
  animation: wave 1.2s ease-in-out infinite;
}

.voice-wave span:nth-child(2) { animation-delay: -1.1s; }
.voice-wave span:nth-child(3) { animation-delay: -1.0s; }
.voice-wave span:nth-child(4) { animation-delay: -0.9s; }
.voice-wave span:nth-child(5) { animation-delay: -0.8s; }

@keyframes wave {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

.voice-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-tech);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.voice-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(64, 158, 255, 0.5);
}

.voice-btn.active {
  background: var(--gradient-primary);
  animation: pulse 1.5s ease-in-out infinite;
}

.voice-tips {
  margin-top: 15px;
  color: var(--text-secondary);
}

/* 右侧区域 */
.interview-right {
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 进度卡片 */
.progress-card {
  padding: 20px;
}

.progress-card h4 {
  margin-bottom: 15px;
  color: var(--text-primary);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
  color: var(--text-secondary);
}

/* 会话记录 */
.session-record {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.record-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.record-timeline {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.record-content {
  padding-bottom: 10px;
}

.record-question {
  font-weight: bold;
  margin-bottom: 8px;
}

.record-answer {
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-size: 14px;
}

.record-metrics {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 提醒卡片 */
.reminder-card {
  padding: 20px;
}

.reminder-card h4 {
  margin-bottom: 15px;
  color: var(--text-primary);
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  font-size: 14px;
  animation: slideIn 0.3s ease;
}

.reminder-item.info {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.reminder-item.warning {
  background: rgba(230, 162, 60, 0.1);
  color: var(--warning-color);
}

.reminder-item.success {
  background: rgba(103, 194, 58, 0.1);
  color: var(--secondary-color);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 结束弹窗 */
.end-dialog-content {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .interview-main {
    flex-direction: column;
  }

  .interview-right {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .interview-right > div {
    flex: 1;
    min-width: 300px;
  }
}
</style>
