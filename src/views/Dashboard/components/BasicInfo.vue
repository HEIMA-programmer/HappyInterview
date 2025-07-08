<template>
  <div class="basic-info-container">
    <div class="page-header">
      <h2 class="page-title">基本资料</h2>
      <p class="page-subtitle">查看和编辑您的个人信息</p>
    </div>

    <div class="info-card glass-card">
      <el-form
        ref="formRef"
        :model="userInfo"
        :rules="rules"
        label-width="120px"
        :disabled="!isEditing"
        label-position="left"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="userInfo.age"
            :min="18"
            :max="60"
            style="width: 100%"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="毕业年份" prop="graduationYear">
          <el-date-picker
            v-model="userInfo.graduationYear"
            type="year"
            placeholder="选择年份"
            format="YYYY"
            value-format="YYYY"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="学历" prop="education">
          <el-select v-model="userInfo.education" placeholder="请选择学历" style="width: 100%">
            <el-option label="专科" value="专科" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士" value="硕士" />
            <el-option label="博士" value="博士" />
          </el-select>
        </el-form-item>

        <el-form-item label="院校" prop="school">
          <el-input v-model="userInfo.school" placeholder="请输入院校名称" />
        </el-form-item>

        <el-form-item label="专业" prop="major">
          <el-input v-model="userInfo.major" placeholder="请输入专业名称" />
        </el-form-item>

        <el-form-item label="意向岗位" prop="targetPosition">
          <div class="position-container">
            <el-tag
              v-for="position in userInfo.targetPosition"
              :key="position"
              class="position-tag"
              closable
              :disable-transitions="false"
              @close="handleRemovePosition(position)"
              type="primary"
              effect="light"
            >
              {{ position }}
            </el-tag>
            <el-button
              v-if="!inputVisible && userInfo.targetPosition.length < 5 && isEditing"
              class="button-new-tag"
              size="small"
              @click="showInput"
              type="primary"
              plain
            >
              <el-icon><Plus /></el-icon>
              添加岗位
            </el-button>
            <el-input
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              class="input-new-tag"
              size="small"
              placeholder="输入岗位名称"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
              @keyup.esc="inputVisible = false"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="!isEditing"
            type="primary"
            @click="handleEdit"
            :loading="loading"
          >
            <el-icon><Edit /></el-icon>
            编辑资料
          </el-button>
          <template v-else>
            <el-button
              type="primary"
              @click="handleSave"
              :loading="saving"
            >
              <el-icon><Check /></el-icon>
              保存
            </el-button>
            <el-button @click="handleCancel">
              <el-icon><Close /></el-icon>
              取消
            </el-button>
          </template>
        </el-form-item>
      </el-form>
    </div>

    <!-- 账号信息 -->
    <div class="account-section">
      <h3>账号信息</h3>
      <div class="account-card glass-card">
        <div class="account-item">
          <span class="label">注册时间：</span>
          <span class="value">{{ registrationDate }}</span>
        </div>
        <div class="account-item">
          <span class="label">上次登录：</span>
          <span class="value">{{ lastLoginDate }}</span>
        </div>
        <div class="account-item">
          <span class="label">账号状态：</span>
          <el-tag type="success">正常</el-tag>
        </div>
        <div class="account-item">
          <span class="label">完善度：</span>
          <div class="completion-progress">
            <el-progress :percentage="profileCompletion" :color="progressColor" />
            <span class="completion-text">{{ profileCompletion }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 完善建议 -->
    <div v-if="profileCompletion < 100" class="suggestions-section">
      <h3>完善建议</h3>
      <div class="suggestions-card glass-card">
        <el-alert
          title="提升您的资料完善度"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <ul class="suggestion-list">
              <li v-for="suggestion in suggestions" :key="suggestion">
                <el-icon><InfoFilled /></el-icon>
                {{ suggestion }}
              </li>
            </ul>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Check, Close, InfoFilled } from '@element-plus/icons-vue'

const formRef = ref()
const inputRef = ref()
const isEditing = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const loading = ref(false)
const saving = ref(false)

// 用户信息
const userInfo = reactive({
  username: 'test',
  age: 22,
  graduationYear: '2024',
  education: '本科',
  school: '示例大学',
  major: '计算机科学与技术',
  targetPosition: ['技术开发', '产品经理']
})

// 原始数据备份
let originalData = {}

// 账号信息
const registrationDate = ref('2024-01-01')
const lastLoginDate = ref(new Date().toLocaleDateString())

// 计算完善度
const profileCompletion = computed(() => {
  const fields = ['username', 'age', 'graduationYear', 'education', 'school', 'major']
  const completedFields = fields.filter(field => userInfo[field] && userInfo[field] !== '')
  const positionScore = userInfo.targetPosition.length > 0 ? 1 : 0
  return Math.round(((completedFields.length + positionScore) / (fields.length + 1)) * 100)
})

// 进度条颜色
const progressColor = computed(() => {
  if (profileCompletion.value >= 80) return '#67c23a'
  if (profileCompletion.value >= 60) return '#e6a23c'
  return '#f56c6c'
})

// 完善建议
const suggestions = computed(() => {
  const result = []
  if (!userInfo.username) result.push('请填写用户名')
  if (!userInfo.age) result.push('请填写年龄信息')
  if (!userInfo.school) result.push('请填写院校信息')
  if (!userInfo.major) result.push('请填写专业信息')
  if (userInfo.targetPosition.length === 0) result.push('请添加至少一个意向岗位')
  if (userInfo.targetPosition.length < 2) result.push('建议添加2-3个意向岗位，增加就业机会')
  return result
})

// 验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 18, max: 60, message: '年龄必须在18-60之间', trigger: 'blur' }
  ],
  education: [
    { required: true, message: '请选择学历', trigger: 'change' }
  ],
  school: [
    { required: true, message: '请输入院校名称', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ]
}

// 编辑
const handleEdit = () => {
  isEditing.value = true
  // 备份原始数据
  originalData = JSON.parse(JSON.stringify(userInfo))
}

// 保存
const handleSave = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    saving.value = true

    // TODO: 调用后端API保存用户信息
    // const response = await apiService.user.updateProfile({
    //   username: userInfo.username,
    //   age: userInfo.age,
    //   graduationYear: userInfo.graduationYear,
    //   education: userInfo.education,
    //   school: userInfo.school,
    //   major: userInfo.major,
    //   targetPosition: userInfo.targetPosition
    // })

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    isEditing.value = false
    ElMessage.success('资料更新成功')

    // 保存到localStorage（临时方案）
    localStorage.setItem('userProfile', JSON.stringify(userInfo))

  } catch (error) {
    ElMessage.error('保存失败，请重试')
    console.error('Save profile error:', error)
  } finally {
    saving.value = false
  }
}

// 取消
const handleCancel = () => {
  isEditing.value = false
  inputVisible.value = false
  inputValue.value = ''
  // 恢复原始数据
  Object.assign(userInfo, originalData)
}

// 删除意向岗位
const handleRemovePosition = (position) => {
  if (!isEditing.value) return
  const index = userInfo.targetPosition.indexOf(position)
  if (index > -1) {
    userInfo.targetPosition.splice(index, 1)
  }
}

// 显示输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 确认添加岗位
const handleInputConfirm = () => {
  if (inputValue.value && inputValue.value.trim()) {
    const newPosition = inputValue.value.trim()
    if (!userInfo.targetPosition.includes(newPosition)) {
      if (userInfo.targetPosition.length < 5) {
        userInfo.targetPosition.push(newPosition)
        ElMessage.success(`已添加岗位：${newPosition}`)
      } else {
        ElMessage.warning('最多只能添加5个意向岗位')
      }
    } else {
      ElMessage.warning('该岗位已存在')
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 加载用户数据
const loadUserProfile = async () => {
  try {
    loading.value = true

    // TODO: 调用后端API获取用户信息
    // const response = await apiService.user.getProfile()
    // Object.assign(userInfo, response.data)

    // 从localStorage加载（临时方案）
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      Object.assign(userInfo, profile)
    }

  } catch (error) {
    ElMessage.error('加载用户信息失败')
    console.error('Load profile error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
.basic-info-container {
  max-width: 800px;
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

.info-card {
  padding: 30px;
  margin-bottom: 30px;
}

/* 修复表单样式，确保所有元素左对齐且颜色一致 */
.info-card :deep(.el-form-item__label) {
  color: var(--text-primary) !important;
  font-weight: 500;
  text-align: left;
}

.info-card :deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.info-card :deep(.el-input__inner::placeholder) {
  color: var(--text-secondary);
}

.info-card :deep(.el-input-number) {
  width: 100%;
}

.info-card :deep(.el-input-number .el-input__inner) {
  text-align: left !important;
}

.info-card :deep(.el-select) {
  width: 100%;
}

.info-card :deep(.el-date-editor) {
  width: 100%;
}

.position-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.position-tag {
  margin: 0;
}

.button-new-tag {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.input-new-tag {
  width: 120px;
}

.account-section {
  margin-top: 40px;
}

.account-section h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.account-card {
  padding: 25px;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.account-item:last-child {
  border-bottom: none;
}

.account-item .label {
  width: 120px;
  color: var(--text-secondary);
  font-weight: 500;
}

.account-item .value {
  color: var(--text-primary);
  font-weight: 500;
}

.completion-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.completion-text {
  color: var(--text-primary);
  font-weight: 600;
  min-width: 35px;
}

.suggestions-section {
  margin-top: 30px;
}

.suggestions-section h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.suggestions-card {
  padding: 20px;
}

.suggestion-list {
  margin: 10px 0 0 0;
  padding: 0;
  list-style: none;
}

.suggestion-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .account-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .account-item .label {
    width: auto;
  }

  .completion-progress {
    width: 100%;
  }
}</style>
