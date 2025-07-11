/**
 * API服务层 - 统一管理所有API请求
 * 使用RESTful风格，方便后续与后端对接
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router' // 引入 router

// API基础配置, 从环境变量获取，方便部署
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 统一添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  // 对2xx范围内的状态码触发该函数
  (response) => {
    // 后端返回的数据结构如果是 { code, data, message }，可以这样处理
    // 直接返回 data，简化后续操作
    return response.data
  },
  // 超出2xx范围的状态码触发该函数
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token过期或无效
          ElMessage.error('登录已过期，请重新登录')
          localStorage.clear() // 清除所有本地存储
          router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误，请稍后重试')
          break
        default:
          // 从后端返回的错误信息中取 detail
          ElMessage.error(error.response.data.detail || '请求失败')
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      ElMessage.error('网络连接失败，请检查您的网络')
    } else {
      // 发送请求时出了点问题
      ElMessage.error('请求发送失败')
    }
    return Promise.reject(error)
  },
)

/**
 * API服务类 - 封装所有API请求
 * 注意：这里我们定义了真实的API调用，你需要确保后端有对应的接口。
 */
class ApiService {
  auth = {
    /**
     * 用户登录
     * @param {Object} credentials - {username, password}
     */
    login: (credentials) => apiClient.post('/auth/login', credentials),

    /**
     * 用户注册
     * @param {Object} userData - {username, password, email}
     */
    register: (userData) => apiClient.post('/auth/register', userData),
  }

  user = {
    /**
     * 获取当前登录用户的资料
     * GET /users/me
     */
    getProfile: () => apiClient.get('/users/me'),

    /**
     * 更新当前登录用户的资料
     * PUT /users/me
     * @param {Object} profileData - 用户资料
     */
    updateProfile: (profileData) => apiClient.put('/users/me', profileData),
  }

  /**
   * 简历相关API
   */
  resume = {
    /**
     * 获取简历列表
     * GET /resumes
     * @returns {Promise} - 简历列表
     */
    getList: () => {
      // TODO: 后端实现后启用
      // return apiClient.get('/resumes')

      // 返回模拟数据
      return Promise.resolve([
        {
          id: 1,
          name: '张三_前端开发_简历.pdf',
          size: 262144,
          uploadTime: '2024-01-15',
          isActive: true,
          parsed: {
            name: '张三',
            position: '前端开发工程师',
            skills: ['Vue.js', 'React', 'Node.js'],
          },
        },
      ])
    },

    /**
     * 上传简历
     * POST /resumes
     * @param {FormData} formData - 包含简历文件
     * @returns {Promise}
     */
    upload: (formData) => {
      return apiClient.post('/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },

    /**
     * 删除简历
     * DELETE /resumes/{id}
     * @param {Number} id - 简历ID
     * @returns {Promise}
     */
    delete: (id) => {
      return apiClient.delete(`/resumes/${id}`)
    },

    /**
     * 设置默认简历
     * PUT /resumes/{id}/activate
     * @param {Number} id - 简历ID
     * @returns {Promise}
     */
    setActive: (id) => {
      return apiClient.put(`/resumes/${id}/activate`)
    },
  }

  /**
   * 面试相关API
   */
  interview = {
    /**
     * 开始面试
     * POST /interviews/start
     * @param {Object} config - {type, position, difficulty}
     * @returns {Promise} - {interviewId, questions}
     */
    start: () => {
      // TODO: 后端实现后启用
      // return apiClient.post('/interviews/start', config)

      // 返回模拟数据
      return Promise.resolve({
        interviewId: 'mock-' + Date.now(),
        questions: [
          {
            id: 1,
            text: '请做一下自我介绍',
            type: 'behavioral',
            duration: 180,
          },
        ],
      })
    },

    /**
     * 提交回答
     * POST /interviews/{id}/answer
     * @param {String} interviewId - 面试ID
     * @param {Object} answer - {questionId, audioUrl, videoUrl, transcript}
     * @returns {Promise} - {feedback}
     */
    submitAnswer: (interviewId, answer) => {
      return apiClient.post(`/interviews/${interviewId}/answer`, answer)
    },

    /**
     * 结束面试
     * POST /interviews/{id}/end
     * @param {String} interviewId - 面试ID
     * @returns {Promise} - {reportId}
     */
    end: (interviewId) => {
      return apiClient.post(`/interviews/${interviewId}/end`)
    },

    /**
     * 获取面试历史
     * GET /interviews/history
     * @param {Object} params - {page, pageSize}
     * @returns {Promise} - {list, total}
     */
    getHistory: () => {
      // TODO: 后端实现后启用
      // return apiClient.get('/interviews/history')

      // 返回模拟数据
      return Promise.resolve({
        list: [
          {
            id: 1,
            type: 'practice',
            position: '前端开发',
            date: '2024-01-20',
            duration: 1800,
            score: 85,
            status: 'completed',
          },
        ],
        total: 1,
      })
    },
  }

  /**
   * 分析报告相关API
   */
  analysis = {
    /**
     * 获取面试报告
     * GET /analysis/report/{interviewId}
     * @param {String} interviewId - 面试ID
     * @returns {Promise} - 详细报告
     */
    getReport: () => {
      // TODO: 后端实现后启用
      // return apiClient.get(`/analysis/report/${interviewId}`)

      // 返回模拟数据
      return Promise.resolve({
        overall: 85,
        dimensions: {
          professional: 90,
          expression: 85,
          logic: 88,
          adaptability: 82,
          attitude: 80,
        },
        feedback: {
          pros: ['表达清晰', '逻辑性强'],
          cons: ['需要更多实际案例'],
          suggestions: ['建议补充项目经验'],
        },
      })
    },

    /**
     * 获取能力趋势
     * GET /analysis/trends
     * @returns {Promise} - 能力变化趋势
     */
    getTrends: () => {
      return apiClient.get('/analysis/trends')
    },
  }

  /**
   * 题库相关API
   */
  question = {
    /**
     * 获取题目列表
     * GET /questions
     * @param {Object} params - {position, type, difficulty}
     * @returns {Promise} - 题目列表
     */
    getList: () => {
      // TODO: 后端实现后启用
      // return apiClient.get('/questions', { params })

      // 返回模拟数据
      return Promise.resolve([
        {
          id: 1,
          category: '技术基础',
          question: '请解释一下Vue3的Composition API',
          difficulty: 'medium',
          tags: ['Vue.js', '前端框架'],
        },
      ])
    },

    /**
     * 获取岗位要求
     * GET /questions/positions/{type}
     * @param {String} type - 岗位类型
     * @returns {Promise} - 岗位详情
     */
    getPositionInfo: (type) => {
      // TODO: 后端实现后启用
      // return apiClient.get(`/questions/positions/${type}`)

      // 返回模拟数据
      const positions = {
        it: {
          title: '互联网IT岗位',
          description: '包括前端、后端、算法等技术岗位',
          requirements: ['扎实的编程基础', '良好的学习能力', '团队协作精神'],
          skills: ['编程语言', '数据结构', '网络协议', '数据库'],
        },
        finance: {
          title: '金融行业岗位',
          description: '包括投资、风控、数据分析等岗位',
          requirements: ['金融专业知识', '数据分析能力', '风险意识'],
          skills: ['财务分析', '数据建模', 'Excel/Python', '行业研究'],
        },
        education: {
          title: '教育行业岗位',
          description: '包括教师、教研、运营等岗位',
          requirements: ['教育理念', '沟通能力', '耐心细致'],
          skills: ['学科知识', '教学设计', '班级管理', '家长沟通'],
        },
      }
      return Promise.resolve(positions[type] || {})
    },
  }

  /**
   * WebSocket连接管理
   */
  websocket = {
    /**
     * 建立WebSocket连接
     * @param {String} interviewId - 面试ID
     * @returns {WebSocket}
     */
    connect: (interviewId) => {
      const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws/interview/${interviewId}`
      return new WebSocket(wsUrl)
    },
  }
}

// 导出单例
export default new ApiService()
