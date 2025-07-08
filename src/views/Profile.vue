<template>
  <div class="profile-container">
    <div class="profile-wrapper">
      <!-- 企鹅助手 -->
      <div class="penguin-assistant" :class="penguinState">
        <div class="penguin-container">
          <div class="penguin" ref="penguinRef">
            <!-- 企鹅身体 -->
            <div class="penguin-body">
              <div class="penguin-belly"></div>
            </div>
            <!-- 企鹅眼睛 -->
            <div class="penguin-eyes">
              <div class="eye left-eye" :class="{ closed: penguinState === 'shy' }">
                <div class="pupil"></div>
              </div>
              <div class="eye right-eye" :class="{ closed: penguinState === 'shy' }">
                <div class="pupil"></div>
              </div>
            </div>
            <!-- 企鹅翅膀 -->
            <div class="penguin-wings">
              <div class="wing left-wing" :class="{ covering: penguinState === 'shy' }"></div>
              <div class="wing right-wing" :class="{ covering: penguinState === 'shy' }"></div>
            </div>
            <!-- 企鹅嘴巴 -->
            <div class="penguin-beak" :class="{ smile: penguinState === 'happy' }"></div>
            <!-- 企鹅脚 -->
            <div class="penguin-feet">
              <div class="foot left-foot"></div>
              <div class="foot right-foot"></div>
            </div>
          </div>
          <!-- 对话气泡 -->
          <div class="speech-bubble" v-if="penguinMessage">
            <p>{{ penguinMessage }}</p>
          </div>
        </div>
      </div>

      <!-- 资料填写卡片 -->
      <div class="profile-card glass-card animate__animated animate__fadeIn">
        <!-- 进度条 -->
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth }"></div>
          <div class="progress-steps">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="step"
              :class="{
                'active': currentStep >= index + 1,
                'current': currentStep === index + 1
              }"
            >
              <div class="step-number">
                <el-icon v-if="currentStep > index + 1"><CircleCheck /></el-icon>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="step-label">{{ step }}</div>
            </div>
          </div>
        </div>

        <!-- 标题 -->
        <div class="profile-header">
          <h2 class="profile-title tech-title">完善个人信息</h2>
          <p class="profile-subtitle">让AI更了解你，提供个性化的面试指导</p>
        </div>

        <!-- 表单区域 -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="profile-form"
          label-position="top"
        >
          <!-- 步骤1：基本信息 -->
          <div v-if="currentStep === 1" class="form-step animate__animated animate__fadeIn">
            <el-form-item label="年龄" prop="age">
              <el-input-number
                v-model="formData.age"
                :min="18"
                :max="60"
                placeholder="请输入年龄"
                style="width: 100%"
                @focus="setPenguinState('thinking')"
                @blur="setPenguinState('idle')"
              />
            </el-form-item>

            <el-form-item label="毕业年份" prop="graduationYear">
              <el-date-picker
                v-model="formData.graduationYear"
                type="year"
                placeholder="选择毕业年份"
                format="YYYY"
                value-format="YYYY"
                style="width: 100%"
                @focus="setPenguinState('thinking')"
                @blur="setPenguinState('idle')"
              />
            </el-form-item>
          </div>

          <!-- 步骤2：教育背景 -->
          <div v-if="currentStep === 2" class="form-step animate__animated animate__fadeIn">
            <el-form-item label="学历" prop="education">
              <el-select
                v-model="formData.education"
                placeholder="请选择学历"
                style="width: 100%"
                @focus="setPenguinState('curious')"
                @blur="setPenguinState('idle')"
              >
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
            </el-form-item>

            <el-form-item label="院校" prop="school">
              <el-input
                v-model="formData.school"
                placeholder="请输入院校名称"
                @focus="setPenguinState('thinking')"
                @blur="setPenguinState('idle')"
              >
                <template #prefix>
                  <el-icon><School /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 步骤3：专业信息 -->
          <div v-if="currentStep === 3" class="form-step animate__animated animate__fadeIn">
            <el-form-item label="专业类别" prop="majorCategory">
              <el-select
                v-model="formData.majorCategory"
                placeholder="请选择专业类别"
                @change="handleMajorCategoryChange"
                style="width: 100%"
                @focus="setPenguinState('curious')"
                @blur="setPenguinState('idle')"
              >
                <el-option label="计算机类" value="computer" />
                <el-option label="电子信息类" value="electronic" />
                <el-option label="经济管理类" value="economics" />
                <el-option label="文学类" value="literature" />
                <el-option label="理工类" value="science" />
                <el-option label="医学类" value="medical" />
                <el-option label="艺术类" value="art" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>

            <el-form-item label="具体专业" prop="major">
              <el-select
                v-model="formData.major"
                placeholder="请选择具体专业"
                filterable
                allow-create
                style="width: 100%"
                @focus="setPenguinState('curious')"
                @blur="setPenguinState('idle')"
              >
                <el-option
                  v-for="major in availableMajors"
                  :key="major"
                  :label="major"
                  :value="major"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="意向岗位" prop="targetPosition">
              <el-checkbox-group v-model="formData.targetPosition">
                <el-checkbox
                  v-for="position in positionOptions"
                  :key="position.value"
                  :label="position.value"
                  @change="() => setPenguinState('thinking')"
                >
                  {{ position.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>

        <!-- 按钮区域 -->
        <div class="button-group">
          <el-button
            v-if="currentStep > 1"
            @click="previousStep"
            size="large"
          >
            上一步
          </el-button>
          <button
            v-if="currentStep < 3"
            type="button"
            class="next-btn tech-button"
            @click="nextStep"
          >
            下一步
          </button>
          <button
            v-else
            type="button"
            class="submit-btn tech-button"
            @click="handleSubmit"
            :disabled="loading"
          >
            <span v-if="!loading">完成设置</span>
            <el-icon v-else class="is-loading"><Loading /></el-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="decoration">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
      <div class="bubble bubble-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  School,
  Loading,
  CircleCheck
} from '@element-plus/icons-vue'
import gsap from 'gsap'

const router = useRouter()
const formRef = ref()
const currentStep = ref(1)
const loading = ref(false)
const penguinRef = ref(null)

const steps = ['基本信息', '教育背景', '专业信息']

// 企鹅状态和消息
const penguinState = ref('idle')
const penguinMessage = ref('Hi！我是你的AI助手小P，让我来帮你完成资料填写吧！')

// 专业选项数据
const majorOptions = {
  computer: [
    '计算机科学与技术',
    '软件工程',
    '人工智能',
    '大数据技术',
    '网络工程',
    '信息安全',
    '物联网工程',
    '数据科学与大数据技术'
  ],
  electronic: [
    '电子信息工程',
    '通信工程',
    '微电子科学与工程',
    '集成电路设计',
    '电子科学与技术',
    '光电信息科学与工程'
  ],
  economics: [
    '经济学',
    '金融学',
    '会计学',
    '工商管理',
    '市场营销',
    '人力资源管理',
    '财务管理',
    '国际经济与贸易'
  ],
  literature: [
    '汉语言文学',
    '英语',
    '新闻学',
    '传播学',
    '广告学',
    '编辑出版学',
    '网络与新媒体'
  ],
  science: [
    '数学与应用数学',
    '物理学',
    '化学',
    '生物科学',
    '统计学',
    '应用物理学',
    '材料科学与工程'
  ],
  medical: [
    '临床医学',
    '口腔医学',
    '中医学',
    '药学',
    '护理学',
    '医学影像学',
    '预防医学'
  ],
  art: [
    '视觉传达设计',
    '环境设计',
    '产品设计',
    '数字媒体艺术',
    '动画',
    '美术学',
    '音乐学'
  ],
  other: []
}

// 岗位选项
const positionOptions = [
  { label: '技术开发', value: '技术开发' },
  { label: '产品经理', value: '产品经理' },
  { label: '设计', value: '设计' },
  { label: '运营', value: '运营' },
  { label: '市场', value: '市场' },
  { label: '数据分析', value: '数据分析' },
  { label: '人力资源', value: '人力资源' },
  { label: '财务', value: '财务' }
]

// 计算属性
const progressWidth = computed(() => {
  return `${(currentStep.value / steps.length) * 100}%`
})

const availableMajors = computed(() => {
  return majorOptions[formData.majorCategory] || []
})

// 表单数据
const formData = reactive({
  age: null,
  graduationYear: '',
  education: '',
  school: '',
  majorCategory: '',
  major: '',
  targetPosition: []
})

// 验证规则
const rules = reactive({
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 18, max: 60, message: '年龄必须在18-60之间', trigger: 'blur' }
  ],
  graduationYear: [
    { required: true, message: '请选择毕业年份', trigger: 'change' }
  ],
  education: [
    { required: true, message: '请选择学历', trigger: 'change' }
  ],
  school: [
    { required: true, message: '请输入院校名称', trigger: 'blur' }
  ],
  majorCategory: [
    { required: true, message: '请选择专业类别', trigger: 'change' }
  ],
  major: [
    { required: true, message: '请选择或输入具体专业', trigger: 'change' }
  ],
  targetPosition: [
    { type: 'array', required: true, message: '请至少选择一个意向岗位', trigger: 'change' }
  ]
})

// 设置企鹅状态
const setPenguinState = (state) => {
  penguinState.value = state

  // 更新企鹅消息
  const messages = {
    idle: '填写你的信息，我会一直陪着你~',
    thinking: '嗯...让我想想...',
    curious: '哇，这个选择很有意思呢！',
    shy: '我...我不看...（捂眼）',
    happy: '太棒了！你完成得很好！'
  }

  penguinMessage.value = messages[state] || messages.idle

  // 添加动画效果
  if (penguinRef.value) {
    gsap.to(penguinRef.value, {
      scale: state === 'happy' ? 1.1 : 1,
      rotation: state === 'curious' ? 5 : 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

// 监听密码输入（如果有密码字段）
watch(() => formData.password, (newVal) => {
  if (newVal) {
    setPenguinState('shy')
  } else {
    setPenguinState('idle')
  }
})

// 专业类别改变
const handleMajorCategoryChange = (value) => {
  formData.major = '' // 清空已选专业

  if (value) {
    setPenguinState('curious')

    // 提供专业建议
    setTimeout(() => {
      const suggestions = {
        computer: '计算机类专业很热门哦，未来发展前景很好！',
        electronic: '电子信息类是未来科技的基础，很有挑战性！',
        economics: '经济管理类专业，商业世界等着你！',
        literature: '文学类专业培养人文素养，很有内涵！',
        science: '理工科专业，探索世界的奥秘！',
        medical: '医学类专业，救死扶伤，很伟大！',
        art: '艺术类专业，创造美好的世界！',
        other: '选择适合自己的专业最重要！'
      }

      penguinMessage.value = suggestions[value] || '这个专业不错哦！'
    }, 500)
  }
}

// 下一步
const nextStep = async () => {
  const fieldsToValidate = {
    1: ['age', 'graduationYear'],
    2: ['education', 'school'],
    3: ['majorCategory', 'major', 'targetPosition']
  }

  try {
    await formRef.value?.validateField(fieldsToValidate[currentStep.value])
    currentStep.value++

    // 更新企鹅状态
    if (currentStep.value === 3) {
      setPenguinState('curious')
      penguinMessage.value = '马上就要完成了，加油！'
    } else {
      setPenguinState('thinking')
    }
  } catch (error) {
    setPenguinState('thinking')
    penguinMessage.value = '还有一些信息需要填写哦~'
  }
}

// 上一步
const previousStep = () => {
  currentStep.value--
  setPenguinState('idle')
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    setPenguinState('thinking')
    penguinMessage.value = '还有一些信息需要完善哦~'
    return
  }

  loading.value = true
  setPenguinState('happy')
  penguinMessage.value = '太棒了！正在保存你的信息...'

  // 模拟提交请求
  setTimeout(() => {
    loading.value = false
    ElMessage.success('个人信息设置成功！')

    // 保存状态
    localStorage.setItem('hasProfile', 'true')
    localStorage.setItem('userProfile', JSON.stringify(formData))

    // 跳转到主应用
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }, 1500)
}

// 初始化企鹅动画
const initPenguinAnimation = () => {
  // 眨眼动画
  setInterval(() => {
    if (penguinState.value !== 'shy') {
      const eyes = document.querySelectorAll('.eye')
      eyes.forEach(eye => {
        eye.style.transform = 'scaleY(0.1)'
        setTimeout(() => {
          eye.style.transform = 'scaleY(1)'
        }, 150)
      })
    }
  }, 3000)

  // 轻微摇摆动画
  gsap.to('.penguin', {
    rotation: 2,
    duration: 2,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1
  })
}

onMounted(() => {
  initPenguinAnimation()
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.profile-wrapper {
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 1200px;
  width: 100%;
}

/* 企鹅助手样式 */
.penguin-assistant {
  flex-shrink: 0;
  position: relative;
}

.penguin-container {
  position: relative;
  width: 300px;
  height: 400px;
}

.penguin {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 280px;
}

/* 企鹅身体 */
.penguin-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 200px;
  background: #2c3e50;
  border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
  overflow: hidden;
}

.penguin-belly {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 150px;
  background: white;
  border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
}

/* 企鹅眼睛 */
.penguin-eyes {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.eye {
  width: 30px;
  height: 35px;
  background: white;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  transition: all 0.15s ease;
}

.eye.closed {
  height: 5px;
}

.pupil {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 15px;
  height: 15px;
  background: #2c3e50;
  border-radius: 50%;
}

.eye.closed .pupil {
  display: none;
}

/* 企鹅翅膀 */
.penguin-wings {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
}

.wing {
  position: absolute;
  width: 60px;
  height: 100px;
  background: #34495e;
  border-radius: 50% 10% 50% 10%;
  transition: all 0.3s ease;
}

.left-wing {
  left: -10px;
  transform: rotate(-30deg);
  transform-origin: top right;
}

.right-wing {
  right: -10px;
  transform: rotate(30deg) scaleX(-1);
  transform-origin: top left;
}

/* 捂眼睛动作 */
.wing.covering {
  z-index: 11;
}

.left-wing.covering {
  transform: rotate(-90deg) translateY(-60px);
}

.right-wing.covering {
  transform: rotate(90deg) scaleX(-1) translateY(-60px);
}

/* 企鹅嘴巴 */
.penguin-beak {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 20px;
  background: #f39c12;
  border-radius: 0 0 50% 50%;
  z-index: 5;
  transition: all 0.3s ease;
}

.penguin-beak.smile {
  width: 40px;
  height: 25px;
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
}

/* 企鹅脚 */
.penguin-feet {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  display: flex;
  justify-content: space-between;
}

.foot {
  width: 40px;
  height: 20px;
  background: #f39c12;
  border-radius: 50% 50% 30% 30%;
}

/* 对话气泡 */
.speech-bubble {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 15px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  text-align: center;
  animation: float 3s ease-in-out infinite;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
}

.speech-bubble p {
  margin: 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

/* 资料卡片样式 */
.profile-card {
  flex: 1;
  max-width: 600px;
  padding: 40px;
  position: relative;
  z-index: 10;
}

/* 进度条样式优化 */
.progress-bar {
  position: relative;
  margin-bottom: 50px;
}

.progress-fill {
  position: absolute;
  top: 20px;
  left: 0;
  height: 6px;
  background: var(--gradient-tech);
  transition: width 0.5s ease;
  z-index: 1;
  border-radius: 3px;
  box-shadow: 0 2px 10px rgba(64, 158, 255, 0.4);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  border: 2px solid transparent;
}

.step.active .step-number {
  background: var(--gradient-tech);
  color: white;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.4);
}

.step.current .step-number {
  transform: scale(1.2);
  border-color: rgba(64, 158, 255, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1.2); }
  50% { transform: scale(1.3); }
}

/* 表单样式优化 */
.profile-form :deep(.el-form-item__label) {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 16px;
}

.profile-form :deep(.el-input__wrapper),
.profile-form :deep(.el-select__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: none;
  transition: all 0.3s ease;
}

.profile-form :deep(.el-input__wrapper:hover),
.profile-form :deep(.el-select__wrapper:hover) {
  border-color: rgba(64, 158, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.profile-form :deep(.el-input__wrapper.is-focus),
.profile-form :deep(.el-select__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 背景装饰 */
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(64, 158, 255, 0.3), transparent);
  animation: bubble-float 20s ease-in-out infinite;
}

.bubble-1 {
  width: 150px;
  height: 150px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 5%;
  animation-delay: 5s;
}

.bubble-3 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  left: 10%;
  animation-delay: 10s;
}

.bubble-4 {
  width: 180px;
  height: 180px;
  bottom: 20%;
  right: 15%;
  animation-delay: 15s;
}

@keyframes bubble-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
    opacity: 0.8;
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
    opacity: 0.5;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-wrapper {
    flex-direction: column;
    gap: 40px;
  }

  .penguin-assistant {
    order: -1;
  }

  .penguin-container {
    width: 250px;
    height: 350px;
  }

  .penguin {
    transform: translateX(-50%) scale(0.8);
  }
}

@media (max-width: 768px) {
  .penguin-container {
    width: 200px;
    height: 300px;
  }

  .penguin {
    transform: translateX(-50%) scale(0.7);
  }

  .speech-bubble {
    min-width: 150px;
    padding: 10px 15px;
  }

  .profile-card {
    padding: 30px 20px;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .button-group button {
    width: 100%;
  }
}
</style>
