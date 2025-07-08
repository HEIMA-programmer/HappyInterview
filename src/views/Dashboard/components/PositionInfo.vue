<template>
  <div class="position-info-container">
    <div class="page-header">
      <h2 class="page-title">{{ positionData.title }}</h2>
      <p class="page-subtitle">{{ positionData.description }}</p>
    </div>

    <!-- 岗位概览 -->
    <div class="position-overview glass-card">
      <div class="overview-grid">
        <div class="overview-item">
          <el-icon :size="40" color="#409eff"><Money /></el-icon>
          <div class="item-info">
            <h4>薪资范围</h4>
            <p>{{ positionData.salary }}</p>
          </div>
        </div>
        <div class="overview-item">
          <el-icon :size="40" color="#67c23a"><TrendCharts /></el-icon>
          <div class="item-info">
            <h4>需求趋势</h4>
            <p>{{ positionData.trend }}</p>
          </div>
        </div>
        <div class="overview-item">
          <el-icon :size="40" color="#e6a23c"><Briefcase /></el-icon>
          <div class="item-info">
            <h4>职位数量</h4>
            <p>{{ positionData.jobCount }}</p>
          </div>
        </div>
        <div class="overview-item">
          <el-icon :size="40" color="#f56c6c"><School /></el-icon>
          <div class="item-info">
            <h4>学历要求</h4>
            <p>{{ positionData.education }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心要求 -->
    <div class="requirements-section">
      <div class="section-left glass-card">
        <h3>核心技能要求</h3>
        <div class="skill-list">
          <div
            v-for="skill in positionData.coreSkills"
            :key="skill.name"
            class="skill-item"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <el-tag :type="getSkillTagType(skill.level)" size="small">
                {{ skill.level }}
              </el-tag>
            </div>
            <el-progress
              :percentage="skill.importance"
              :color="getProgressColor(skill.importance)"
            />
            <p class="skill-desc">{{ skill.description }}</p>
          </div>
        </div>
      </div>

      <div class="section-right glass-card">
        <h3>软技能要求</h3>
        <div class="soft-skills">
          <div
            v-for="skill in positionData.softSkills"
            :key="skill"
            class="soft-skill-item"
          >
            <el-icon><CircleCheck /></el-icon>
            <span>{{ skill }}</span>
          </div>
        </div>

        <div class="experience-req">
          <h4>经验要求</h4>
          <p>{{ positionData.experience }}</p>
        </div>
      </div>
    </div>

    <!-- 职业发展路径 -->
    <div class="career-path glass-card">
      <h3>职业发展路径</h3>
      <div class="path-diagram">
        <div
          v-for="(stage, index) in positionData.careerPath"
          :key="stage.level"
          class="career-stage"
        >
          <div class="stage-card" :class="{ current: stage.isCurrent }">
            <h4>{{ stage.title }}</h4>
            <p class="stage-years">{{ stage.years }}</p>
            <p class="stage-salary">{{ stage.salary }}</p>
            <ul class="stage-skills">
              <li v-for="skill in stage.keySkills" :key="skill">
                {{ skill }}
              </li>
            </ul>
          </div>
          <el-icon v-if="index < positionData.careerPath.length - 1" :size="30">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 典型工作内容 -->
    <div class="work-content glass-card">
      <h3>典型工作内容</h3>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="日常工作" name="daily">
          <ul class="work-list">
            <li v-for="(item, index) in positionData.dailyWork" :key="index">
              <el-icon><Checked /></el-icon>
              <span>{{ item }}</span>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="项目案例" name="projects">
          <div class="project-examples">
            <div
              v-for="project in positionData.projectExamples"
              :key="project.name"
              class="project-card"
            >
              <h4>{{ project.name }}</h4>
              <p>{{ project.description }}</p>
              <div class="project-tech">
                <el-tag
                  v-for="tech in project.technologies"
                  :key="tech"
                  size="small"
                  type="info"
                >
                  {{ tech }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="工具技术栈" name="tools">
          <div class="tech-stack">
            <div
              v-for="category in positionData.techStack"
              :key="category.name"
              class="tech-category"
            >
              <h4>{{ category.name }}</h4>
              <div class="tech-items">
                <el-tag
                  v-for="tech in category.items"
                  :key="tech"
                  type="primary"
                  effect="plain"
                >
                  {{ tech }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 面试准备建议 -->
    <div class="interview-tips glass-card">
      <h3>面试准备建议</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <el-icon :size="30" color="#409eff"><Reading /></el-icon>
          <h4>知识准备</h4>
          <ul>
            <li v-for="(tip, index) in positionData.preparationTips.knowledge" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>
        <div class="tip-card">
          <el-icon :size="30" color="#67c23a"><Notebook /></el-icon>
          <h4>项目准备</h4>
          <ul>
            <li v-for="(tip, index) in positionData.preparationTips.project" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>
        <div class="tip-card">
          <el-icon :size="30" color="#e6a23c"><ChatDotSquare /></el-icon>
          <h4>问题准备</h4>
          <ul>
            <li v-for="(tip, index) in positionData.preparationTips.questions" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 相关资源 -->
    <div class="related-resources glass-card">
      <h3>学习资源推荐</h3>
      <div class="resource-list">
        <div
          v-for="resource in positionData.resources"
          :key="resource.id"
          class="resource-item"
          @click="openResource(resource)"
        >
          <el-icon :size="24" :color="resource.color">
            <component :is="resource.icon" />
          </el-icon>
          <div class="resource-info">
            <h5>{{ resource.title }}</h5>
            <p>{{ resource.description }}</p>
          </div>
          <el-button type="primary" size="small">
            {{ resource.buttonText || '查看' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 行动按钮 -->
    <div class="action-section">
      <el-button type="primary" size="large" @click="startPractice">
        <el-icon><VideoCamera /></el-icon>
        开始模拟面试
      </el-button>
      <el-button size="large" @click="viewQuestions">
        <el-icon><Document /></el-icon>
        查看面试题库
      </el-button>
      <el-button size="large" @click="downloadGuide">
        <el-icon><Download /></el-icon>
        下载准备指南
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Money,
  TrendCharts,
  Briefcase,
  School,
  CircleCheck,
  ArrowRight,
  Checked,
  Reading,
  Notebook,
  ChatDotSquare,
  VideoCamera,
  Document,
  Download
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 当前标签页
const activeTab = ref('daily')

// 岗位数据（根据路由参数动态加载）
const positionData = ref({
  title: '互联网IT岗位',
  description: '涵盖前端、后端、算法等技术岗位的详细信息',
  salary: '15k-30k',
  trend: '需求持续增长',
  jobCount: '10000+',
  education: '本科及以上',
  coreSkills: [],
  softSkills: [],
  experience: '',
  careerPath: [],
  dailyWork: [],
  projectExamples: [],
  techStack: [],
  preparationTips: {
    knowledge: [],
    project: [],
    questions: []
  },
  resources: []
})

// 岗位数据映射
const positionDataMap = {
  it: {
    title: '互联网IT岗位',
    description: '涵盖前端、后端、算法等技术岗位的详细信息',
    salary: '15k-30k',
    trend: '需求持续增长',
    jobCount: '10000+',
    education: '本科及以上',
    coreSkills: [
      {
        name: '编程能力',
        level: '必备',
        importance: 95,
        description: '扎实的编程基础，熟练掌握至少一门编程语言'
      },
      {
        name: '数据结构与算法',
        level: '重要',
        importance: 85,
        description: '理解常用数据结构，能够分析算法复杂度'
      },
      {
        name: '计算机网络',
        level: '重要',
        importance: 80,
        description: '了解TCP/IP协议栈，HTTP协议等网络基础'
      },
      {
        name: '数据库',
        level: '必备',
        importance: 88,
        description: '熟悉关系型数据库，了解NoSQL数据库'
      }
    ],
    softSkills: ['学习能力强', '团队协作', '沟通表达', '逻辑思维', '抗压能力'],
    experience: '应届生或1-3年经验，根据具体岗位要求',
    careerPath: [
      {
        level: 1,
        title: '初级工程师',
        years: '0-2年',
        salary: '10k-18k',
        keySkills: ['基础开发', '代码规范', 'Bug修复'],
        isCurrent: true
      },
      {
        level: 2,
        title: '中级工程师',
        years: '2-5年',
        salary: '18k-30k',
        keySkills: ['独立开发', '技术选型', '性能优化']
      },
      {
        level: 3,
        title: '高级工程师',
        years: '5-8年',
        salary: '30k-50k',
        keySkills: ['架构设计', '技术攻关', '团队指导']
      },
      {
        level: 4,
        title: '技术专家',
        years: '8年+',
        salary: '50k+',
        keySkills: ['技术规划', '跨团队协作', '技术布道']
      }
    ],
    dailyWork: [
      '参与产品需求评审，提供技术方案',
      '编写高质量代码，进行代码审查',
      '解决技术难题，优化系统性能',
      '编写技术文档，分享技术经验',
      '与产品、设计、测试等团队协作'
    ],
    projectExamples: [
      {
        name: '电商平台开发',
        description: '负责商品详情页、购物车、订单系统等核心模块开发',
        technologies: ['Vue.js', 'Node.js', 'MySQL', 'Redis']
      },
      {
        name: '后台管理系统',
        description: '搭建企业级后台管理系统，包括权限管理、数据统计等',
        technologies: ['React', 'TypeScript', 'Ant Design', 'ECharts']
      }
    ],
    techStack: [
      {
        name: '前端技术',
        items: ['HTML/CSS', 'JavaScript', 'Vue.js', 'React', 'TypeScript']
      },
      {
        name: '后端技术',
        items: ['Node.js', 'Java', 'Python', 'Go', 'PHP']
      },
      {
        name: '数据库',
        items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis']
      },
      {
        name: '工具链',
        items: ['Git', 'Webpack', 'Docker', 'CI/CD', 'Linux']
      }
    ],
    preparationTips: {
      knowledge: [
        '复习计算机基础知识：数据结构、算法、网络、操作系统',
        '深入理解所使用技术栈的原理和最佳实践',
        '了解最新的技术趋势和行业动态'
      ],
      project: [
        '准备2-3个核心项目的详细介绍',
        '梳理项目中的技术难点和解决方案',
        '量化项目成果，准备具体数据支撑'
      ],
      questions: [
        '准备常见技术面试题的回答',
        '准备行为面试题（STAR法则）',
        '准备向面试官提问的问题'
      ]
    },
    resources: [
      {
        id: 1,
        icon: 'Link',
        color: '#409eff',
        title: 'LeetCode算法练习',
        description: '提升算法能力的最佳平台',
        url: 'https://leetcode.cn/',
        buttonText: '立即练习'
      },
      {
        id: 2,
        icon: 'Document',
        color: '#67c23a',
        title: 'MDN Web文档',
        description: 'Web开发最权威的技术文档',
        url: 'https://developer.mozilla.org/zh-CN/',
        buttonText: '查看文档'
      },
      {
        id: 3,
        icon: 'Collection',
        color: '#e6a23c',
        title: 'GitHub热门项目',
        description: '学习优秀开源项目源码',
        url: 'https://github.com/trending',
        buttonText: '浏览项目'
      }
    ]
  },
  finance: {
    title: '金融行业岗位',
    description: '包括投资分析、风险控制、数据分析等金融相关岗位',
    salary: '20k-40k',
    trend: '稳定需求',
    jobCount: '5000+',
    education: '本科及以上，金融相关专业优先',
    coreSkills: [
      {
        name: '金融知识',
        level: '必备',
        importance: 90,
        description: '扎实的金融理论基础，了解金融市场和产品'
      },
      {
        name: '数据分析',
        level: '必备',
        importance: 92,
        description: '熟练使用Excel、Python等工具进行数据分析'
      },
      {
        name: '风险意识',
        level: '重要',
        importance: 88,
        description: '具备风险识别和评估能力'
      },
      {
        name: '财务建模',
        level: '重要',
        importance: 85,
        description: '能够建立财务模型，进行估值分析'
      }
    ],
    softSkills: ['严谨细致', '抗压能力', '商业敏感', '团队合作', '持续学习'],
    experience: '1-3年金融行业经验优先，优秀应届生亦可',
    careerPath: [
      {
        level: 1,
        title: '分析师',
        years: '0-3年',
        salary: '15k-25k',
        keySkills: ['数据分析', '报告撰写', '市场研究'],
        isCurrent: true
      },
      {
        level: 2,
        title: '高级分析师',
        years: '3-5年',
        salary: '25k-40k',
        keySkills: ['独立研究', '客户沟通', '项目管理']
      },
      {
        level: 3,
        title: '经理/总监',
        years: '5-10年',
        salary: '40k-80k',
        keySkills: ['团队管理', '战略规划', '业务拓展']
      },
      {
        level: 4,
        title: '合伙人/VP',
        years: '10年+',
        salary: '80k+',
        keySkills: ['决策制定', '资源整合', '行业影响力']
      }
    ],
    dailyWork: [
      '市场研究和行业分析',
      '财务数据分析和建模',
      '投资项目评估和尽职调查',
      '撰写研究报告和投资建议',
      '客户沟通和关系维护'
    ],
    projectExamples: [
      {
        name: 'IPO项目',
        description: '参与企业上市辅导，进行财务分析和估值',
        technologies: ['Excel建模', 'Wind数据库', 'Python分析']
      },
      {
        name: '并购重组',
        description: '负责目标公司尽职调查，评估并购方案',
        technologies: ['财务分析', '法律合规', '估值模型']
      }
    ],
    techStack: [
      {
        name: '分析工具',
        items: ['Excel', 'Python', 'R', 'SAS', 'MATLAB']
      },
      {
        name: '数据库',
        items: ['Wind', 'Bloomberg', 'Reuters', 'CEIC']
      },
      {
        name: '专业软件',
        items: ['估值模型', '风控系统', 'CRM', 'ERP']
      }
    ],
    preparationTips: {
      knowledge: [
        '复习金融基础知识：公司金融、投资学、衍生品等',
        '了解最新的金融市场动态和监管政策',
        '准备相关的资格证书：CPA、CFA、FRM等'
      ],
      project: [
        '准备具体的项目案例和分析框架',
        '整理自己的研究报告或分析作品',
        '准备展示数据分析和建模能力'
      ],
      questions: [
        '准备估值、财务分析等专业问题',
        '准备市场观点和投资理念阐述',
        '准备职业规划和发展目标'
      ]
    },
    resources: [
      {
        id: 1,
        icon: 'Link',
        color: '#409eff',
        title: 'CFA官方网站',
        description: '金融分析师必备认证',
        url: 'https://www.cfainstitute.org/',
        buttonText: '了解更多'
      },
      {
        id: 2,
        icon: 'Document',
        color: '#67c23a',
        title: '万得资讯(Wind)',
        description: '专业金融数据和分析平台',
        url: 'https://www.wind.com.cn/',
        buttonText: '访问平台'
      },
      {
        id: 3,
        icon: 'TrendCharts',
        color: '#e6a23c',
        title: '东方财富网',
        description: '专业财经资讯和投资工具',
        url: 'http://www.eastmoney.com/',
        buttonText: '查看资讯'
      }
    ]
  },
  education: {
    title: '教育行业岗位',
    description: '包括教师、教研、教育产品运营等教育相关岗位',
    salary: '8k-20k',
    trend: '在线教育蓬勃发展',
    jobCount: '8000+',
    education: '本科及以上，师范类或相关专业优先',
    coreSkills: [
      {
        name: '学科知识',
        level: '必备',
        importance: 95,
        description: '扎实的学科专业知识，持续更新知识体系'
      },
      {
        name: '教学能力',
        level: '必备',
        importance: 93,
        description: '能够设计课程，运用多种教学方法'
      },
      {
        name: '沟通能力',
        level: '重要',
        importance: 90,
        description: '与学生、家长、同事的有效沟通'
      },
      {
        name: '教育技术',
        level: '重要',
        importance: 82,
        description: '熟悉在线教育工具和平台'
      }
    ],
    softSkills: ['耐心细致', '责任心强', '创新思维', '亲和力', '持续学习'],
    experience: '有教学经验优先，优秀应届生可培养',
    careerPath: [
      {
        level: 1,
        title: '初级教师',
        years: '0-2年',
        salary: '6k-10k',
        keySkills: ['基础教学', '班级管理', '作业批改'],
        isCurrent: true
      },
      {
        level: 2,
        title: '骨干教师',
        years: '3-5年',
        salary: '10k-15k',
        keySkills: ['教学创新', '教研活动', '竞赛辅导']
      },
      {
        level: 3,
        title: '学科带头人',
        years: '5-10年',
        salary: '15k-25k',
        keySkills: ['课程设计', '教师培训', '教学研究']
      },
      {
        level: 4,
        title: '教学总监',
        years: '10年+',
        salary: '25k+',
        keySkills: ['教学管理', '课程体系', '团队建设']
      }
    ],
    dailyWork: [
      '备课和教案设计',
      '课堂教学和辅导答疑',
      '作业批改和学情分析',
      '家校沟通和家长会',
      '教研活动和培训学习'
    ],
    projectExamples: [
      {
        name: '在线课程开发',
        description: '设计和录制系列在线课程，服务数千名学生',
        technologies: ['课程设计', '视频录制', '互动教学']
      },
      {
        name: '教学创新项目',
        description: '运用新技术改进教学方法，提升学习效果',
        technologies: ['智能题库', 'AI助教', '数据分析']
      }
    ],
    techStack: [
      {
        name: '教学工具',
        items: ['PPT', 'Keynote', '希沃白板', '钉钉']
      },
      {
        name: '在线平台',
        items: ['腾讯会议', 'ClassIn', 'Zoom', '学习通']
      },
      {
        name: '教学软件',
        items: ['几何画板', 'GeoGebra', 'Scratch', 'Python']
      }
    ],
    preparationTips: {
      knowledge: [
        '深入复习学科知识，关注教材变化',
        '了解教育理论和教学方法',
        '关注教育政策和行业趋势'
      ],
      project: [
        '准备试讲内容和教学设计',
        '整理教学成果和学生反馈',
        '准备创新教学案例'
      ],
      questions: [
        '准备教育理念和教学方法问题',
        '准备班级管理和师生关系处理',
        '准备对教育行业的理解和展望'
      ]
    },
    resources: [
      {
        id: 1,
        icon: 'School',
        color: '#409eff',
        title: '中国教师资格网',
        description: '教师资格证考试官方网站',
        url: 'http://www.jszg.edu.cn/',
        buttonText: '考试报名'
      },
      {
        id: 2,
        icon: 'Document',
        color: '#67c23a',
        title: '学科网',
        description: '优质教学资源和素材',
        url: 'https://www.zxxk.com/',
        buttonText: '获取资源'
      },
      {
        id: 3,
        icon: 'VideoCamera',
        color: '#e6a23c',
        title: '中国大学MOOC',
        description: '在线教育平台和课程',
        url: 'https://www.icourse163.org/',
        buttonText: '学习课程'
      }
    ]
  }
}

// 获取技能标签类型
const getSkillTagType = (level) => {
  const map = {
    '必备': 'danger',
    '重要': 'warning',
    '了解': 'info'
  }
  return map[level] || 'info'
}

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage >= 90) return '#f56c6c'
  if (percentage >= 80) return '#e6a23c'
  if (percentage >= 70) return '#409eff'
  return '#909399'
}

// 开始练习
const startPractice = () => {
  router.push({
    path: '/dashboard/interview-simulation',
    query: { position: route.params.type }
  })
}

// 查看题库
const viewQuestions = () => {
  router.push({
    path: '/dashboard/knowledge-base',
    query: { position: route.params.type }
  })
}

// 下载指南
const downloadGuide = () => {
  const guideName = `${positionData.value.title}面试准备指南.pdf`

  // TODO: 实现真实的下载功能
  // const response = await apiService.position.downloadGuide(route.params.type)
  // downloadFile(response, guideName)

  ElMessage.success(`正在生成${guideName}...`)
  setTimeout(() => {
    ElMessage.info('指南生成完成，已开始下载')
    // 模拟下载
    const link = document.createElement('a')
    link.download = guideName
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('面试准备指南内容...')
    link.click()
  }, 2000)
}

// 打开资源
const openResource = (resource) => {
  if (resource.url) {
    window.open(resource.url, '_blank')
    ElMessage.success(`正在跳转到${resource.title}`)
  } else {
    ElMessage.info(`打开资源：${resource.title}`)
  }
}

// 加载岗位数据
const loadPositionData = async () => {
  const type = route.params.type || 'it'

  try {
    // TODO: 调用后端API获取岗位信息
    // const response = await apiService.position.getInfo(type)
    // positionData.value = response.data

    // 使用模拟数据
    if (positionDataMap[type]) {
      positionData.value = positionDataMap[type]
      ElMessage.success('岗位信息加载完成')
    } else {
      ElMessage.warning('未找到该岗位信息，显示默认内容')
      positionData.value = positionDataMap.it
    }
  } catch (error) {
    ElMessage.error('加载岗位信息失败')
    console.error('Load position data error:', error)
  }
}

onMounted(() => {
  loadPositionData()
})
</script>

<style scoped>
.position-info-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 岗位概览 */
.position-overview {
  padding: 30px;
  margin-bottom: 30px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.item-info h4 {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

.item-info p {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0;
}

/* 核心要求 */
.requirements-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.section-left,
.section-right {
  padding: 30px;
}

.requirements-section h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-item {
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.skill-name {
  font-weight: bold;
  color: var(--text-primary);
}

.skill-desc {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.soft-skills {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.soft-skill-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
}

.experience-req h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.experience-req p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 职业发展路径 */
.career-path {
  padding: 30px;
  margin-bottom: 30px;
}

.career-path h3 {
  font-size: 1.3rem;
  margin-bottom: 30px;
  color: var(--text-primary);
}

.path-diagram {
  display: flex;
  align-items: center;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
}

.career-stage {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stage-card {
  min-width: 200px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.stage-card.current {
  border-color: var(--primary-color);
  background: rgba(64, 158, 255, 0.1);
}

.stage-card h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.stage-years,
.stage-salary {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.stage-skills {
  margin: 10px 0 0 0;
  padding-left: 20px;
  font-size: 13px;
  color: var(--text-secondary);
}

/* 工作内容 */
.work-content {
  padding: 30px;
  margin-bottom: 30px;
}

.work-content h3 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.work-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.work-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  color: var(--text-primary);
  line-height: 1.6;
}

.project-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.project-card h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.project-card p {
  color: var(--text-secondary);
  margin-bottom: 15px;
  line-height: 1.6;
}

.project-tech {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-stack {
  display: grid;
  gap: 25px;
}

.tech-category h4 {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.tech-items {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 面试准备建议 */
.interview-tips {
  padding: 30px;
  margin-bottom: 30px;
}

.interview-tips h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.tip-card {
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.tip-card h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 15px 0;
}

.tip-card ul {
  margin: 0;
  padding-left: 20px;
}

.tip-card li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 8px;
}

/* 相关资源 */
.related-resources {
  padding: 30px;
  margin-bottom: 30px;
}

.related-resources h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: var(--text-primary);
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.resource-item:hover {
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.08);
}

.resource-info {
  flex: 1;
}

.resource-info h5 {
  font-size: 1rem;
  color: var(--text-primary);
  margin: 0 0 5px 0;
}

.resource-info p {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

/* 行动按钮 */
.action-section {
  text-align: center;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .requirements-section {
    grid-template-columns: 1fr;
  }

  .path-diagram {
    flex-direction: column;
    align-items: stretch;
  }

  .career-stage {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }

  .action-section {
    flex-direction: column;
    padding: 20px;
  }

  .action-section .el-button {
    width: 100%;
  }
}
</style>
