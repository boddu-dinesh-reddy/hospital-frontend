import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'
import { Box, Typography, Paper } from '@mui/material'

const ProtectedRoute = ({ children, permissions = [], roles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <Box p={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have permission to access this page.
          </Typography>
        </Paper>
      </Box>
    )
  }

  // For now, we'll implement basic role-based access
  // In a full implementation, you'd check permissions from the backend
  const hasPermission = () => {
    if (permissions.length === 0) return true
    if (user.role === 'Admin') return true // Admin has all permissions
    
    // Basic role-based permissions
    const rolePermissions = {
      Doctor: ['view_patients', 'view_appointments', 'create_appointments', 'update_appointments'],
      Nurse: ['view_patients', 'view_appointments'],
      Receptionist: ['view_patients', 'create_patients', 'view_appointments', 'create_appointments', 'view_billing']
    }
    
    const userPermissions = rolePermissions[user.role] || []
    return permissions.some(permission => userPermissions.includes(permission))
  }

  if (!hasPermission()) {
    return (
      <Box p={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Insufficient Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have the required permissions to access this feature.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return children
}

export default ProtectedRoute
