/**
 * 用户状态管理
 * 使用Pinia管理全局用户状态
 */

import { defineStore } from 'pinia'
import apiService from '@/api/service'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户基本信息
    userInfo: null,
    // 认证token
    token: localStorage.getItem('authToken') || null,
    // 是否已登录
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    // 是否已完善资料
    hasProfile: localStorage.getItem('hasProfile') === 'true',
    // 当前激活的简历
    activeResume: null,
    // 用户统计数据
    statistics: {
      interviewCount: 0,
      avgScore: 0,
      totalStudyHours: 0,
      completedCourses: 0
    }
  }),

  getters: {
    // 获取用户名
    username: (state) => state.userInfo?.username || '用户',

    // 获取用户ID
    userId: (state) => state.userInfo?.id || null,

    // 获取用户邮箱
    email: (state) => state.userInfo?.email || '',

    // 检查是否可以开始面试（需要登录且有简历）
    canStartInterview: (state) => state.isAuthenticated && state.activeResume !== null,

    // 获取用户等级（根据面试次数）
    userLevel: (state) => {
      const count = state.statistics.interviewCount
      if (count >= 100) return '面试达人'
      if (count >= 50) return '高级学员'
      if (count >= 20) return '中级学员'
      if (count >= 5) return '初级学员'
      return '新手'
    }
  },

  actions: {
    /**
     * 用户登录
     * @param {Object} credentials - {username, password}
     */
    async login(credentials) {
      try {
        const { token, user } = await apiService.auth.login(credentials)

        // 保存token和用户信息
        this.token = token
        this.userInfo = user
        this.isAuthenticated = true

        // 持久化存储
        localStorage.setItem('authToken', token)
        localStorage.setItem('isAuthenticated', 'true')

        // 加载用户资料
        await this.loadUserProfile()

        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    /**
     * 用户注册
     * @param {Object} userData - {username, password, email}
     */
    async register(userData) {
      try {
        await apiService.auth.register(userData)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    /**
     * 加载用户资料
     */
    async loadUserProfile() {
      try {
        const profile = await apiService.user.getProfile()
        if (profile && Object.keys(profile).length > 0) {
          this.userInfo = { ...this.userInfo, ...profile }
          this.hasProfile = true
          localStorage.setItem('hasProfile', 'true')
        }
      } catch (error) {
        console.error('加载用户资料失败:', error)
      }
    },

    /**
     * 更新用户资料
     * @param {Object} profile - 用户资料
     */
    async updateProfile(profile) {
      try {
        await apiService.user.updateProfile(profile)
        this.userInfo = { ...this.userInfo, ...profile }
        this.hasProfile = true
        localStorage.setItem('hasProfile', 'true')
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    /**
     * 设置当前激活的简历
     * @param {Object} resume - 简历信息
     */
    setActiveResume(resume) {
      this.activeResume = resume
      localStorage.setItem('activeResume', JSON.stringify(resume))
    },

    /**
     * 更新用户统计数据
     * @param {Object} stats - 统计数据
     */
    updateStatistics(stats) {
      this.statistics = { ...this.statistics, ...stats }
    },

    /**
     * 用户登出
     */
    logout() {
      // 清除状态
      this.userInfo = null
      this.token = null
      this.isAuthenticated = false
      this.hasProfile = false
      this.activeResume = null

      // 清除本地存储
      localStorage.removeItem('authToken')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('hasProfile')
      localStorage.removeItem('activeResume')
      localStorage.removeItem('userProfile')
    },

    /**
     * 刷新token
     */
    async refreshToken() {
      try {
        const { token } = await apiService.auth.refreshToken()
        this.token = token
        localStorage.setItem('authToken', token)
        return true
      } catch {
        // Token刷新失败，执行登出
        this.logout()
        return false
      }
    }
  }
})
