import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Container
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { LocalHospital } from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  
  const { login, error, clearError } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(formData)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '80vh',
          justifyContent: 'center'
        }}
      >
        <Card sx={{ width: '100%', p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography component="h1" variant="h5" gutterBottom>
                Hospital Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Box textAlign="center">
                <Link component={RouterLink} to="/register" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Demo Credentials:
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Admin: admin / password123
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Doctor: doctor1 / password123
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default Login
