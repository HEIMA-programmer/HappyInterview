/**
 * 用户状态管理
 */
import { defineStore } from 'pinia';
import api from '@/api/service';
import router from '@/router';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    userInfo: null,
    isAuthenticated: !!localStorage.getItem('authToken'),
    hasProfile: localStorage.getItem('hasProfile') === 'true',
  }),

  getters: {
    username: (state) => state.userInfo?.username || '面试者',
    canStartInterview: (state) => state.isAuthenticated && state.hasProfile,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.auth.login(credentials);
        const { token, user } = response;

        this.token = token;
        this.userInfo = user;
        this.isAuthenticated = true;
        this.hasProfile = user.has_profile || false;

        localStorage.setItem('authToken', token);
        localStorage.setItem('hasProfile', String(this.hasProfile));

        return this.hasProfile;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async register(userData) {
      try {
        await api.auth.register(userData);
        return true;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },

    /**
     * 更新用户资料（合并了save和update的功能）
     * @param {Object} profileData - 用户资料
     */
    async updateProfile(profileData) {
      try {
        // 必须使用 const updatedUserData = 来接收 await 的返回结果
        const updatedUserData = await api.user.updateProfile(profileData);

        // 后续代码才能使用 updatedUserData 这个变量
        this.userInfo = updatedUserData;
        this.hasProfile = updatedUserData.has_profile || false;

        localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        localStorage.setItem('hasProfile', String(this.hasProfile));

        return updatedUserData;
      } catch (error) {
        // 如果上面的代码出错，比如 updatedUserData 未定义，就会进入这里
        console.error('Update profile failed:', error);
        throw error;
      }
    },

    logout() {
      this.token = null;
      this.userInfo = null;
      this.isAuthenticated = false;
      this.hasProfile = false;
      localStorage.clear();
      router.push('/login');
    },

    async fetchUserOnLoad() {
      if (this.isAuthenticated) {
        try {
          const userProfile = await api.user.getProfile();
          this.userInfo = userProfile;
          this.hasProfile = userProfile.has_profile || false;
          localStorage.setItem('hasProfile', String(this.hasProfile));
        } catch (error) {
          console.error("Failed to fetch user on load:", error);
        }
      }
    }
  }
});
