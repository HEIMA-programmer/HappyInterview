<template>
  <div v-if="userInfo" class="basic-info-container">
    <div class="page-header">
      <h2 class="page-title">基本资料</h2>
      <p class="page-subtitle">查看和编辑您的个人信息</p>
    </div>

    <div class="info-card glass-card">
      <el-form
        ref="formRef"
        :model="editForm"
        :rules="rules"
        label-width="120px"
        :disabled="!isEditing"
        label-position="left"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="editForm.age"
            :min="18"
            :max="60"
            style="width: 100%"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="毕业年份" prop="graduation_year">
          <el-date-picker
            v-model="editForm.graduation_year"
            type="year"
            placeholder="选择年份"
            format="YYYY"
            value-format="YYYY"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-select v-model="editForm.education" placeholder="请选择学历" style="width: 100%">
            <el-option label="专科" value="专科" /><el-option label="本科" value="本科" /><el-option
              label="硕士"
              value="硕士"
            /><el-option label="博士" value="博士" />
          </el-select>
        </el-form-item>
        <el-form-item label="院校" prop="school">
          <el-input v-model="editForm.school" placeholder="请输入院校名称" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="editForm.major" placeholder="请输入专业名称" />
        </el-form-item>
        <el-form-item label="意向岗位" prop="target_position">
          <div class="position-container">
            <template v-if="editForm.target_position && editForm.target_position.length > 0">
              <el-tag
                v-for="position in editForm.target_position"
                :key="position"
                class="position-tag"
                closable
                :disable-transitions="false"
                @close="handleRemovePosition(position)"
                type="primary"
                effect="light"
                >{{ position }}</el-tag
              >
            </template>
            <el-button
              v-if="
                !inputVisible &&
                (!editForm.target_position || editForm.target_position.length < 5) &&
                isEditing
              "
              class="button-new-tag"
              size="small"
              @click="showInput"
              type="primary"
              plain
              ><el-icon><Plus /></el-icon> 添加岗位</el-button
            >
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
          <el-button v-if="!isEditing" type="primary" @click="handleEdit" :loading="loading"
            ><el-icon><Edit /></el-icon> 编辑资料</el-button
          >
          <template v-else>
            <el-button type="primary" @click="handleSave" :loading="saving"
              ><el-icon><Check /></el-icon> 保存</el-button
            >
            <el-button @click="handleCancel"
              ><el-icon><Close /></el-icon> 取消</el-button
            >
          </template>
        </el-form-item>
      </el-form>
    </div>

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

    <div v-if="suggestions.length > 0" class="suggestions-section">
      <h3>完善建议</h3>
      <div class="suggestions-card glass-card">
        <el-alert title="提升您的资料完善度" type="info" :closable="false" show-icon>
          <template #default>
            <ul class="suggestion-list">
              <li v-for="suggestion in suggestions" :key="suggestion.id">
                <el-icon :color="suggestion.color" style="margin-right: 8px"
                  ><component :is="suggestion.icon"
                /></el-icon>
                <span v-html="suggestion.text"></span>
              </li>
            </ul>
          </template>
        </el-alert>
      </div>
    </div>
  </div>

  <div v-else class="loading-container">
    <el-skeleton :rows="10" animated />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, computed, watch } from 'vue'
import { ElMessage, ElSkeleton } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  Plus,
  Edit,
  Check,
  Close,
  InfoFilled,
  Warning,
  CircleCheck,
  MagicStick,
} from '@element-plus/icons-vue'

const formRef = ref()
const inputRef = ref()
const userStore = useUserStore()

const isEditing = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const loading = ref(false)
const saving = ref(false)

const editForm = reactive({
  username: '',
  age: null,
  graduation_year: '',
  education: '',
  school: '',
  major: '',
  target_position: [],
})

const userInfo = computed(() => userStore.userInfo)

const registrationDate = computed(() => {
  if (!userInfo.value || !userInfo.value.created_at) return 'N/A'
  return new Date(userInfo.value.created_at).toLocaleDateString()
})

const lastLoginDate = computed(() => {
  if (!userInfo.value || !userInfo.value.updated_at) return 'N/A'
  return new Date(userInfo.value.updated_at).toLocaleString()
})

const profileCompletion = computed(() => {
  if (!userInfo.value) return 0
  const fields = ['username', 'age', 'graduation_year', 'education', 'school', 'major']
  let completedCount = 0
  for (const field of fields) {
    if (userInfo.value[field]) {
      completedCount++
    }
  }
  const positionScore =
    userInfo.value.target_position && userInfo.value.target_position.length > 0 ? 1 : 0
  return Math.round(((completedCount + positionScore) / (fields.length + 1)) * 100)
})

const progressColor = computed(() => {
  if (profileCompletion.value >= 80) return '#67C23A'
  if (profileCompletion.value >= 60) return '#E6A23C'
  return '#F56C6C'
})

const suggestions = computed(() => {
  if (!userInfo.value) return []

  const result = []
  const info = userInfo.value

  if (!info.username) {
    result.push({
      id: 'username',
      text: '请填写您的用户名，方便我们更好地称呼您。',
      icon: 'Warning',
      color: '#E6A23C',
    })
  }
  if (!info.age) {
    result.push({
      id: 'age',
      text: '填写年龄有助于AI为您匹配更合适的岗位难度。',
      icon: 'Warning',
      color: '#E6A23C',
    })
  }
  if (!info.school) {
    result.push({
      id: 'school',
      text: '请填写您的毕业院校，这是简历的重要部分。',
      icon: 'Warning',
      color: '#E6A23C',
    })
  }
  if (!info.major) {
    result.push({
      id: 'major',
      text: '填写专业信息能让AI更精准地推荐相关问题。',
      icon: 'Warning',
      color: '#E6A23C',
    })
  }
  if (!info.target_position || info.target_position.length === 0) {
    result.push({
      id: 'position_empty',
      text: '请至少添加一个意向岗位，AI将围绕它为您生成面试题目。',
      icon: 'Warning',
      color: '#E6A23C',
    })
  } else if (info.target_position.length < 2) {
    result.push({
      id: 'position_more',
      text: '建议添加2-3个意向岗位，这可以拓宽您的面试练习范围，发现更多机会。',
      icon: 'InfoFilled',
      color: '#409EFF',
    })
  }

  // 如果所有必填项都已完成，则提供一个鼓励性的建议
  if (result.length === 0) {
    result.push({
      id: 'all_good',
      text: '您的资料已基本完善！可以点击左侧菜单开始一次模拟面试来检验您的学习成果。',
      icon: 'CircleCheck',
      color: '#67C23A',
    })
    result.push({
      id: 'optimize',
      text: '想让简历更出众？可以试试我们的AI简历优化功能，让您的简历在众多竞争者中脱颖而出。',
      icon: 'MagicStick',
      color: '#409EFF',
    })
  }

  return result
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 18, max: 60, message: '年龄必须在18-60之间', trigger: 'blur' },
  ],
  graduation_year: [{ required: true, message: '请选择毕业年份', trigger: 'change' }],
  education: [{ required: true, message: '请选择学历', trigger: 'change' }],
  school: [{ required: true, message: '请输入院校名称', trigger: 'blur' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  target_position: [
    { type: 'array', required: true, message: '请至少选择一个意向岗位', trigger: 'change' },
  ],
}

const syncStoreToForm = (source) => {
  if (source) {
    for (const key in editForm) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        editForm[key] = source[key] || (Array.isArray(editForm[key]) ? [] : editForm[key])
      }
    }
  }
}

watch(
  userInfo,
  (newUserInfo) => {
    syncStoreToForm(newUserInfo)
  },
  { immediate: true, deep: true },
)

const handleEdit = () => {
  syncStoreToForm(userInfo.value)
  isEditing.value = true
}
const handleSave = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return
    saving.value = true
    await userStore.updateProfile(editForm)
    isEditing.value = false
    ElMessage.success('资料更新成功')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
    console.error('Save profile error:', error)
  } finally {
    saving.value = false
  }
}
const handleCancel = () => {
  isEditing.value = false
}
const handleRemovePosition = (position) => {
  if (!isEditing.value) return
  const index = editForm.target_position.indexOf(position)
  if (index > -1) {
    editForm.target_position.splice(index, 1)
  }
}
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}
const handleInputConfirm = () => {
  if (inputValue.value && inputValue.value.trim()) {
    const newPosition = inputValue.value.trim()
    if (!editForm.target_position.includes(newPosition)) {
      if (editForm.target_position.length < 5) {
        editForm.target_position.push(newPosition)
      } else {
        ElMessage.warning('最多只能添加5个意向岗位')
      }
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

const loadUserProfile = async () => {
  if (!userStore.userInfo) {
    loading.value = true
    await userStore.fetchUserOnLoad()
    loading.value = false
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
/* 您的所有样式保持不变 */
.loading-container {
  padding: 40px;
}
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
}
</style>
