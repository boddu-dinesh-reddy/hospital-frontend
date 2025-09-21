import api from './api'

class AuthService {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data.data
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data.data
  }

  async logout(refreshToken) {
    const response = await api.post('/auth/logout', { refreshToken })
    return response.data
  }

  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data.data
  }

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response.data.data
  }
}

export default new AuthService()
