<template>
  <div class="login-container">
    <div class="login-card glass-card animate__animated animate__fadeIn">
      <!-- 标题区域 -->
      <div class="login-header">
        <h2 class="login-title tech-title">
          {{ isLogin ? '欢迎回来' : '创建账号' }}
        </h2>
        <p class="login-subtitle">
          {{ isLogin ? '登录以继续你的面试之旅' : '注册开始你的面试提升之路' }}
        </p>
      </div>

      <!-- 表单区域 -->
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          >
            <template #suffix>
              <!-- 小企鹅遮眼睛动画 -->
              <div class="penguin-container">
                <div class="penguin" :class="{ 'eyes-covered': showPassword }">
                  <div class="penguin-eye left-eye"></div>
                  <div class="penguin-eye right-eye"></div>
                  <div class="penguin-hand" v-if="showPassword"></div>
                </div>
              </div>
            </template>
          </el-input>
        </el-form-item>

        <!-- 确认密码（仅注册时显示） -->
        <el-form-item v-if="!isLogin" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请确认密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <!-- 邮箱（仅注册时显示） -->
        <el-form-item v-if="!isLogin" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            size="large"
            :prefix-icon="Message"
          />
        </el-form-item>

        <!-- 记住我 / 用户协议 -->
        <el-form-item>
          <el-checkbox v-if="isLogin" v-model="rememberMe">记住我</el-checkbox>
          <el-checkbox v-else v-model="agreeTerms">
            我已阅读并同意
            <a href="#" class="link">用户协议</a>
            和
            <a href="#" class="link">隐私政策</a>
          </el-checkbox>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <button
            type="button"
            class="submit-btn tech-button"
            @click="handleSubmit"
            :disabled="loading"
          >
            <span v-if="!loading">{{ isLogin ? '登录' : '注册' }}</span>
            <el-icon v-else class="is-loading"><Loading /></el-icon>
          </button>
        </el-form-item>
      </el-form>

      <!-- 切换登录/注册 -->
      <div class="switch-mode">
        <span>{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
        <a href="#" @click.prevent="switchMode" class="link">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </a>
      </div>

      <!-- 第三方登录 -->
      <div class="divider">
        <span>或</span>
      </div>

      <div class="social-login">
        <div class="social-btn" @click="handleSocialLogin('wechat')">
          <el-icon :size="20"><ChatDotRound /></el-icon>
          <span>微信登录</span>
        </div>
        <div class="social-btn" @click="handleSocialLogin('qq')">
          <el-icon :size="20"><Connection /></el-icon>
          <span>QQ登录</span>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage'
}
</script>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Lock,
  Message,
  Loading,
  ChatDotRound,
  Connection
} from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const isLogin = ref(true)
const loading = ref(false)
const rememberMe = ref(false)
const agreeTerms = ref(false)
const showPassword = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
})

// 监听密码输入，控制企鹅动画
watch(() => formData.password, (newVal) => {
  showPassword.value = newVal.length > 0
})

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})

// 切换登录/注册
const switchMode = () => {
  isLogin.value = !isLogin.value
  formRef.value?.resetFields()
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  if (!isLogin.value && !agreeTerms.value) {
    ElMessage.warning('请先同意用户协议和隐私政策')
    return
  }

  loading.value = true

  // 模拟登录/注册请求
  setTimeout(() => {
    loading.value = false

    if (isLogin.value) {
      // 模拟登录成功
      if (formData.username === 'test' && formData.password === '123456') {
        ElMessage.success('登录成功')
        localStorage.setItem('isAuthenticated', 'true')
        router.push('/profile-setup')
      } else {
        ElMessage.error('用户名或密码错误（测试账号：test/123456）')
      }
    } else {
      // 模拟注册成功
      ElMessage.success('注册成功，请登录')
      isLogin.value = true
      formRef.value?.resetFields()
    }
  }, 1500)
}

// 第三方登录
const handleSocialLogin = (type) => {
  ElMessage.info(`${type === 'wechat' ? '微信' : 'QQ'}登录功能开发中...`)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 50px 40px;
  position: relative;
  z-index: 10;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.login-subtitle {
  color: var(--text-secondary);
}

.login-form {
  margin-bottom: 30px;
}

.login-form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.login-form :deep(.el-input__inner) {
  color: var(--text-primary);
}

.login-form :deep(.el-input__inner::placeholder) {
  color: var(--text-muted);
}

/* 企鹅动画样式 */
.penguin-container {
  position: relative;
  width: 30px;
  height: 30px;
}

.penguin {
  width: 30px;
  height: 30px;
  background: #333;
  border-radius: 50% 50% 40% 40%;
  position: relative;
  transition: all 0.3s ease;
}

.penguin-eye {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  transition: all 0.3s ease;
}

.left-eye {
  left: 6px;
}

.right-eye {
  right: 6px;
}

.penguin.eyes-covered .penguin-eye {
  height: 2px;
}

.penguin-hand {
  width: 35px;
  height: 8px;
  background: #333;
  position: absolute;
  top: 5px;
  left: -2px;
  border-radius: 4px;
  transform: rotate(-10deg);
  z-index: 1;
}

.submit-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  margin-top: 20px;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-mode {
  text-align: center;
  margin-bottom: 30px;
  color: var(--text-secondary);
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: var(--primary-dark);
}

.divider {
  text-align: center;
  margin: 30px 0 20px;
  position: relative;
  color: var(--text-muted);
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-login {
  display: flex;
  gap: 20px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  transform: translateY(-2px);
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: var(--gradient-tech);
  opacity: 0.1;
  animation: float 10s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -100px;
  animation-delay: 3s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 6s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    padding: 40px 20px;
  }

  .social-login {
    flex-direction: column;
  }
}
</style>
