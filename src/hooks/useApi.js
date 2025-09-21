import { useState, useEffect } from 'react'
import api from '../services/api'

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { immediate = true, method = 'GET', ...fetchOptions } = options

  const execute = async (overrideUrl = null, overrideOptions = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const requestUrl = overrideUrl || url
      const requestOptions = { ...fetchOptions, ...overrideOptions }
      
      let response
      switch (method.toUpperCase()) {
        case 'GET':
          response = await api.get(requestUrl, requestOptions)
          break
        case 'POST':
          response = await api.post(requestUrl, requestOptions.data, requestOptions)
          break
        case 'PUT':
          response = await api.put(requestUrl, requestOptions.data, requestOptions)
          break
        case 'DELETE':
          response = await api.delete(requestUrl, requestOptions)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
      
      setData(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate && url) {
      execute()
    }
  }, [url, immediate])

  return {
    data,
    loading,
    error,
    execute,
    refetch: () => execute()
  }
}

export default useApi
