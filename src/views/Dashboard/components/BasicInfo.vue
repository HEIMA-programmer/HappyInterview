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
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" />
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="userInfo.age" :min="18" :max="60" />
        </el-form-item>

        <el-form-item label="毕业年份" prop="graduationYear">
          <el-date-picker
            v-model="userInfo.graduationYear"
            type="year"
            placeholder="选择年份"
            format="YYYY"
            value-format="YYYY"
          />
        </el-form-item>

        <el-form-item label="学历" prop="education">
          <el-select v-model="userInfo.education" placeholder="请选择">
            <el-option label="专科" value="专科" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士" value="硕士" />
            <el-option label="博士" value="博士" />
          </el-select>
        </el-form-item>

        <el-form-item label="院校" prop="school">
          <el-input v-model="userInfo.school" />
        </el-form-item>

        <el-form-item label="专业" prop="major">
          <el-input v-model="userInfo.major" />
        </el-form-item>

        <el-form-item label="意向岗位" prop="targetPosition">
          <el-tag
            v-for="position in userInfo.targetPosition"
            :key="position"
            class="position-tag"
            closable
            :disable-transitions="false"
            @close="handleRemovePosition(position)"
          >
            {{ position }}
          </el-tag>
          <el-button
            v-if="!inputVisible && userInfo.targetPosition.length < 5"
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            + 添加岗位
          </el-button>
          <el-input
            v-if="inputVisible"
            ref="inputRef"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="!isEditing"
            type="primary"
            @click="handleEdit"
          >
            编辑资料
          </el-button>
          <template v-else>
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const inputRef = ref()
const isEditing = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')

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

// 验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
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
  const valid = await formRef.value?.validate()
  if (!valid) return

  isEditing.value = false
  ElMessage.success('资料更新成功')

  // 保存到localStorage
  localStorage.setItem('userProfile', JSON.stringify(userInfo))
}

// 取消
const handleCancel = () => {
  isEditing.value = false
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
  if (inputValue.value) {
    if (!userInfo.targetPosition.includes(inputValue.value)) {
      userInfo.targetPosition.push(inputValue.value)
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 加载用户数据
onMounted(() => {
  const savedProfile = localStorage.getItem('userProfile')
  if (savedProfile) {
    const profile = JSON.parse(savedProfile)
    Object.assign(userInfo, profile)
  }
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

.info-card :deep(.el-form-item__label) {
  color: var(--text-primary);
}

.position-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.button-new-tag {
  height: 32px;
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
  padding: 20px;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.account-item:last-child {
  border-bottom: none;
}

.account-item .label {
  width: 120px;
  color: var(--text-secondary);
}

.account-item .value {
  color: var(--text-primary);
}
</style>
