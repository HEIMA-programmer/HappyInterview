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
            <el-select v-model="settings.position" placeholder="请选择面试岗位" style="width: 100%">
              <el-option label="前端开发" value="frontend" />
              <el-option label="后端开发" value="backend" />
              <el-option label="产品经理" value="product" />
              <el-option label="UI设计师" value="design" />
              <el-option label="数据分析" value="data" />
              <el-option label="算法工程师" value="algorithm" />
            </el-select>
          </el-form-item>

          <el-form-item label="难度等级">
            <el-radio-group v-model="settings.difficulty">
              <el-radio label="junior">初级 - 适合0-2年经验</el-radio>
              <el-radio label="medium">中级 - 适合2-5年经验</el-radio>
              <el-radio label="senior">高级 - 适合5年以上经验</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="面试风格">
            <el-select v-model="settings.interviewStyle" placeholder="选择面试官风格" style="width: 100%">
              <el-option label="温和型 - 亲切友好，鼓励式提问" value="gentle" />
              <el-option label="严肃型 - 正式严谨，注重细节" value="serious" />
              <el-option label="挑战型 - 深入追问，压力测试" value="challenging" />
              <el-option label="随机型 - 系统随机选择风格" value="random" />
            </el-select>
          </el-form-item>

          <el-form-item label="虚拟面试官">
            <div class="avatar-selection">
              <div
                v-for="avatar in avatarOptions"
                :key="avatar.id"
                class="avatar-option"
                :class="{ selected: settings.avatarId === avatar.id }"
                @click="settings.avatarId = avatar.id"
              >
                <el-avatar :size="60" :src="avatar.image" />
                <div class="avatar-info">
                  <h5>{{ avatar.name }}</h5>
                  <p>{{ avatar.description }}</p>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="练习时长">
            <el-slider
              v-model="settings.duration"
              :min="10"
              :max="60"
              :step="5"
              show-input
              :format-tooltip="(val) => `${val}分钟`"
            />
          </el-form-item>

          <el-form-item label="题目类型">
            <el-checkbox-group v-model="settings.questionTypes">
              <el-checkbox label="behavioral">行为面试题</el-checkbox>
              <el-checkbox label="technical">技术面试题</el-checkbox>
              <el-checkbox label="situational">情景面试题</el-checkbox>
              <el-checkbox label="project">项目经验题</el-checkbox>
              <el-checkbox label="stress">压力面试题</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="特殊设置">
            <el-checkbox-group v-model="settings.specialSettings">
              <el-checkbox label="realtime_hints">启用实时提示</el-checkbox>
              <el-checkbox label="expression_analysis">启用表情分析</el-checkbox>
              <el-checkbox label="voice_analysis">启用语音分析</el-checkbox>
              <el-checkbox label="auto_feedback">自动反馈模式</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <div class="settings-actions">
          <button class="start-btn tech-button" @click="startPractice" :disabled="!canStart">
            <el-icon><VideoPlay /></el-icon>
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
          <video ref="videoRef" autoplay muted playsinline></video>
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
            <div class="avatar-3d" ref="avatarContainer"></div>
            <span class="interviewer-name">{{ currentAvatar.name }}</span>
            <span class="interview-style">{{ getStyleName(settings.interviewStyle) }}</span>
          </div>

          <div class="current-question">
            <h3>当前问题：</h3>
            <p>{{ currentQuestion.text }}</p>
            <div class="question-meta">
              <el-tag size="small" type="info">{{ currentQuestion.type }}</el-tag>
              <el-tag size="small" :type="getDifficultyType(currentQuestion.difficulty)">
                {{ currentQuestion.difficulty }}
              </el-tag>
            </div>
          </div>

          <!-- AI助手 -->
          <div v-if="showHint" class="ai-hint animate__animated animate__fadeIn">
            <h4><el-icon><Bulb /></el-icon> AI提示</h4>
            <p>{{ currentQuestion.hint }}</p>
          </div>

          <!-- 实时分析 -->
          <div v-if="settings.specialSettings.includes('realtime_hints') && isRecording" class="realtime-analysis">
            <h4>实时分析</h4>
            <div class="analysis-items">
              <div class="analysis-item" v-if="settings.specialSettings.includes('voice_analysis')">
                <span class="label">语速：</span>
                <span class="value" :class="voiceAnalysis.speed">{{ voiceAnalysis.speedText }}</span>
              </div>
              <div class="analysis-item" v-if="settings.specialSettings.includes('expression_analysis')">
                <span class="label">表情：</span>
                <span class="value" :class="expressionAnalysis.mood">{{ expressionAnalysis.moodText }}</span>
              </div>
            </div>
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
            <div class="feedback-item">
              <strong>优点：</strong>
              <p>{{ currentFeedback.pros }}</p>
            </div>
            <div class="feedback-item">
              <strong>建议：</strong>
              <p>{{ currentFeedback.cons }}</p>
            </div>
            <div class="feedback-item">
              <strong>参考答案：</strong>
              <p>{{ currentFeedback.reference }}</p>
            </div>
          </div>
        </div>
        <div class="feedback-actions">
          <el-button type="primary" @click="nextQuestion">
            下一题
          </el-button>
          <el-button @click="repeatQuestion">
            重新回答
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as THREE from 'three'
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
  interviewStyle: 'gentle',
  avatarId: 1,
  duration: 30,
  questionTypes: ['behavioral', 'technical'],
  specialSettings: ['realtime_hints']
})

// 虚拟面试官选项
const avatarOptions = ref([
  {
    id: 1,
    name: '李面试官',
    description: '亲和力强，善于引导',
    image: '/avatars/interviewer-1.jpg',
    model: '/models/avatar-1.glb'
  },
  {
    id: 2,
    name: '张面试官',
    description: '经验丰富，专业严谨',
    image: '/avatars/interviewer-2.jpg',
    model: '/models/avatar-2.glb'
  },
  {
    id: 3,
    name: '王面试官',
    description: '技术专家，深度挖掘',
    image: '/avatars/interviewer-3.jpg',
    model: '/models/avatar-3.glb'
  }
])

// 视频相关
const videoRef = ref(null)
const avatarContainer = ref(null)
let mediaStream = null
let scene, camera, renderer, avatarMesh

// 题目相关
const currentQuestionIndex = ref(0)
const totalQuestions = ref(5)
const currentQuestion = ref({
  text: '请做一下自我介绍，包括您的教育背景、工作经验和技能特长。',
  hint: '建议按照"个人信息-教育背景-项目经验-技能特长-职业规划"的结构来组织回答，时间控制在2-3分钟。',
  type: 'behavioral',
  difficulty: 'medium'
})
const currentFeedback = ref(null)

// 计时器
const elapsedTime = ref(0)
let timerInterval = null

// 实时分析数据
const voiceAnalysis = ref({
  speed: 'normal',
  speedText: '适中'
})

const expressionAnalysis = ref({
  mood: 'neutral',
  moodText: '自然'
})

// 计算属性
const canStart = computed(() => {
  return settings.value.position &&
         settings.value.questionTypes.length > 0 &&
         settings.value.avatarId
})

const currentAvatar = computed(() => {
  return avatarOptions.value.find(avatar => avatar.id === settings.value.avatarId) || avatarOptions.value[0]
})

// 方法
const getStyleName = (style) => {
  const styleMap = {
    gentle: '温和型',
    serious: '严肃型',
    challenging: '挑战型',
    random: '随机型'
  }
  return styleMap[style] || '温和型'
}

const getDifficultyType = (difficulty) => {
  const difficultyMap = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return difficultyMap[difficulty] || 'info'
}

// 开始练习
const startPractice = async () => {
  try {
    // 检查简历
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

    // TODO: 调用后端API开始练习
    // const response = await apiService.interview.startPractice({
    //   ...settings.value,
    //   type: 'practice'
    // })

    hasStarted.value = true
    startTimer()

    // 初始化3D虚拟人
    nextTick(() => {
      init3DAvatar()
    })

    ElMessage.success('面试练习开始！')

  } catch (error) {
    ElMessage.error('开始练习失败：' + error.message)
  }
}

// 初始化3D虚拟人
const init3DAvatar = () => {
  if (!avatarContainer.value) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

  const container = avatarContainer.value
  const size = Math.min(container.clientWidth, container.clientHeight)
  renderer.setSize(size, size)
  container.appendChild(renderer.domElement)

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(0, 1, 1)
  scene.add(directionalLight)

  // 创建简单的虚拟人模型（实际项目中应该加载3D模型）
  const geometry = new THREE.CapsuleGeometry(0.8, 2, 4, 8)
  const material = new THREE.MeshPhongMaterial({
    color: 0x4a90e2,
    transparent: true,
    opacity: 0.8
  })
  avatarMesh = new THREE.Mesh(geometry, material)
  scene.add(avatarMesh)

  camera.position.set(0, 0, 4)

  // 动画循环
  const animate = () => {
    requestAnimationFrame(animate)

    if (avatarMesh) {
      // 说话时的动画
      if (isRecording.value) {
        avatarMesh.scale.y = 1 + Math.sin(Date.now() * 0.01) * 0.05
        avatarMesh.rotation.y += 0.005
      } else {
        avatarMesh.scale.y = 1
        avatarMesh.rotation.y += 0.002
      }
    }

    renderer.render(scene, camera)
  }
  animate()

  // TODO: 实际项目中使用更先进的3D虚拟人
  // 可以考虑使用 Ready Player Me、MetaHuman 等
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
    ElMessage.success('摄像头已开启')
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

  // 开始实时分析
  if (settings.value.specialSettings.includes('realtime_hints')) {
    startRealtimeAnalysis()
  }

  ElMessage.success('开始录音，请回答问题')
}

const stopRecording = () => {
  isRecording.value = false

  // 停止实时分析
  stopRealtimeAnalysis()

  // 模拟AI分析和反馈
  setTimeout(() => {
    generateFeedback()
  }, 1500)
}

// 实时分析
const startRealtimeAnalysis = () => {
  // 模拟语音分析
  if (settings.value.specialSettings.includes('voice_analysis')) {
    setInterval(() => {
      if (isRecording.value) {
        const speeds = ['slow', 'normal', 'fast']
        const speedTexts = ['偏慢', '适中', '偏快']
        const randomIndex = Math.floor(Math.random() * 3)
        voiceAnalysis.value.speed = speeds[randomIndex]
        voiceAnalysis.value.speedText = speedTexts[randomIndex]
      }
    }, 2000)
  }

  // 模拟表情分析
  if (settings.value.specialSettings.includes('expression_analysis')) {
    setInterval(() => {
      if (isRecording.value) {
        const moods = ['confident', 'neutral', 'nervous']
        const moodTexts = ['自信', '自然', '紧张']
        const randomIndex = Math.floor(Math.random() * 3)
        expressionAnalysis.value.mood = moods[randomIndex]
        expressionAnalysis.value.moodText = moodTexts[randomIndex]
      }
    }, 3000)
  }
}

const stopRealtimeAnalysis = () => {
  // 重置分析状态
  voiceAnalysis.value = { speed: 'normal', speedText: '适中' }
  expressionAnalysis.value = { mood: 'neutral', moodText: '自然' }
}

// 生成反馈
const generateFeedback = () => {
  // 根据面试风格调整反馈
  const feedbacks = {
    gentle: {
      score: 4,
      pros: '回答结构清晰，表达流畅，能够很好地展示自己的优势。',
      cons: '可以尝试增加一些具体的案例来支撑观点，这样会更有说服力。',
      reference: '建议按照STAR法则组织回答：Situation(情境)、Task(任务)、Action(行动)、Result(结果)。'
    },
    serious: {
      score: 3.5,
      pros: '回答内容基本完整，覆盖了问题的关键点。',
      cons: '表达的逻辑性需要加强，建议先理清思路再回答。某些技术细节需要更深入。',
      reference: '应该提供更多量化的数据和具体的技术实现细节，展示专业能力。'
    },
    challenging: {
      score: 3,
      pros: '在压力下能够保持基本的回答结构。',
      cons: '面对追问时略显紧张，回答的深度不够。需要提升在高压环境下的表现能力。',
      reference: '建议多练习压力面试场景，提前准备可能的追问，保持冷静和自信。'
    }
  }

  const styleFeedback = feedbacks[settings.value.interviewStyle] || feedbacks.gentle
  currentFeedback.value = styleFeedback

  // 自动反馈模式
  if (settings.value.specialSettings.includes('auto_feedback')) {
    setTimeout(() => {
      nextQuestion()
    }, 5000)
  }
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

// 重新回答
const repeatQuestion = () => {
  currentFeedback.value = null
  hintUsed.value = false
  showHint.value = false
  ElMessage.info('可以重新回答当前问题')
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    // TODO: 从题库获取下一题
    // currentQuestion.value = await apiService.question.getNext(...)

    // 模拟切换题目
    const questions = [
      {
        text: '请做一下自我介绍',
        hint: '按照个人信息-教育背景-项目经验的结构回答',
        type: 'behavioral',
        difficulty: 'medium'
      },
      {
        text: '说说您对Vue3的理解',
        hint: '可以从响应式原理、组合式API、性能优化等角度回答',
        type: 'technical',
        difficulty: 'medium'
      },
      {
        text: '介绍一个您负责的项目',
        hint: '使用STAR法则，重点说明您的贡献和成果',
        type: 'project',
        difficulty: 'medium'
      },
      {
        text: '如何处理团队中的分歧？',
        hint: '展示您的沟通协调能力和解决问题的思路',
        type: 'situational',
        difficulty: 'medium'
      },
      {
        text: '您有什么想问我的吗？',
        hint: '可以询问公司文化、团队情况、技术挑战等',
        type: 'behavioral',
        difficulty: 'easy'
      }
    ]

    currentQuestion.value = questions[currentQuestionIndex.value]
    currentFeedback.value = null
    showHint.value = false
    hintUsed.value = false

    ElMessage.success('下一题已准备好')
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
    if (renderer) {
      renderer.dispose()
    }

    ElMessage.success('练习结束，正在生成报告...')

    // TODO: 保存练习数据到后端
    // await apiService.interview.savePracticeResult(...)

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
  if (renderer) {
    renderer.dispose()
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

.avatar-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.avatar-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-option:hover {
  background: rgba(255, 255, 255, 0.08);
}

.avatar-option.selected {
  border-color: var(--primary-color);
  background: rgba(64, 158, 255, 0.1);
}

.avatar-info h5 {
  color: var(--text-primary);
  margin: 0 0 5px 0;
}

.avatar-info p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 13px;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.interviewer-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.avatar-3d {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}

.interviewer-name {
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.interview-style {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.current-question h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.current-question p {
  font-size: 1.1rem;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 10px;
}

.question-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
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

.realtime-analysis {
  margin-top: 20px;
  padding: 15px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(64, 158, 255, 0.3);
}

.realtime-analysis h4 {
  color: var(--primary-color);
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.analysis-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.analysis-item .label {
  color: var(--text-secondary);
}

.analysis-item .value {
  font-weight: 600;
}

.analysis-item .value.normal,
.analysis-item .value.neutral {
  color: var(--success-color);
}

.analysis-item .value.fast,
.analysis-item .value.slow,
.analysis-item .value.nervous {
  color: var(--warning-color);
}

.analysis-item .value.confident {
  color: var(--primary-color);
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

.feedback-item {
  margin-bottom: 20px;
}

.feedback-item strong {
  color: var(--primary-color);
  display: block;
  margin-bottom: 8px;
}

.feedback-item p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.feedback-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
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

  .avatar-selection {
    grid-template-columns: 1fr;
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

  .feedback-actions {
    flex-direction: column;
  }
}
</style>
