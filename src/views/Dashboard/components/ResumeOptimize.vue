<template>
  <div class="resume-optimize-container">
    <div class="page-header">
      <h2 class="page-title">简历优化</h2>
      <p class="page-subtitle">AI智能分析，让您的简历更具竞争力</p>
    </div>

    <div class="coming-soon glass-card">
      <el-icon :size="80" color="#409eff"><DocumentChecked /></el-icon>
      <h3>功能开发中</h3>
      <p>AI简历优化功能即将上线，敬请期待！</p>
      <p class="feature-desc">
        该功能将提供：简历评分、关键词优化、排版建议、个性化修改建议等服务
      </p>
      <el-button type="primary" @click="backToDashboard">
        返回主页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { DocumentChecked } from '@element-plus/icons-vue'

const router = useRouter()

const backToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.resume-optimize-container {
  max-width: 800px;
  margin: 0 auto;
}

.coming-soon {
  padding: 80px 40px;
  text-align: center;
  margin-top: 50px;
}

.coming-soon h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 20px 0;
}

.coming-soon p {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.feature-desc {
  max-width: 500px;
  margin: 0 auto 30px;
  line-height: 1.6;
}
</style>
