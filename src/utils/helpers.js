import dayjs from 'dayjs'

export const formatDate = (date, format = 'MMM DD, YYYY') => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date, format = 'MMM DD, YYYY hh:mm A') => {
  return dayjs(date).format(format)
}

export const formatTime = (time, format = 'hh:mm A') => {
  return dayjs(time, 'HH:mm:ss').format(format)
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const calculateAge = (dateOfBirth) => {
  return dayjs().diff(dayjs(dateOfBirth), 'year')
}

export const getFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`.trim()
}

export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/
  return re.test(phone.replace(/\D/g, ''))
}

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'scheduled':
    case 'completed':
    case 'paid':
      return 'success'
    case 'pending':
    case 'in progress':
    case 'partially paid':
      return 'warning'
    case 'cancelled':
    case 'no show':
    case 'inactive':
      return 'error'
    default:
      return 'default'
  }
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const parseErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'An unexpected error occurred'
}
