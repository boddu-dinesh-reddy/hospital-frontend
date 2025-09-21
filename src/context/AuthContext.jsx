import React, { createContext, useContext, useReducer, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        const user = await authService.getProfile()
        dispatch({ type: 'AUTH_SUCCESS', payload: user })
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: null })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      dispatch({ type: 'AUTH_ERROR', payload: null })
    }
  }

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await authService.login(credentials)
      
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user })
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await authService.register(userData)
      
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user })
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage })
      throw error
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
