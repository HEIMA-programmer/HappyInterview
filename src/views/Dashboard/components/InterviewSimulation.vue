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
            <el-select v-model="settings.company" placeholder="选择模拟的公司类型" style="width: 100%">
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
            <el-select v-model="settings.position" placeholder="请选择面试岗位" style="width: 100%">
              <el-option label="前端开发" value="frontend" />
              <el-option label="后端开发" value="backend" />
              <el-option label="算法工程师" value="algorithm" />
              <el-option label="产品经理" value="product" />
              <el-option label="UI设计师" value="design" />
              <el-option label="数据分析师" value="data" />
            </el-select>
          </el-form-item>

          <el-form-item label="面试轮次">
            <el-radio-group v-model="settings.round">
              <el-radio label="first">初试 - 基础能力考察</el-radio>
              <el-radio label="second">复试 - 深度技术面试</el-radio>
              <el-radio label="final">终面 - 综合素质评估</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="面试风格">
            <el-select v-model="settings.interviewStyle" placeholder="选择面试风格" style="width: 100%">
              <el-option label="标准模式 - 按公司惯例进行" value="standard" />
              <el-option label="压力模式 - 高强度快节奏" value="stress" />
              <el-option label="友好模式 - 轻松愉快氛围" value="friendly" />
              <el-option label="技术深挖 - 专注技术细节" value="technical" />
              <el-option label="行为面试 - 重点考察软技能" value="behavioral" />
            </el-select>
          </el-form-item>

          <el-form-item label="面试官配置">
            <div class="interviewer-config">
              <div
                v-for="interviewer in interviewerOptions"
                :key="interviewer.id"
                class="interviewer-option"
                :class="{ selected: settings.interviewerId === interviewer.id }"
                @click="settings.interviewerId = interviewer.id"
              >
                <el-avatar :size="50" :src="interviewer.avatar" />
                <div class="interviewer-details">
                  <h5>{{ interviewer.name }}</h5>
                  <p>{{ interviewer.role }}</p>
                  <div class="interviewer-tags">
                    <el-tag
                      v-for="tag in interviewer.specialties"
                      :key="tag"
                      size="small"
                      type="info"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="面试时长">
            <el-select v-model="settings.duration" style="width: 100%">
              <el-option :label="'30分钟 - 快速评估'" :value="30" />
              <el-option :label="'45分钟 - 标准面试'" :value="45" />
              <el-option :label="'60分钟 - 深度面试'" :value="60" />
              <el-option :label="'90分钟 - 全面评估'" :value="90" />
            </el-select>
          </el-form-item>

          <el-form-item label="评估重点">
            <el-checkbox-group v-model="settings.evaluationFocus">
              <el-checkbox label="technical">技术能力</el-checkbox>
              <el-checkbox label="communication">沟通表达</el-checkbox>
              <el-checkbox label="problem_solving">问题解决</el-checkbox>
              <el-checkbox label="leadership">领导力</el-checkbox>
              <el-checkbox label="cultural_fit">文化匹配</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <div class="simulation-warning">
          <el-alert type="warning" :closable="false" show-icon>
            <template #title>
              模拟模式注意事项
            </template>
            <template #default>
              <ul>
                <li>面试过程不可暂停，请确保有充足时间和良好环境</li>
                <li>全程录音录像，用于后续详细分析</li>
                <li>系统将严格按照真实面试标准进行评估</li>
                <li>结束后生成专业的面试评测报告</li>
              </ul>
            </template>
          </el-alert>
        </div>

        <div class="settings-actions">
          <button
            class="start-btn tech-button"
            @click="startSimulation"
            :disabled="!canStart"
          >
            <el-icon><VideoPlay /></el-icon>
            开始模拟面试
          </button>
        </div>
      </div>
    </div>

    <!-- 面试进行中 -->
    <div v-else class="interview-main">
      <!-- 顶部状态栏 -->
      <div class="status-bar glass-card">
        <div class="interview-info">
          <el-tag type="danger">模拟面试</el-tag>
          <span class="company-info">{{ getCompanyName(settings.company) }} - {{ settings.position }}</span>
          <span class="round-info">{{ getRoundName(settings.round) }}</span>
        </div>

        <div class="time-display">
          <el-icon><Timer /></el-icon>
          <span class="time-text">{{ formatTime(elapsedTime) }} / {{ formatTime(totalTime) }}</span>
          <el-progress
            :percentage="timeProgress"
            :color="getTimeColor(timeProgress)"
            :show-text="false"
            style="width: 200px; margin-left: 15px;"
          />
        </div>

        <div class="emergency-controls">
          <el-button type="danger" size="small" @click="emergencyExit">
            紧急退出
          </el-button>
        </div>
      </div>

      <!-- 主要面试区域 -->
      <div class="interview-area">
        <!-- 左侧：虚拟面试官 -->
        <div class="interviewer-section">
          <!-- 3D虚拟人容器 -->
          <div class="virtual-interviewer glass-card">
            <div ref="virtualHumanContainer" class="virtual-human-canvas"></div>
            <div class="interviewer-info-bar">
              <div class="interviewer-status">
                <div class="status-indicator" :class="{ speaking: isSpeaking, listening: isListening }"></div>
                <span>{{ currentInterviewer.name }}</span>
              </div>
              <div class="interview-phase">
                <el-tag size="small" :type="getPhaseType(currentPhase)">
                  {{ getPhaseTitle(currentPhase) }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 当前问题显示 -->
          <div class="question-display glass-card">
            <div class="question-header">
              <el-icon><QuestionFilled /></el-icon>
              <span>面试问题 {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</span>
            </div>
            <div class="question-content">
              <p class="question-text">{{ currentQuestion.text }}</p>
              <div class="question-context" v-if="currentQuestion.context">
                <el-tag size="small" type="info">{{ currentQuestion.context }}</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：用户视频和控制 -->
        <div class="candidate-section">
          <!-- 用户视频 -->
          <div class="user-video-container glass-card">
            <video ref="userVideoRef" autoplay muted playsinline></video>
            <div v-if="!cameraReady" class="video-setup">
              <el-icon :size="60"><VideoCamera /></el-icon>
              <p>请开启摄像头和麦克风</p>
              <el-button type="primary" @click="setupCamera">
                设置设备
              </el-button>
            </div>

            <!-- 录制状态指示 -->
            <div v-if="isRecording" class="recording-indicator">
              <div class="rec-dot"></div>
              <span>REC</span>
            </div>
          </div>

          <!-- 回答控制区 -->
          <div class="answer-control glass-card">
            <div v-if="!isAnswering" class="waiting-state">
              <h4>{{ waitingMessage }}</h4>
              <p>{{ waitingDescription }}</p>
              <el-button
                v-if="canStartAnswer"
                type="primary"
                size="large"
                @click="startAnswer"
              >
                <el-icon><Microphone /></el-icon>
                开始回答
              </el-button>
            </div>

            <div v-else class="answering-state">
              <div class="answer-timer">
                <el-progress
                  type="circle"
                  :percentage="answerProgress"
                  :width="80"
                  :stroke-width="6"
                  :color="getAnswerProgressColor(answerProgress)"
                >
                  <template #default="{ percentage }">
                    <span class="timer-text">{{ formatTime(answerTime) }}</span>
                  </template>
                </el-progress>
              </div>

              <div class="answer-controls">
                <el-button
                  type="success"
                  @click="finishAnswer"
                  :disabled="answerTime < 10"
                >
                  <el-icon><Check /></el-icon>
                  完成回答
                </el-button>
                <p class="answer-hint">
                  {{ answerTime < 10 ? '请至少回答10秒' : '点击完成回答或继续表达' }}
                </p>
              </div>
            </div>
          </div>

          <!-- 实时反馈 -->
          <div class="realtime-feedback glass-card">
            <h4>实时状态</h4>
            <div class="feedback-items">
              <div class="feedback-item">
                <span class="label">语音音量：</span>
                <el-progress
                  :percentage="audioLevel"
                  :show-text="false"
                  :stroke-width="8"
                  :color="audioLevel > 20 ? '#67c23a' : '#f56c6c'"
                />
              </div>
              <div class="feedback-item">
                <span class="label">表情状态：</span>
                <span class="status-text" :class="emotionAnalysis.type">
                  {{ emotionAnalysis.text }}
                </span>
              </div>
              <div class="feedback-item">
                <span class="label">眼神接触：</span>
                <span class="status-text" :class="eyeContactStatus.type">
                  {{ eyeContactStatus.text }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试进度条 -->
      <div class="progress-tracker glass-card">
        <div class="progress-steps">
          <div
            v-for="(phase, index) in interviewPhases"
            :key="phase.id"
            class="progress-step"
            :class="{
              completed: index < currentPhaseIndex,
              active: index === currentPhaseIndex,
              upcoming: index > currentPhaseIndex
            }"
          >
            <div class="step-circle">
              <el-icon v-if="index < currentPhaseIndex"><Check /></el-icon>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ phase.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试结束弹窗 -->
    <el-dialog
      v-model="showEndDialog"
      title="面试已结束"
      width="600px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="end-dialog-content">
        <el-result icon="success">
          <template #title>
            <p>恭喜您完成本次模拟面试！</p>
          </template>
          <template #sub-title>
            <div class="interview-summary">
              <p>面试时长：{{ formatTime(elapsedTime) }}</p>
              <p>回答问题：{{ answeredQuestions }}/{{ totalQuestions }} 个</p>
              <p>AI正在为您生成详细的面试评测报告...</p>
            </div>
          </template>
          <template #extra>
            <div class="end-actions">
              <el-button type="primary" @click="viewReport" :loading="generatingReport">
                {{ generatingReport ? '生成报告中...' : '查看报告' }}
              </el-button>
              <el-button @click="backToSettings">
                重新设置
              </el-button>
              <el-button @click="backToList">
                返回主页
              </el-button>
            </div>
          </template>
        </el-result>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as THREE from 'three'
import {
  VideoPlay, Timer, VideoCamera, QuestionFilled,
  Microphone, Check
} from '@element-plus/icons-vue'

const router = useRouter()

// 状态管理
const hasStarted = ref(false)
const isRecording = ref(false)
const isAnswering = ref(false)
const isSpeaking = ref(false)
const isListening = ref(false)
const cameraReady = ref(false)
const showEndDialog = ref(false)
const generatingReport = ref(false)

// 面试设置
const settings = ref({
  company: 'tech',
  position: 'frontend',
  round: 'first',
  interviewStyle: 'standard',
  interviewerId: 1,
  duration: 45,
  evaluationFocus: ['technical', 'communication']
})

// 面试官选项
const interviewerOptions = ref([
  {
    id: 1,
    name: '张技术总监',
    role: '技术总监',
    avatar: '/avatars/tech-director.jpg',
    specialties: ['技术深度', '架构设计', '团队管理'],
    model: '/models/tech-director.glb'
  },
  {
    id: 2,
    name: '李HR经理',
    role: 'HR经理',
    avatar: '/avatars/hr-manager.jpg',
    specialties: ['行为面试', '文化匹配', '综合素质'],
    model: '/models/hr-manager.glb'
  },
  {
    id: 3,
    name: '王产品总监',
    role: '产品总监',
    avatar: '/avatars/product-director.jpg',
    specialties: ['产品思维', '用户体验', '商业逻辑'],
    model: '/models/product-director.glb'
  }
])

// 面试阶段
const interviewPhases = ref([
  { id: 'intro', title: '开场介绍' },
  { id: 'self', title: '自我介绍' },
  { id: 'technical', title: '技术问答' },
  { id: 'project', title: '项目经历' },
  { id: 'behavioral', title: '行为面试' },
  { id: 'questions', title: '提问环节' }
])

// 时间相关
const elapsedTime = ref(0)
const answerTime = ref(0)
const totalTime = computed(() => settings.value.duration * 60)
const timeProgress = computed(() => Math.round((elapsedTime.value / totalTime.value) * 100))

// 面试进度
const currentPhaseIndex = ref(0)
const currentPhase = computed(() => interviewPhases.value[currentPhaseIndex.value]?.id || 'intro')
const currentQuestionIndex = ref(0)
const totalQuestions = ref(8)
const answeredQuestions = ref(0)

// 当前问题
const currentQuestion = ref({
  text: '您好，欢迎参加我们的面试。请先做一个简单的自我介绍。',
  context: '请在2-3分钟内完成',
  type: 'self-introduction',
  expectedDuration: 180
})

// 当前面试官
const currentInterviewer = computed(() => {
  return interviewerOptions.value.find(i => i.id === settings.value.interviewerId) || interviewerOptions.value[0]
})

// 实时状态
const audioLevel = ref(0)
const emotionAnalysis = ref({ type: 'neutral', text: '自然' })
const eyeContactStatus = ref({ type: 'good', text: '良好' })

// 等待状态
const waitingMessage = ref('请认真听题')
const waitingDescription = ref('面试官正在提问，请仔细听完问题后开始回答')
const canStartAnswer = ref(false)

// Three.js相关
let scene, camera, renderer, avatarMesh
const virtualHumanContainer = ref(null)
const userVideoRef = ref(null)
let mediaStream = null
let timerInterval = null
let answerTimer = null

// 计算属性
const canStart = computed(() => {
  return settings.value.company &&
         settings.value.position &&
         settings.value.interviewerId &&
         settings.value.evaluationFocus.length > 0
})

const answerProgress = computed(() => {
  const expectedDuration = currentQuestion.value.expectedDuration || 120
  return Math.min(100, (answerTime.value / expectedDuration) * 100)
})

// 方法
const getCompanyName = (type) => {
  const names = {
    tech: '科技有限公司',
    foreign: '外资企业',
    state: '国有企业',
    startup: '创业公司'
  }
  return names[type] || '公司'
}

const getRoundName = (round) => {
  const names = {
    first: '初试',
    second: '复试',
    final: '终面'
  }
  return names[round] || '面试'
}

const getPhaseType = (phase) => {
  const types = {
    intro: 'info',
    self: 'primary',
    technical: 'warning',
    project: 'success',
    behavioral: 'danger',
    questions: 'info'
  }
  return types[phase] || 'info'
}

const getPhaseTitle = (phase) => {
  const titles = {
    intro: '开场阶段',
    self: '自我介绍',
    technical: '技术问答',
    project: '项目经历',
    behavioral: '行为面试',
    questions: '提问环节'
  }
  return titles[phase] || '面试中'
}

const getTimeColor = (percentage) => {
  if (percentage >= 90) return '#f56c6c'
  if (percentage >= 70) return '#e6a23c'
  return '#409eff'
}

const getAnswerProgressColor = (percentage) => {
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 50) return '#409eff'
  return '#e6a23c'
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 开始模拟面试
const startSimulation = async () => {
  try {
    // TODO: 调用后端API开始面试
    // const response = await apiService.interview.startSimulation({
    //   type: 'simulation',
    //   ...settings.value
    // })

    hasStarted.value = true

    // 初始化3D虚拟人
    nextTick(() => {
      initVirtualHuman()
      setupCamera()
    })

    // 开始计时
    startTimer()

    // 模拟面试开始流程
    setTimeout(() => {
      startInterviewFlow()
    }, 2000)

    ElMessage.success('模拟面试开始！')

  } catch (error) {
    ElMessage.error('开始面试失败：' + error.message)
  }
}

// 初始化虚拟人
const initVirtualHuman = () => {
  if (!virtualHumanContainer.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0e27)

  camera = new THREE.PerspectiveCamera(
    45,
    virtualHumanContainer.value.clientWidth / virtualHumanContainer.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(
    virtualHumanContainer.value.clientWidth,
    virtualHumanContainer.value.clientHeight
  )
  virtualHumanContainer.value.appendChild(renderer.domElement)

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(0, 1, 1)
  scene.add(directionalLight)

  // 创建3D虚拟人模型 (简化版本)
  const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8)
  const material = new THREE.MeshPhongMaterial({ color: 0x4a90e2 })
  avatarMesh = new THREE.Mesh(geometry, material)
  scene.add(avatarMesh)

  // 动画循环
  animate()
}

const animate = () => {
  requestAnimationFrame(animate)

  if (avatarMesh) {
    avatarMesh.rotation.y += 0.005
    if (isSpeaking.value) {
      avatarMesh.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.05
    }
  }

  renderer?.render(scene, camera)
}

// 设置摄像头
const setupCamera = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    if (userVideoRef.value) {
      userVideoRef.value.srcObject = mediaStream
    }

    cameraReady.value = true
    isRecording.value = true

    // 开始音频监测
    startAudioMonitoring()

    ElMessage.success('设备设置完成')
  } catch (error) {
    ElMessage.error('无法访问摄像头或麦克风')
    console.error('Media error:', error)
  }
}

// 开始面试流程
const startInterviewFlow = () => {
  isSpeaking.value = true
  waitingMessage.value = '面试官正在介绍'
  waitingDescription.value = '欢迎参加我们的面试，请认真听完介绍'

  // 模拟面试官说话
  setTimeout(() => {
    isSpeaking.value = false
    isListening.value = true
    waitingMessage.value = '请开始自我介绍'
    waitingDescription.value = '请在2-3分钟内简要介绍您的背景和经历'
    canStartAnswer.value = true
  }, 5000)
}

// 开始回答
const startAnswer = () => {
  isAnswering.value = true
  answerTime.value = 0
  canStartAnswer.value = false

  // 开始答题计时
  answerTimer = setInterval(() => {
    answerTime.value++
  }, 1000)

  // 开始实时分析
  startRealtimeAnalysis()

  ElMessage.success('开始回答，请自然表达')
}

// 完成回答
const finishAnswer = () => {
  isAnswering.value = false
  answeredQuestions.value++

  // 停止计时
  if (answerTimer) {
    clearInterval(answerTimer)
    answerTimer = null
  }

  // 停止实时分析
  stopRealtimeAnalysis()

  // 切换到下一题
  setTimeout(() => {
    nextQuestion()
  }, 2000)
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++

    // 更新面试阶段
    if (currentQuestionIndex.value <= 1) {
      currentPhaseIndex.value = 1
    } else if (currentQuestionIndex.value <= 3) {
      currentPhaseIndex.value = 2
    } else if (currentQuestionIndex.value <= 5) {
      currentPhaseIndex.value = 3
    } else if (currentQuestionIndex.value <= 6) {
      currentPhaseIndex.value = 4
    } else {
      currentPhaseIndex.value = 5
    }

    // 模拟问题库
    const questions = [
      {
        text: '您好，欢迎参加面试。请先做一个自我介绍。',
        context: '请在2-3分钟内完成',
        type: 'self-introduction',
        expectedDuration: 180
      },
      {
        text: '请介绍一下您最近参与的一个项目。',
        context: '重点说明您的贡献和收获',
        type: 'project',
        expectedDuration: 240
      },
      {
        text: '您如何理解前端性能优化？',
        context: '请从具体技术方案角度回答',
        type: 'technical',
        expectedDuration: 180
      },
      {
        text: '遇到技术难题时，您的解决思路是什么？',
        context: '请结合具体案例说明',
        type: 'problem-solving',
        expectedDuration: 150
      },
      {
        text: '您如何处理工作中的分歧和冲突？',
        context: '请描述具体情况和处理方式',
        type: 'behavioral',
        expectedDuration: 120
      },
      {
        text: '您对我们公司的了解有多少？',
        context: '请谈谈您的看法和期望',
        type: 'company',
        expectedDuration: 120
      },
      {
        text: '您有什么想问我的吗？',
        context: '这是展示您深度思考的机会',
        type: 'questions',
        expectedDuration: 180
      }
    ]

    currentQuestion.value = questions[currentQuestionIndex.value] || questions[0]

    // 模拟面试官提问
    isSpeaking.value = true
    waitingMessage.value = '面试官正在提问'
    waitingDescription.value = '请认真听题，准备回答'
    canStartAnswer.value = false

    setTimeout(() => {
      isSpeaking.value = false
      isListening.value = true
      waitingMessage.value = '请开始回答'
      waitingDescription.value = currentQuestion.value.context
      canStartAnswer.value = true
    }, 3000)

  } else {
    endInterview()
  }
}

// 实时分析
const startRealtimeAnalysis = () => {
  // 模拟表情分析
  setInterval(() => {
    if (isAnswering.value) {
      const emotions = [
        { type: 'confident', text: '自信' },
        { type: 'neutral', text: '自然' },
        { type: 'nervous', text: '紧张' }
      ]
      emotionAnalysis.value = emotions[Math.floor(Math.random() * emotions.length)]
    }
  }, 2000)

  // 模拟眼神接触检测
  setInterval(() => {
    if (isAnswering.value) {
      const eyeStates = [
        { type: 'good', text: '良好' },
        { type: 'average', text: '一般' },
        { type: 'poor', text: '较少' }
      ]
      eyeContactStatus.value = eyeStates[Math.floor(Math.random() * eyeStates.length)]
    }
  }, 3000)
}

const stopRealtimeAnalysis = () => {
  emotionAnalysis.value = { type: 'neutral', text: '自然' }
  eyeContactStatus.value = { type: 'good', text: '良好' }
}

// 音频监测
const startAudioMonitoring = () => {
  // 模拟音频电平
  setInterval(() => {
    if (isAnswering.value) {
      audioLevel.value = Math.random() * 100
    } else {
      audioLevel.value = Math.random() * 20
    }
  }, 100)
}

// 计时器
const startTimer = () => {
  timerInterval = setInterval(() => {
    elapsedTime.value++

    // 时间到自动结束
    if (elapsedTime.value >= totalTime.value) {
      endInterview()
    }
  }, 1000)
}

// 紧急退出
const emergencyExit = async () => {
  const confirm = await ElMessageBox.confirm(
    '确定要紧急退出面试吗？这将结束当前面试并生成部分报告。',
    '紧急退出',
    {
      confirmButtonText: '确定退出',
      cancelButtonText: '继续面试',
      type: 'warning'
    }
  ).catch(() => false)

  if (confirm) {
    endInterview(true)
  }
}

// 结束面试
const endInterview = (isEmergency = false) => {
  // 清理资源
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  if (answerTimer) {
    clearInterval(answerTimer)
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }

  showEndDialog.value = true

  if (!isEmergency) {
    ElMessage.success('面试已完成')
  } else {
    ElMessage.warning('面试已中断')
  }

  // 模拟生成报告
  generatingReport.value = true
  setTimeout(() => {
    generatingReport.value = false
  }, 3000)
}

// 查看报告
const viewReport = () => {
  // TODO: 保存面试数据并跳转到报告页面
  // await apiService.interview.saveResult(...)
  router.push('/dashboard/interview-performance')
}

// 重新设置
const backToSettings = () => {
  hasStarted.value = false
  showEndDialog.value = false
  elapsedTime.value = 0
  currentQuestionIndex.value = 0
  currentPhaseIndex.value = 0
  answeredQuestions.value = 0
}

// 返回主页
const backToList = () => {
  router.push('/dashboard')
}

// 生命周期
onUnmounted(() => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  if (answerTimer) {
    clearInterval(answerTimer)
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
  max-width: 900px;
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

.interviewer-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.interviewer-option {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interviewer-option:hover {
  background: rgba(255, 255, 255, 0.08);
}

.interviewer-option.selected {
  border-color: var(--primary-color);
  background: rgba(64, 158, 255, 0.1);
}

.interviewer-details h5 {
  color: var(--text-primary);
  margin: 0 0 5px 0;
}

.interviewer-details p {
  color: var(--text-secondary);
  margin: 0 0 10px 0;
  font-size: 13px;
}

.interviewer-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.simulation-warning {
  margin: 25px 0;
}

.simulation-warning ul {
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
  background: var(--gradient-tech);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 面试主界面 */
.interview-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
}

.interview-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.company-info,
.round-info {
  color: var(--text-secondary);
  font-size: 14px;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
}

.time-text {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
}

/* 面试区域 */
.interview-area {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 面试官区域 */
.interviewer-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.virtual-interviewer {
  flex: 1;
  position: relative;
  min-height: 300px;
}

.virtual-human-canvas {
  width: 100%;
  height: calc(100% - 60px);
}

.interviewer-info-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.interviewer-status {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
  transition: all 0.3s ease;
}

.status-indicator.speaking {
  background: #67c23a;
  animation: pulse 1s ease-in-out infinite;
}

.status-indicator.listening {
  background: #409eff;
}

.question-display {
  padding: 20px;
  min-height: 120px;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  color: var(--text-secondary);
  font-size: 14px;
}

.question-text {
  font-size: 1.1rem;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 10px;
}

.question-context {
  margin-top: 10px;
}

/* 候选人区域 */
.candidate-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-video-container {
  flex: 1;
  position: relative;
  min-height: 250px;
}

.user-video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.video-setup {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.video-setup p {
  margin: 15px 0;
}

.recording-indicator {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(245, 108, 108, 0.9);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.rec-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

.answer-control {
  padding: 20px;
  text-align: center;
}

.waiting-state h4 {
  color: var(--text-primary);
  margin-bottom: 10px;
}

.waiting-state p {
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.answering-state {
  display: flex;
  align-items: center;
  gap: 30px;
}

.answer-timer {
  flex-shrink: 0;
}

.timer-text {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-primary);
}

.answer-controls {
  flex: 1;
}

.answer-hint {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

.realtime-feedback {
  padding: 15px;
}

.realtime-feedback h4 {
  color: var(--text-primary);
  margin-bottom: 15px;
  font-size: 1rem;
}

.feedback-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feedback-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.feedback-item .label {
  width: 70px;
  color: var(--text-secondary);
}

.status-text {
  font-weight: 600;
}

.status-text.confident,
.status-text.good {
  color: #67c23a;
}

.status-text.neutral,
.status-text.average {
  color: #409eff;
}

.status-text.nervous,
.status-text.poor {
  color: #f56c6c;
}

/* 进度追踪 */
.progress-tracker {
  padding: 20px;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.progress-step.active {
  opacity: 1;
  color: var(--primary-color);
}

.progress-step.completed {
  opacity: 1;
  color: var(--success-color);
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.progress-step.active .step-circle {
  background: var(--primary-color);
  color: white;
}

.progress-step.completed .step-circle {
  background: var(--success-color);
  color: white;
}

.step-label {
  font-size: 12px;
  text-align: center;
}

/* 结束对话框 */
.end-dialog-content {
  text-align: center;
}

.interview-summary {
  margin: 20px 0;
}

.interview-summary p {
  margin: 8px 0;
  color: var(--text-secondary);
}

.end-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .interview-area {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .answering-state {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .status-bar {
    flex-wrap: wrap;
    gap: 15px;
  }

  .time-display {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .progress-steps {
    flex-wrap: wrap;
    gap: 20px;
  }

  .interviewer-config {
    grid-template-columns: 1fr;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}
</style>
