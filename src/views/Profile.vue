
<template>
  <div class="profile-container">
    <div class="profile-card glass-card animate__animated animate__fadeIn">
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
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step }}</div>
          </div>
        </div>
      </div>

      <div class="profile-header">
        <h2 class="profile-title tech-title">完善个人信息</h2>
        <p class="profile-subtitle">让AI更了解你，提供个性化的面试指导</p>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="profile-form"
        label-position="top"
      >
        <div v-if="currentStep === 1" class="form-step animate__animated animate__fadeIn">
          <el-form-item label="年龄" prop="age">
            <el-input-number
              v-model="formData.age"
              :min="18"
              :max="60"
              placeholder="请输入您的年龄"
              style="width: 100%"
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
            />
          </el-form-item>
        </div>

        <div v-if="currentStep === 2" class="form-step animate__animated animate__fadeIn">
          <el-form-item label="学历" prop="education">
            <el-select v-model="formData.education" placeholder="请选择学历" style="width: 100%">
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
            >
              <template #prefix>
                <el-icon><School /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div v-if="currentStep === 3" class="form-step animate__animated animate__fadeIn">
          <el-form-item label="专业类别" prop="majorCategory">
            <el-select
              v-model="formData.majorCategory"
              placeholder="请选择专业类别"
              @change="handleMajorCategoryChange"
              style="width: 100%"
            >
              <el-option label="计算机类" value="computer" />
              <el-option label="电子信息类" value="electronic" />
              <el-option label="经济管理类" value="economics" />
              <el-option label="文学类" value="literature" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="具体专业" prop="major">
            <el-input
              v-model="formData.major"
              placeholder="请输入具体专业名称"
            />
          </el-form-item>

          <el-form-item label="意向岗位" prop="targetPosition">
            <el-checkbox-group v-model="formData.targetPosition">
              <el-checkbox label="技术开发">技术开发</el-checkbox>
              <el-checkbox label="产品经理">产品经理</el-checkbox>
              <el-checkbox label="运营">运营</el-checkbox>
              <el-checkbox label="设计">设计</el-checkbox>
              <el-checkbox label="市场">市场</el-checkbox>
              <el-checkbox label="其他">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>

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

    <div class="decoration">
      <div class="float-icon icon-1">
        <el-icon :size="40"><UserFilled /></el-icon>
      </div>
      <div class="float-icon icon-2">
        <el-icon :size="40"><School /></el-icon>
      </div>
      <div class="float-icon icon-3">
        <el-icon :size="40"><Reading /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'UserProfile' })
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  School,
  UserFilled,
  Reading,
  Loading
} from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const currentStep = ref(1)
const loading = ref(false)

const steps = ['基本信息', '教育背景', '专业信息']

// 计算进度条宽度
const progressWidth = computed(() => {
  return `${((currentStep.value -1) / (steps.length - 1)) * 100}%`
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
    { required: true, message: '请输入具体专业', trigger: 'blur' }
  ],
  targetPosition: [
    { type: 'array', required: true, message: '请至少选择一个意向岗位', trigger: 'change' }
  ]
})

// 专业类别改变
const handleMajorCategoryChange = (value) => {
  // 根据类别自动填充一些专业建议
  const majorSuggestions = {
    computer: ['计算机科学与技术', '软件工程', '人工智能', '大数据'],
    electronic: ['电子信息工程', '通信工程', '微电子', '集成电路'],
    economics: ['经济学', '金融学', '会计学', '工商管理'],
    literature: ['汉语言文学', '英语', '新闻学', '传播学']
  }

  if (majorSuggestions[value] && !formData.major) {
    ElMessage.info(`推荐专业：${majorSuggestions[value].join('、')}`)
  }
}

// 下一步
const nextStep = async () => {
  // 根据当前步骤验证对应字段
  const fieldsToValidate = {
    1: ['age', 'graduationYear'],
    2: ['education', 'school'],
    3: ['majorCategory', 'major', 'targetPosition']
  }

  try {
    const fields = fieldsToValidate[currentStep.value] || [];
    await formRef.value?.validateField(fields)
    if (currentStep.value < steps.length) {
      currentStep.value++
    }
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

// 上一步
const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true

  // 模拟提交请求
  setTimeout(() => {
    loading.value = false
    ElMessage.success('个人信息设置成功！')

    // 保存状态
    localStorage.setItem('hasProfile', 'true')
    localStorage.setItem('userProfile', JSON.stringify(formData))

    // 跳转到主应用
    router.push('/dashboard')
  }, 1500)
}
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

.profile-card {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  position: relative;
  z-index: 10;
}

/* 进度条样式 */
.progress-bar {
  position: relative;
  margin-bottom: 50px;
}

.progress-fill {
  position: absolute;
  top: 18px; /* Vertically center in the 40px step number */
  left: 0;
  height: 4px;
  background: var(--gradient-tech);
  transition: width 0.5s ease;
  z-index: 1;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 18px;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
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
}

.step.current .step-number {
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
  border-color: var(--primary-color);
}

.step-label {
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.step.active .step-label {
  color: var(--text-primary);
}

/* 标题样式 */
.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.profile-subtitle {
  color: var(--text-secondary);
}

/* 表单样式 */
.profile-form :deep(.el-form-item__label) {
  color: var(--text-primary);
  font-weight: bold;
  margin-bottom: 10px;
}

.profile-form :deep(.el-input__wrapper),
.profile-form :deep(.el-select__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
  height: 40px;
}

.profile-form :deep(.el-input__inner),
.profile-form :deep(.el-select__input) {
  color: var(--text-primary);
}

.profile-form :deep(.el-input__inner::placeholder),
.profile-form :deep(.el-select__placeholder) {
  color: var(--text-muted);
}

.profile-form :deep(.el-checkbox__label) {
  color: var(--text-primary);
}

.form-step {
  min-height: 250px; /* Adjust height for consistent layout between steps */
}

/* 按钮组 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.next-btn,
.submit-btn {
  margin-left: auto;
}

/* 装饰元素 */
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.float-icon {
  position: absolute;
  color: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.icon-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.icon-2 {
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.icon-3 {
  bottom: 20%;
  left: 15%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-card {
    padding: 30px 20px;
  }

  .step-label {
    font-size: 12px;
  }

  .button-group {
    flex-direction: column-reverse;
    gap: 15px;
  }

  .button-group button, .button-group .tech-button {
    width: 100%;
    margin-left: 0;
  }
}
</style>

