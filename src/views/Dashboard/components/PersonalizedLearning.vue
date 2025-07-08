<template>
  <div class="personalized-learning-container">
    <div class="page-header">
      <h2 class="page-title">AI个性化学习路径</h2>
      <p class="page-subtitle">基于您的面试表现和薄弱环节，AI为您量身定制专属学习计划</p>
    </div>

    <!-- 学习概览仪表板 -->
    <div class="dashboard-overview">
      <div class="overview-card glass-card">
        <div class="overview-left">
          <h3>当前学习状态</h3>
          <h4>{{ currentPlan.name }}</h4>
          <p>{{ currentPlan.description }}</p>
          <div class="plan-meta">
            <span
              ><el-icon><Calendar /></el-icon> 开始时间：{{ currentPlan.startDate }}</span
            >
            <span
              ><el-icon><Timer /></el-icon> 预计完成：{{ currentPlan.estimatedFinish }}</span
            >
            <span
              ><el-icon><TrendCharts /></el-icon> 学习强度：{{ currentPlan.intensity }}</span
            >
          </div>
          <div class="quick-actions">
            <el-button type="primary" @click="continueLearning">继续学习</el-button>
            <el-button @click="adjustPlan">调整计划</el-button>
            <el-button @click="viewAllPlans">查看所有计划</el-button>
          </div>
        </div>
        <div class="overview-right">
          <div class="progress-ring">
            <el-progress
              type="circle"
              :percentage="currentPlan.progress"
              :width="160"
              :stroke-width="12"
              :color="progressColors"
            >
              <template #default="{ percentage }">
                <span class="progress-text">
                  <span class="percentage">{{ percentage }}%</span>
                  <span class="label">总体进度</span>
                </span>
              </template>
            </el-progress>
          </div>
          <div class="progress-details">
            <div class="detail-item">
              <span class="detail-value">{{ currentPlan.completedLessons }}</span>
              <span class="detail-label">已完成课程</span>
            </div>
            <div class="detail-item">
              <span class="detail-value">{{ currentPlan.weeklyGoal }}</span>
              <span class="detail-label">本周目标</span>
            </div>
            <div class="detail-item">
              <span class="detail-value">{{ currentPlan.streak }}天</span>
              <span class="detail-label">连续学习</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI分析建议 -->
      <div class="ai-insights glass-card">
        <div class="insights-header">
          <h3>
            <el-icon><Cpu /></el-icon>
            AI智能分析
          </h3>
          <el-tag type="primary">实时更新</el-tag>
        </div>
        <div class="insights-content">
          <div class="insight-item" v-for="insight in aiInsights" :key="insight.id">
            <el-icon :color="insight.color"><component :is="insight.icon" /></el-icon>
            <div class="insight-text">
              <h5>{{ insight.title }}</h5>
              <p>{{ insight.description }}</p>
              <el-button
                size="small"
                type="primary"
                @click="handleInsightAction(insight)"
                v-if="insight.action"
              >
                {{ insight.actionText }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日个性化任务 -->
    <div class="daily-tasks glass-card">
      <div class="section-header">
        <div class="header-left">
          <h3>
            <el-icon><Calendar /></el-icon>
            今日个性化任务
          </h3>
          <el-tag :type="getDailyTasksStatusType()">
            {{ dailyTasks.completed }} / {{ dailyTasks.total }} 完成
          </el-tag>
        </div>
        <div class="header-right">
          <el-button size="small" @click="refreshTasks">
            <el-icon><Refresh /></el-icon>
            刷新任务
          </el-button>
          <el-button size="small" type="primary" @click="customizeTask">
            <el-icon><Setting /></el-icon>
            自定义
          </el-button>
        </div>
      </div>

      <div class="task-list">
        <div
          v-for="task in dailyTasks.tasks"
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed, priority: task.priority === 'high' }"
        >
          <div class="task-left">
            <el-checkbox v-model="task.completed" @change="updateTaskStatus(task)" size="large" />
            <div class="task-content">
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <div class="task-badges">
                  <el-tag size="small" :type="getTaskTypeColor(task.type)">{{ task.type }}</el-tag>
                  <el-tag size="small" v-if="task.priority === 'high'" type="danger"
                    >高优先级</el-tag
                  >
                  <el-tag size="small" v-if="task.adaptive" type="warning">AI推荐</el-tag>
                </div>
              </div>
              <p>{{ task.description }}</p>
              <div class="task-meta">
                <span class="task-duration">
                  <el-icon><Clock /></el-icon>
                  {{ task.duration }}分钟
                </span>
                <span class="task-difficulty">
                  <el-icon><TrendCharts /></el-icon>
                  {{ task.difficulty }}
                </span>
                <span class="task-reward" v-if="task.experience">
                  <el-icon><Trophy /></el-icon>
                  +{{ task.experience }}经验
                </span>
              </div>
              <div class="task-skills" v-if="task.skills">
                <span class="skills-label">提升技能：</span>
                <el-tag v-for="skill in task.skills" :key="skill" size="small" type="info">
                  {{ skill }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="task-actions">
            <el-button v-if="!task.completed" type="primary" size="small" @click="startTask(task)">
              开始学习
            </el-button>
            <el-button v-if="task.relatedQuestion" size="small" @click="viewRelatedQuestion(task)">
              查看原题
            </el-button>
            <el-dropdown v-if="!task.completed" @command="handleTaskCommand">
              <el-button size="small" circle>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="`skip-${task.id}`">跳过任务</el-dropdown-item>
                  <el-dropdown-item :command="`schedule-${task.id}`">稍后完成</el-dropdown-item>
                  <el-dropdown-item :command="`feedback-${task.id}`">任务反馈</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="tasks-summary">
        <div class="summary-stats">
          <span>今日已学习：{{ todayStats.studyTime }}分钟</span>
          <span>获得经验：{{ todayStats.experience }}点</span>
          <span>提升技能：{{ todayStats.skillsImproved }}项</span>
        </div>
        <el-button type="primary" @click="completeAllTasks" :disabled="!canCompleteAll">
          一键完成剩余
        </el-button>
      </div>
    </div>

    <!-- 薄弱环节针对性训练 -->
    <div class="weakness-training glass-card">
      <div class="section-header">
        <h3>
          <el-icon><Warning /></el-icon>
          薄弱环节强化训练
        </h3>
        <el-button size="small" @click="analyzeWeakness">
          <el-icon><DataAnalysis /></el-icon>
          重新分析
        </el-button>
      </div>

      <div class="weakness-areas">
        <div
          v-for="weakness in weaknessAreas"
          :key="weakness.id"
          class="weakness-card"
          :class="{ urgent: weakness.urgent }"
        >
          <div class="weakness-header">
            <div class="weakness-icon">
              <el-icon :size="24" :color="weakness.color">
                <component :is="weakness.icon" />
              </el-icon>
            </div>
            <div class="weakness-info">
              <h4>{{ weakness.name }}</h4>
              <p>{{ weakness.description }}</p>
            </div>
            <div class="weakness-score">
              <el-progress
                type="circle"
                :percentage="weakness.score"
                :width="60"
                :stroke-width="6"
                :color="getWeaknessColor(weakness.score)"
              />
            </div>
          </div>

          <div class="weakness-details">
            <div class="detail-section">
              <h5>问题分析</h5>
              <ul>
                <li v-for="issue in weakness.issues" :key="issue">{{ issue }}</li>
              </ul>
            </div>
            <div class="detail-section">
              <h5>推荐学习</h5>
              <div class="recommended-resources">
                <div
                  v-for="resource in weakness.recommendations"
                  :key="resource.id"
                  class="resource-item"
                  @click="startResource(resource)"
                >
                  <el-icon><component :is="resource.icon" /></el-icon>
                  <span>{{ resource.title }}</span>
                  <el-tag size="small">{{ resource.duration }}</el-tag>
                </div>
              </div>
            </div>
          </div>

          <div class="weakness-actions">
            <el-button type="primary" size="small" @click="startWeaknessTraining(weakness)">
              开始强化
            </el-button>
            <el-button size="small" @click="viewWeaknessDetails(weakness)"> 详细分析 </el-button>
            <el-button size="small" @click="scheduleTraining(weakness)"> 安排训练 </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能学习路径 -->
    <div class="learning-path glass-card">
      <div class="section-header">
        <h3>
          <el-icon><Guide /></el-icon>
          智能学习路径
        </h3>
        <div class="path-controls">
          <el-select v-model="selectedPath" @change="switchPath">
            <el-option
              v-for="path in availablePaths"
              :key="path.id"
              :label="path.name"
              :value="path.id"
            />
          </el-select>
          <el-button size="small" type="primary" @click="createCustomPath">
            <el-icon><Plus /></el-icon>
            创建路径
          </el-button>
        </div>
      </div>

      <div class="path-timeline">
        <div
          v-for="(stage, index) in currentLearningPath"
          :key="stage.id"
          class="path-stage"
          :class="{
            active: stage.id === currentStage,
            completed: stage.progress === 100,
            current: stage.current,
          }"
        >
          <div class="stage-marker">
            <div class="marker-dot">
              <el-icon v-if="stage.progress === 100" :size="20">
                <CircleCheck />
              </el-icon>
              <el-icon v-else-if="stage.current" :size="20">
                <VideoPlay />
              </el-icon>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="marker-line" v-if="index < currentLearningPath.length - 1"></div>
          </div>

          <div class="stage-content">
            <div class="stage-header">
              <div class="stage-title">
                <h4>{{ stage.name }}</h4>
                <div class="stage-badges">
                  <el-tag size="small" v-if="stage.adaptive">AI调整</el-tag>
                  <el-tag
                    size="small"
                    v-if="stage.difficulty"
                    :type="getDifficultyType(stage.difficulty)"
                  >
                    {{ stage.difficulty }}
                  </el-tag>
                </div>
              </div>
              <el-progress
                :percentage="stage.progress"
                :status="stage.progress === 100 ? 'success' : ''"
                :stroke-width="8"
              />
            </div>

            <p class="stage-description">{{ stage.description }}</p>

            <div class="stage-modules">
              <div
                v-for="module in stage.modules"
                :key="module.id"
                class="module-item"
                :class="{ completed: module.completed, current: module.current }"
                @click="viewModule(module)"
              >
                <el-icon
                  :color="module.completed ? '#67c23a' : module.current ? '#409eff' : '#909399'"
                >
                  <CircleCheck v-if="module.completed" />
                  <VideoPlay v-else-if="module.current" />
                  <More v-else />
                </el-icon>
                <div class="module-info">
                  <span class="module-name">{{ module.name }}</span>
                  <span class="module-meta"
                    >{{ module.lessons }}课时 · {{ module.duration }}分钟</span
                  >
                </div>
                <div class="module-actions" v-if="module.current">
                  <el-button size="small" type="primary" @click.stop="continueModule(module)">
                    继续学习
                  </el-button>
                </div>
              </div>
            </div>

            <div class="stage-actions" v-if="stage.current">
              <el-button type="primary" @click="continueStage(stage)"> 继续学习 </el-button>
              <el-button @click="skipStage(stage)"> 跳过阶段 </el-button>
              <el-button @click="adjustStage(stage)"> 调整内容 </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 基于对话的个性化推荐 -->
    <div class="conversation-based glass-card">
      <div class="section-header">
        <h3>
          <el-icon><ChatDotSquare /></el-icon>
          基于对话的学习推荐
        </h3>
        <el-button size="small" @click="refreshRecommendations">
          <el-icon><Refresh /></el-icon>
          更新推荐
        </el-button>
      </div>

      <div class="conversation-insights">
        <div class="insight-summary">
          <h4>最近面试分析总结</h4>
          <p>基于您最近{{ recentInterviews.length }}次面试表现，AI为您生成专项提升建议</p>
        </div>

        <div class="interview-cards">
          <div
            v-for="interview in recentInterviews"
            :key="interview.id"
            class="interview-card"
            @click="viewInterviewDetails(interview)"
          >
            <div class="interview-header">
              <h5>{{ interview.position }} - {{ interview.company }}</h5>
              <el-tag size="small" :type="interview.type === 'simulation' ? 'primary' : 'success'">
                {{ interview.type === 'simulation' ? '模拟面试' : '练习模式' }}
              </el-tag>
            </div>
            <div class="interview-score">
              <el-rate v-model="interview.rating" disabled show-score />
            </div>
            <div class="interview-recommendations">
              <h6>AI推荐学习：</h6>
              <div class="recommendation-list">
                <div
                  v-for="rec in interview.aiRecommendations"
                  :key="rec.id"
                  class="recommendation-item"
                  @click.stop="startRecommendation(rec)"
                >
                  <el-icon><component :is="rec.icon" /></el-icon>
                  <span>{{ rec.title }}</span>
                  <el-button size="small" type="primary">学习</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐学习资源 -->
    <div class="recommended-resources">
      <h3>
        <el-icon><Star /></el-icon>
        为您精选推荐
      </h3>

      <el-tabs v-model="activeResourceTab">
        <el-tab-pane label="视频课程" name="videos">
          <div class="resource-grid">
            <div
              v-for="resource in filteredResources.videos"
              :key="resource.id"
              class="resource-card glass-card hover-float"
              @click="startResource(resource)"
            >
              <div class="resource-thumbnail">
                <el-image :src="resource.thumbnail" fit="cover" />
                <div class="resource-duration">{{ resource.duration }}</div>
                <div class="resource-level">{{ resource.level }}</div>
              </div>

              <div class="resource-info">
                <h4>{{ resource.title }}</h4>
                <p>{{ resource.description }}</p>

                <div class="resource-meta">
                  <span class="meta-item">
                    <el-icon><User /></el-icon>
                    {{ resource.instructor }}
                  </span>
                  <span class="meta-item">
                    <el-icon><Star /></el-icon>
                    {{ resource.rating }}
                  </span>
                  <span class="meta-item">
                    <el-icon><View /></el-icon>
                    {{ resource.students }}人学习
                  </span>
                </div>

                <div class="resource-tags">
                  <el-tag v-for="tag in resource.tags" :key="tag" size="small" type="info">
                    {{ tag }}
                  </el-tag>
                </div>

                <div class="resource-progress" v-if="resource.progress">
                  <el-progress :percentage="resource.progress" :show-text="false" />
                  <span class="progress-text">已学习{{ resource.progress }}%</span>
                </div>
              </div>

              <div class="resource-action">
                <el-button type="primary" @click.stop="startResource(resource)">
                  {{ resource.progress ? '继续学习' : '开始学习' }}
                </el-button>
                <el-button @click.stop="collectResource(resource)">
                  <el-icon><Star /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="实战项目" name="projects">
          <div class="resource-grid">
            <div
              v-for="project in filteredResources.projects"
              :key="project.id"
              class="resource-card glass-card hover-float"
            >
              <div class="project-header">
                <div class="project-icon">
                  <el-icon :size="30" :color="project.color">
                    <component :is="project.icon" />
                  </el-icon>
                </div>
                <div class="project-difficulty">
                  <el-tag :type="getDifficultyType(project.difficulty)">
                    {{ project.difficulty }}
                  </el-tag>
                </div>
              </div>

              <div class="resource-info">
                <h4>{{ project.title }}</h4>
                <p>{{ project.description }}</p>

                <div class="project-details">
                  <div class="detail-item">
                    <span class="detail-label">技术栈：</span>
                    <span class="detail-value">{{ project.techStack.join(', ') }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">预计时间：</span>
                    <span class="detail-value">{{ project.estimatedTime }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">学习收获：</span>
                    <span class="detail-value">{{ project.outcomes.join('、') }}</span>
                  </div>
                </div>
              </div>

              <div class="resource-action">
                <el-button type="primary" @click="startProject(project)"> 开始项目 </el-button>
                <el-button @click="previewProject(project)"> 预览 </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="面试题库" name="questions">
          <div class="question-recommendations">
            <div
              v-for="question in filteredResources.questions"
              :key="question.id"
              class="question-recommendation"
              @click="practiceQuestion(question)"
            >
              <div class="question-content">
                <h4>{{ question.title }}</h4>
                <p>{{ question.description }}</p>
                <div class="question-meta">
                  <el-tag :type="getDifficultyType(question.difficulty)">
                    {{ question.difficulty }}
                  </el-tag>
                  <span>{{ question.category }}</span>
                  <span>推荐原因：{{ question.reason }}</span>
                </div>
              </div>
              <div class="question-action">
                <el-button type="primary">练习</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 学习成就和激励 -->
    <div class="achievements glass-card">
      <h3>
        <el-icon><Trophy /></el-icon>
        学习成就与激励
      </h3>

      <div class="achievement-overview">
        <div class="level-info">
          <div class="current-level">
            <span class="level-number">{{ userLevel.current }}</span>
            <span class="level-name">{{ userLevel.name }}</span>
          </div>
          <div class="level-progress">
            <el-progress
              :percentage="userLevel.progress"
              :stroke-width="8"
              :color="levelProgressColors"
            />
            <span class="exp-text"
              >{{ userLevel.currentExp }} / {{ userLevel.nextLevelExp }} 经验</span
            >
          </div>
        </div>
        <div class="next-reward">
          <h5>距离下一奖励</h5>
          <p>{{ userLevel.nextReward.description }}</p>
          <span class="reward-progress">还需 {{ userLevel.nextReward.requiredExp }} 经验</span>
        </div>
      </div>

      <div class="achievement-list">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="achievement-item"
          :class="{ unlocked: achievement.unlocked, recent: achievement.recent }"
        >
          <div class="achievement-icon">
            <el-icon :size="40" :color="achievement.unlocked ? achievement.color : '#666'">
              <Trophy />
            </el-icon>
            <div v-if="achievement.recent" class="new-badge">NEW</div>
          </div>
          <div class="achievement-info">
            <h5>{{ achievement.name }}</h5>
            <p>{{ achievement.description }}</p>
            <div v-if="!achievement.unlocked" class="achievement-progress">
              <el-progress
                :percentage="achievement.progress"
                :show-text="false"
                :stroke-width="4"
              />
              <span class="progress-text">{{ achievement.current }} / {{ achievement.total }}</span>
            </div>
            <div v-else class="unlock-time">
              {{ achievement.unlockedAt }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义任务对话框 -->
    <el-dialog v-model="showCustomTask" title="自定义学习任务" width="600px">
      <el-form :model="customTaskForm" label-width="100px">
        <el-form-item label="任务类型">
          <el-select v-model="customTaskForm.type">
            <el-option label="知识学习" value="knowledge" />
            <el-option label="题目练习" value="practice" />
            <el-option label="项目实战" value="project" />
            <el-option label="面试模拟" value="interview" />
          </el-select>
        </el-form-item>
        <el-form-item label="学习时长">
          <el-slider v-model="customTaskForm.duration" :min="10" :max="120" />
        </el-form-item>
        <el-form-item label="难度等级">
          <el-radio-group v-model="customTaskForm.difficulty">
            <el-radio label="简单">简单</el-radio>
            <el-radio label="中等">中等</el-radio>
            <el-radio label="困难">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专注领域">
          <el-checkbox-group v-model="customTaskForm.areas">
            <el-checkbox label="算法与数据结构">算法与数据结构</el-checkbox>
            <el-checkbox label="系统设计">系统设计</el-checkbox>
            <el-checkbox label="前端技术">前端技术</el-checkbox>
            <el-checkbox label="后端开发">后端开发</el-checkbox>
            <el-checkbox label="行为面试">行为面试</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCustomTask = false">取消</el-button>
        <el-button type="primary" @click="createCustomTask">创建任务</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  Timer,
  TrendCharts,
  Cpu,
  Clock,
  Trophy,
  Refresh,
  Setting,
  MoreFilled,
  Warning,
  DataAnalysis,
  CircleCheck,
  VideoPlay,
  More,
  Guide,
  Plus,
  ChatDotSquare,
  Star,
  User,
  View,
} from '@element-plus/icons-vue'

const router = useRouter()

// 状态管理
const selectedPath = ref('current')
const currentStage = ref('stage2')
const activeResourceTab = ref('videos')
const showCustomTask = ref(false)

// 进度颜色配置
const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const levelProgressColors = [
  { color: '#909399', percentage: 30 },
  { color: '#e6a23c', percentage: 70 },
  { color: '#67c23a', percentage: 100 },
]

// 当前学习计划
const currentPlan = ref({
  id: 1,
  name: '前端面试全栈提升计划',
  description: '基于您的薄弱环节定制：重点加强算法思维、系统设计和项目经验表达',
  startDate: '2024-01-01',
  estimatedFinish: '2024-02-15',
  intensity: '中等强度',
  progress: 68,
  completedLessons: 32,
  totalLessons: 47,
  weeklyGoal: '完成8个任务',
  streak: 15,
})

// AI智能分析
const aiInsights = ref([
  {
    id: 1,
    icon: 'TrendCharts',
    color: '#67c23a',
    title: '学习状态良好',
    description: '您近期的学习一致性很好，建议保持当前节奏，可适度增加难度。',
    action: 'adjust-difficulty',
    actionText: '提升难度',
  },
  {
    id: 2,
    icon: 'Warning',
    color: '#e6a23c',
    title: '算法薄弱需重视',
    description: '最近3次面试中算法题表现不佳，建议集中强化数据结构与算法。',
    action: 'focus-algorithm',
    actionText: '开始强化',
  },
  {
    id: 3,
    icon: 'Star',
    color: '#409eff',
    title: '新课程推荐',
    description: '基于您的学习偏好，推荐了"系统设计实战"课程，适合当前水平。',
    action: 'view-course',
    actionText: '查看课程',
  },
])

// 今日任务
const dailyTasks = ref({
  completed: 3,
  total: 6,
  tasks: [
    {
      id: 1,
      title: '复习二叉树遍历算法',
      description: '针对昨天面试中的二叉树题目，加强前序、中序、后序遍历的理解',
      type: '算法强化',
      duration: 25,
      difficulty: '中等',
      experience: 50,
      priority: 'high',
      adaptive: true,
      completed: true,
      skills: ['数据结构', '递归思维'],
      relatedQuestion: { id: 101, title: '二叉树的前序遍历' },
    },
    {
      id: 2,
      title: '练习STAR法则回答',
      description: '基于您在行为面试中的表现，练习用STAR法则描述项目经验',
      type: '表达训练',
      duration: 20,
      difficulty: '简单',
      experience: 30,
      priority: 'normal',
      adaptive: true,
      completed: true,
      skills: ['表达能力', '逻辑思维'],
      relatedQuestion: { id: 102, title: '介绍最有成就感的项目' },
    },
    {
      id: 3,
      title: '系统设计：缓存策略',
      description: '学习Redis缓存策略，补强系统设计知识短板',
      type: '系统设计',
      duration: 35,
      difficulty: '困难',
      experience: 80,
      priority: 'high',
      adaptive: false,
      completed: true,
      skills: ['系统架构', '缓存设计'],
    },
    {
      id: 4,
      title: '前端性能优化实践',
      description: '结合实际项目案例，深入理解前端性能优化策略',
      type: '技术深化',
      duration: 40,
      difficulty: '中等',
      experience: 60,
      priority: 'normal',
      adaptive: true,
      completed: false,
      skills: ['性能优化', '工程化'],
    },
    {
      id: 5,
      title: '模拟技术面试',
      description: '针对目标公司的技术栈进行模拟面试训练',
      type: '面试模拟',
      duration: 30,
      difficulty: '中等',
      experience: 70,
      priority: 'normal',
      adaptive: false,
      completed: false,
      skills: ['综合应用', '面试技巧'],
    },
    {
      id: 6,
      title: '代码规范与最佳实践',
      description: '学习企业级代码规范，提升代码质量意识',
      type: '工程素养',
      duration: 15,
      difficulty: '简单',
      experience: 25,
      priority: 'low',
      adaptive: false,
      completed: false,
      skills: ['代码质量', '团队协作'],
    },
  ],
})

// 今日统计
const todayStats = ref({
  studyTime: 85,
  experience: 180,
  skillsImproved: 6,
})

// 薄弱环节
const weaknessAreas = ref([
  {
    id: 1,
    name: '算法与数据结构',
    description: '在最近的面试中，算法题解题思路不够清晰，时间复杂度分析有欠缺',
    score: 65,
    color: '#f56c6c',
    icon: 'DataAnalysis',
    urgent: true,
    issues: ['递归思维不够熟练', '动态规划理解不深', '时间复杂度分析错误', '边界条件考虑不全'],
    recommendations: [
      {
        id: 1,
        title: 'LeetCode Top 100',
        icon: 'Notebook',
        duration: '2周',
      },
      {
        id: 2,
        title: '算法可视化课程',
        icon: 'VideoCamera',
        duration: '5天',
      },
      {
        id: 3,
        title: '递归专项训练',
        icon: 'Reading',
        duration: '3天',
      },
    ],
  },
  {
    id: 2,
    name: '系统设计能力',
    description: '缺乏大型系统设计经验，对分布式系统理解不足',
    score: 72,
    color: '#e6a23c',
    icon: 'Platform',
    urgent: false,
    issues: ['微服务架构理解浅显', '数据库设计经验不足', '负载均衡策略不熟', '缓存策略应用不当'],
    recommendations: [
      {
        id: 4,
        title: '系统设计入门',
        icon: 'Reading',
        duration: '1周',
      },
      {
        id: 5,
        title: '分布式系统实战',
        icon: 'Monitor',
        duration: '2周',
      },
    ],
  },
  {
    id: 3,
    name: '项目经验表达',
    description: '技术实力不错，但在面试中表达项目经验时逻辑性有待提升',
    score: 78,
    color: '#409eff',
    icon: 'ChatDotSquare',
    urgent: false,
    issues: ['STAR法则运用不熟练', '技术细节描述不清', '项目亮点突出不够', '团队协作经验表达模糊'],
    recommendations: [
      {
        id: 6,
        title: '面试表达训练',
        icon: 'Microphone',
        duration: '3天',
      },
      {
        id: 7,
        title: 'STAR法则实践',
        icon: 'Document',
        duration: '2天',
      },
    ],
  },
])

// 学习路径
const availablePaths = ref([
  { id: 'current', name: '当前路径：前端全栈提升' },
  { id: 'algorithm', name: '算法专项突破' },
  { id: 'system', name: '系统设计进阶' },
  { id: 'interview', name: '面试技巧强化' },
])

const currentLearningPath = ref([
  {
    id: 'stage1',
    name: '基础巩固阶段',
    description: '夯实编程基础，建立扎实的知识体系',
    progress: 100,
    current: false,
    adaptive: false,
    difficulty: '简单',
    modules: [
      {
        id: 'm1',
        name: 'JavaScript核心概念',
        lessons: 8,
        duration: 240,
        completed: true,
        current: false,
      },
      {
        id: 'm2',
        name: 'HTML/CSS进阶',
        lessons: 6,
        duration: 180,
        completed: true,
        current: false,
      },
      {
        id: 'm3',
        name: '浏览器工作原理',
        lessons: 4,
        duration: 120,
        completed: true,
        current: false,
      },
    ],
  },
  {
    id: 'stage2',
    name: '技能提升阶段',
    description: '深入学习框架和工具，提升开发效率',
    progress: 70,
    current: true,
    adaptive: true,
    difficulty: '中等',
    modules: [
      {
        id: 'm4',
        name: 'Vue3深入实践',
        lessons: 12,
        duration: 360,
        completed: true,
        current: false,
      },
      {
        id: 'm5',
        name: 'React Hooks详解',
        lessons: 10,
        duration: 300,
        completed: false,
        current: true,
      },
      { id: 'm6', name: '前端工程化', lessons: 8, duration: 240, completed: false, current: false },
    ],
  },
  {
    id: 'stage3',
    name: '进阶突破阶段',
    description: '掌握高级技术，具备架构思维',
    progress: 0,
    current: false,
    adaptive: true,
    difficulty: '困难',
    modules: [
      {
        id: 'm7',
        name: '微前端架构',
        lessons: 10,
        duration: 300,
        completed: false,
        current: false,
      },
      {
        id: 'm8',
        name: '性能优化实战',
        lessons: 8,
        duration: 240,
        completed: false,
        current: false,
      },
      {
        id: 'm9',
        name: '全栈开发实践',
        lessons: 15,
        duration: 450,
        completed: false,
        current: false,
      },
    ],
  },
])

// 最近面试记录
const recentInterviews = ref([
  {
    id: 1,
    position: '高级前端工程师',
    company: '字节跳动',
    type: 'simulation',
    rating: 3.5,
    date: '2024-01-20',
    aiRecommendations: [
      {
        id: 1,
        title: '算法思维强化训练',
        icon: 'DataAnalysis',
        type: 'weakness',
      },
      {
        id: 2,
        title: '项目经验表达优化',
        icon: 'ChatDotSquare',
        type: 'skill',
      },
    ],
  },
  {
    id: 2,
    position: '前端架构师',
    company: '阿里巴巴',
    type: 'practice',
    rating: 4.0,
    date: '2024-01-18',
    aiRecommendations: [
      {
        id: 3,
        title: '系统设计进阶课程',
        icon: 'Platform',
        type: 'knowledge',
      },
    ],
  },
])

// 推荐资源
const filteredResources = ref({
  videos: [
    {
      id: 1,
      title: 'Vue3源码深度解析',
      description: '从零开始手写Vue3响应式系统，深入理解框架原理',
      thumbnail: '/api/placeholder/300/180',
      duration: '8小时',
      level: '进阶',
      instructor: '技术专家A',
      rating: 4.8,
      students: 1580,
      tags: ['Vue3', '源码', '进阶'],
      progress: 35,
    },
    {
      id: 2,
      title: '算法与数据结构精讲',
      description: '系统讲解常用数据结构和算法，提升编程思维',
      thumbnail: '/api/placeholder/300/180',
      duration: '12小时',
      level: '中级',
      instructor: '算法专家B',
      rating: 4.9,
      students: 2340,
      tags: ['算法', '数据结构', '面试'],
      progress: 0,
    },
  ],
  projects: [
    {
      id: 1,
      title: '全栈电商平台开发',
      description: '使用现代技术栈开发完整的电商平台，包含前后端和数据库设计',
      icon: 'Monitor',
      color: '#409eff',
      difficulty: '困难',
      techStack: ['Vue3', 'Node.js', 'MySQL', 'Redis'],
      estimatedTime: '4-6周',
      outcomes: ['全栈开发能力', '项目架构设计', '团队协作经验'],
    },
    {
      id: 2,
      title: '组件库设计与开发',
      description: '从零开始设计和开发企业级组件库，掌握组件化思维',
      icon: 'Box',
      color: '#67c23a',
      difficulty: '中等',
      techStack: ['Vue3', 'TypeScript', 'Vite', 'Storybook'],
      estimatedTime: '2-3周',
      outcomes: ['组件设计能力', 'TypeScript应用', '工程化实践'],
    },
  ],
  questions: [
    {
      id: 1,
      title: '实现一个深拷贝函数',
      description: '考察对JavaScript基础的掌握和边界情况的处理能力',
      difficulty: '中等',
      category: 'JavaScript',
      reason: '您在最近面试中遇到类似问题',
    },
    {
      id: 2,
      title: '设计一个分布式缓存系统',
      description: '考察系统设计能力和对分布式系统的理解',
      difficulty: '困难',
      category: '系统设计',
      reason: '基于您的薄弱环节推荐',
    },
  ],
})

// 用户等级
const userLevel = ref({
  current: 18,
  name: '算法新星',
  progress: 75,
  currentExp: 3750,
  nextLevelExp: 5000,
  nextReward: {
    description: '解锁高级系统设计课程',
    requiredExp: 1250,
  },
})

// 成就系统
const achievements = ref([
  {
    id: 1,
    name: '持之以恒',
    description: '连续学习15天',
    unlocked: true,
    recent: true,
    color: '#67c23a',
    unlockedAt: '2天前',
  },
  {
    id: 2,
    name: '算法大师',
    description: '完成100道算法题',
    unlocked: false,
    progress: 65,
    current: 65,
    total: 100,
    color: '#409eff',
  },
  {
    id: 3,
    name: '面试达人',
    description: '完成20次模拟面试',
    unlocked: false,
    progress: 40,
    current: 8,
    total: 20,
    color: '#e6a23c',
  },
])

// 自定义任务表单
const customTaskForm = ref({
  type: 'knowledge',
  duration: 30,
  difficulty: '中等',
  areas: [],
})

// 计算属性
const canCompleteAll = computed(() => {
  return dailyTasks.value.tasks.some((task) => !task.completed)
})

// 工具方法
const getDailyTasksStatusType = () => {
  const percentage = (dailyTasks.value.completed / dailyTasks.value.total) * 100
  if (percentage === 100) return 'success'
  if (percentage >= 50) return 'primary'
  return 'warning'
}

const getTaskTypeColor = (type) => {
  const colorMap = {
    算法强化: 'danger',
    表达训练: 'success',
    系统设计: 'warning',
    技术深化: 'primary',
    面试模拟: 'info',
    工程素养: '',
  }
  return colorMap[type] || 'info'
}

const getDifficultyType = (difficulty) => {
  const map = {
    简单: 'success',
    中等: 'warning',
    困难: 'danger',
  }
  return map[difficulty] || 'info'
}

const getWeaknessColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 事件处理方法
const continueLearning = () => {
  // 跳转到当前正在学习的模块
  const currentModule = getCurrentModule()
  if (currentModule) {
    continueModule(currentModule)
  } else {
    ElMessage.info('正在为您准备下一阶段的学习内容...')
  }
}

const getCurrentModule = () => {
  for (const stage of currentLearningPath.value) {
    for (const module of stage.modules) {
      if (module.current) {
        return module
      }
    }
  }
  return null
}

const adjustPlan = () => {
  ElMessage.info('学习计划调整功能开发中...')
}

const viewAllPlans = () => {
  ElMessage.info('查看所有计划功能开发中...')
}

const handleInsightAction = (insight) => {
  switch (insight.action) {
    case 'adjust-difficulty':
      ElMessage.success('已为您调整学习难度')
      break
    case 'focus-algorithm':
      // 跳转到算法专项训练
      router.push('/dashboard/knowledge-base?category=algorithm')
      break
    case 'view-course':
      ElMessage.info('正在为您推荐课程...')
      break
    default:
      ElMessage.info('功能开发中...')
  }
}

const updateTaskStatus = async (task) => {
  if (task.completed) {
    dailyTasks.value.completed++
    todayStats.value.studyTime += task.duration
    todayStats.value.experience += task.experience
    ElMessage.success(`完成任务获得 ${task.experience} 经验！`)

    // TODO: 调用后端API更新任务状态
    // await apiService.learning.updateTaskStatus(task.id, task.completed)
  } else {
    dailyTasks.value.completed--
    todayStats.value.studyTime -= task.duration
    todayStats.value.experience -= task.experience
  }
}

const startTask = (task) => {
  switch (task.type) {
    case '面试模拟':
      router.push('/dashboard/interview-practice')
      break
    case '算法强化':
      router.push('/dashboard/knowledge-base?category=algorithm')
      break
    case '系统设计':
      router.push('/dashboard/knowledge-base?category=system')
      break
    default:
      ElMessage.info(`开始学习：${task.title}`)
  }
}

const viewRelatedQuestion = (task) => {
  if (task.relatedQuestion) {
    router.push({
      path: '/dashboard/knowledge-base',
      query: { questionId: task.relatedQuestion.id },
    })
  }
}

const handleTaskCommand = (command) => {
  const [action, taskId] = command.split('-')
  switch (action) {
    case 'skip':
      ElMessage.info('任务已跳过')
      break
    case 'schedule':
      ElMessage.info('已安排到稍后完成')
      break
    case 'feedback':
      ElMessage.info('任务反馈功能开发中...')
      break
  }
}

const refreshTasks = () => {
  ElMessage.info('正在为您刷新今日任务...')
  // TODO: 调用AI重新生成任务
}

const customizeTask = () => {
  showCustomTask.value = true
}

const completeAllTasks = () => {
  dailyTasks.value.tasks.forEach((task) => {
    if (!task.completed) {
      task.completed = true
      todayStats.value.studyTime += task.duration
      todayStats.value.experience += task.experience
    }
  })
  dailyTasks.value.completed = dailyTasks.value.total
  ElMessage.success('所有任务已完成！获得丰厚奖励！')
}

const analyzeWeakness = () => {
  ElMessage.info('AI正在重新分析您的薄弱环节...')
  // TODO: 调用AI分析接口
}

const startWeaknessTraining = (weakness) => {
  ElMessage.info(`开始${weakness.name}强化训练`)
  // 根据薄弱环节跳转到相应的学习模块
}

const viewWeaknessDetails = (weakness) => {
  router.push({
    path: '/dashboard/interview-performance',
    query: { focus: weakness.id },
  })
}

const scheduleTraining = (weakness) => {
  ElMessage.info(`已将${weakness.name}训练加入学习计划`)
}

const startResource = (resource) => {
  ElMessage.info(`开始学习：${resource.title}`)
  // TODO: 跳转到资源详情页或学习页面
}

const switchPath = (pathId) => {
  ElMessage.info(`已切换到：${availablePaths.value.find((p) => p.id === pathId)?.name}`)
  // TODO: 加载对应的学习路径
}

const createCustomPath = () => {
  ElMessage.info('自定义学习路径功能开发中...')
}

const viewModule = (module) => {
  ElMessage.info(`查看模块：${module.name}`)
}

const continueModule = (module) => {
  ElMessage.info(`继续学习：${module.name}`)
  // TODO: 跳转到具体的学习内容
}

const continueStage = (stage) => {
  ElMessage.info(`继续学习阶段：${stage.name}`)
}

const skipStage = (stage) => {
  ElMessage.confirm(`确定要跳过"${stage.name}"阶段吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('已跳过当前阶段')
  })
}

const adjustStage = (stage) => {
  ElMessage.info(`调整阶段：${stage.name}`)
}

const refreshRecommendations = () => {
  ElMessage.info('正在更新个性化推荐...')
}

const viewInterviewDetails = (interview) => {
  router.push(`/dashboard/history?interview=${interview.id}`)
}

const startRecommendation = (recommendation) => {
  ElMessage.info(`开始学习：${recommendation.title}`)
}

const collectResource = (resource) => {
  ElMessage.success(`已收藏：${resource.title}`)
}

const startProject = (project) => {
  ElMessage.info(`开始项目：${project.title}`)
}

const previewProject = (project) => {
  ElMessage.info(`预览项目：${project.title}`)
}

const practiceQuestion = (question) => {
  router.push({
    path: '/dashboard/knowledge-base',
    query: { questionId: question.id },
  })
}

const createCustomTask = () => {
  ElMessage.success('自定义任务已创建')
  showCustomTask.value = false
  // TODO: 创建自定义任务逻辑
}

onMounted(() => {
  // TODO: 加载用户学习数据
  // loadPersonalizedData()
})
</script>

<style scoped>
.personalized-learning-container {
  max-width: 1400px;
  margin: 0 auto;
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

/* 学习概览仪表板 */
.dashboard-overview {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

/* 概览卡片 */
.overview-card {
  display: flex;
  align-items: center;
  padding: 30px;
  gap: 40px;
}

.overview-left {
  flex: 1;
}

.overview-left h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.overview-left h4 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.overview-left p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.plan-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 25px;
  color: var(--text-secondary);
  font-size: 14px;
}

.plan-meta span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.overview-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.progress-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-text .percentage {
  font-size: 2rem;
  font-weight: bold;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.progress-text .label {
  font-size: 14px;
  color: var(--text-secondary);
}

.progress-details {
  display: flex;
  gap: 20px;
}

.detail-item {
  text-align: center;
}

.detail-value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-primary);
}

.detail-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
}

/* AI分析建议 */
.ai-insights {
  padding: 25px;
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.insights-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
}

.insights-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.insight-text {
  flex: 1;
}

.insight-text h5 {
  color: var(--text-primary);
  margin: 0 0 5px 0;
  font-size: 14px;
}

.insight-text p {
  color: var(--text-secondary);
  margin: 0 0 10px 0;
  font-size: 13px;
  line-height: 1.5;
}

/* 今日任务 */
.daily-tasks {
  padding: 30px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0;
}

.header-right {
  display: flex;
  gap: 10px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 25px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.task-item.completed {
  opacity: 0.7;
  background: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.3);
}

.task-item.priority {
  border-color: rgba(245, 108, 108, 0.3);
}

.task-left {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.task-content {
  flex: 1;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.task-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.task-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.task-content p {
  margin: 0 0 15px 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.task-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

.task-duration,
.task-difficulty,
.task-reward {
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-skills {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.skills-label {
  color: var(--text-secondary);
  font-size: 13px;
}

.task-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 20px;
}

.tasks-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.summary-stats {
  display: flex;
  gap: 30px;
  color: var(--text-secondary);
  font-size: 14px;
}

/* 薄弱环节训练 */
.weakness-training {
  padding: 30px;
  margin-bottom: 30px;
}

.weakness-training h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0;
}

.weakness-areas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.weakness-card {
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.weakness-card.urgent {
  border-color: rgba(245, 108, 108, 0.3);
}

.weakness-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.weakness-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weakness-info {
  flex: 1;
}

.weakness-info h4 {
  color: var(--text-primary);
  margin: 0 0 5px 0;
}

.weakness-info p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.weakness-details {
  margin-bottom: 20px;
}

.detail-section {
  margin-bottom: 15px;
}

.detail-section h5 {
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-size: 14px;
}

.detail-section ul {
  margin: 0;
  padding-left: 15px;
  color: var(--text-secondary);
  font-size: 13px;
}

.detail-section li {
  margin-bottom: 5px;
}

.recommended-resources {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
}

.resource-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.weakness-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 学习路径 */
.learning-path {
  padding: 30px;
  margin-bottom: 30px;
}

.learning-path h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0;
}

.path-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.path-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.path-stage {
  display: flex;
  gap: 30px;
  position: relative;
}

.stage-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.marker-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-weight: bold;
  z-index: 1;
}

.path-stage.current .marker-dot {
  background: var(--gradient-tech);
  border-color: transparent;
  color: white;
}

.path-stage.completed .marker-dot {
  background: #67c23a;
  border-color: transparent;
  color: white;
}

.marker-line {
  width: 2px;
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  margin: 5px 0;
}

.path-stage.completed .marker-line {
  background: #67c23a;
}

.stage-content {
  flex: 1;
  padding-bottom: 40px;
}

.stage-header {
  margin-bottom: 15px;
}

.stage-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.stage-title h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
}

.stage-badges {
  display: flex;
  gap: 8px;
}

.stage-description {
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
}

.stage-modules {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.module-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 18px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.module-item.current {
  background: rgba(64, 158, 255, 0.1);
  border-left: 3px solid var(--primary-color);
}

.module-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.module-name {
  color: var(--text-primary);
  font-weight: 500;
}

.module-meta {
  color: var(--text-secondary);
  font-size: 12px;
}

.stage-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 基于对话的推荐 */
.conversation-based {
  padding: 30px;
  margin-bottom: 30px;
}

.conversation-based h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0;
}

.conversation-insights {
  margin-top: 20px;
}

.insight-summary {
  margin-bottom: 25px;
}

.insight-summary h4 {
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.insight-summary p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.interview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.interview-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interview-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.interview-header h5 {
  color: var(--text-primary);
  margin: 0;
}

.interview-score {
  margin-bottom: 15px;
}

.interview-recommendations h6 {
  color: var(--text-primary);
  margin: 0 0 10px 0;
  font-size: 14px;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
}

.recommendation-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 推荐资源 */
.recommended-resources {
  margin-bottom: 30px;
}

.recommended-resources h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.resource-card {
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.resource-thumbnail {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.resource-thumbnail .el-image {
  width: 100%;
  height: 100%;
}

.resource-duration,
.resource-level {
  position: absolute;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  border-radius: 4px;
}

.resource-duration {
  top: 10px;
  right: 10px;
}

.resource-level {
  top: 10px;
  left: 10px;
}

.resource-info {
  padding: 20px;
}

.resource-info h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.resource-info p {
  color: var(--text-secondary);
  margin: 0 0 15px 0;
  line-height: 1.6;
  font-size: 14px;
}

.resource-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  font-size: 13px;
  color: var(--text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.resource-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.resource-progress {
  margin-bottom: 15px;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 5px;
}

.resource-action {
  padding: 0 20px 20px;
  display: flex;
  gap: 10px;
}

/* 项目卡片特殊样式 */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
}

.project-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-details {
  margin-top: 15px;
}

.detail-item {
  margin-bottom: 8px;
}

.detail-label {
  color: var(--text-secondary);
  font-size: 13px;
}

.detail-value {
  color: var(--text-primary);
  font-size: 13px;
}

/* 问题推荐 */
.question-recommendations {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.question-recommendation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-recommendation:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.question-content {
  flex: 1;
}

.question-content h4 {
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.question-content p {
  color: var(--text-secondary);
  margin: 0 0 10px 0;
  font-size: 14px;
}

.question-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 13px;
  color: var(--text-secondary);
}

/* 学习成就 */
.achievements {
  padding: 30px;
}

.achievements h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.achievement-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 25px;
}

.level-info {
  flex: 1;
}

.current-level {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 15px;
}

.level-number {
  font-size: 2rem;
  font-weight: bold;
  background: var(--gradient-tech);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.level-name {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.level-progress {
  max-width: 300px;
}

.exp-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 5px;
}

.next-reward {
  text-align: right;
}

.next-reward h5 {
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.next-reward p {
  color: var(--text-secondary);
  margin: 0 0 5px 0;
  font-size: 14px;
}

.reward-progress {
  font-size: 12px;
  color: var(--primary-color);
}

.achievement-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.achievement-item:not(.unlocked) {
  opacity: 0.6;
}

.achievement-item.unlocked {
  background: rgba(103, 194, 58, 0.1);
}

.achievement-item.recent::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: var(--gradient-tech);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}

.achievement-icon {
  position: relative;
  flex-shrink: 0;
}

.new-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--gradient-primary);
  color: white;
  font-size: 8px;
  padding: 2px 4px;
  border-radius: 6px;
  font-weight: bold;
}

.achievement-info {
  flex: 1;
}

.achievement-info h5 {
  margin: 0 0 5px 0;
  color: var(--text-primary);
}

.achievement-info p {
  margin: 0 0 10px 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.achievement-progress {
  margin-bottom: 5px;
}

.unlock-time {
  font-size: 12px;
  color: var(--text-muted);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-overview {
    grid-template-columns: 1fr;
  }

  .overview-card {
    flex-direction: column;
    text-align: center;
  }

  .overview-right {
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .task-item {
    flex-direction: column;
    gap: 15px;
  }

  .task-actions {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
  }

  .weakness-areas {
    grid-template-columns: 1fr;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .achievement-overview {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .next-reward {
    text-align: center;
  }

  .achievement-list {
    grid-template-columns: 1fr;
  }
}
</style>
