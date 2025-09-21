import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Paper,
  Button
} from '@mui/material'
import {
  CalendarMonth,
  Person,
  AccessTime,
  CheckCircle,
  Schedule
} from '@mui/icons-material'
import { formatDate, formatTime } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import appointmentService from '../../services/appointmentService'
import LoadingSpinner from '../common/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [todayAppointments, setTodayAppointments] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [stats, setStats] = useState({
    todayTotal: 0,
    todayCompleted: 0,
    todayPending: 0,
    upcoming: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctorData()
  }, [])

  const fetchDoctorData = async () => {
    try {
      setLoading(true)
      
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch today's appointments
      const todayRes = await appointmentService.getAllAppointments({
        doctorId: user.id,
        date: today,
        limit: 50
      })
      
      // Fetch upcoming appointments (next 7 days)
      const upcomingRes = await appointmentService.getAllAppointments({
        doctorId: user.id,
        limit: 10
      })

      setTodayAppointments(todayRes.appointments || [])
      setUpcomingAppointments(upcomingRes.appointments?.slice(0, 5) || [])
      
      // Calculate stats
      const todayAppts = todayRes.appointments || []
      setStats({
        todayTotal: todayAppts.length,
        todayCompleted: todayAppts.filter(a => a.status === 'Completed').length,
        todayPending: todayAppts.filter(a => a.status === 'Scheduled').length,
        upcoming: upcomingRes.pagination?.totalItems || 0
      })
    } catch (error) {
      console.error('Failed to fetch doctor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'In Progress': return 'warning'
      case 'Scheduled': return 'info'
      case 'Cancelled': return 'error'
      default: return 'default'
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Welcome back, Dr. {user?.lastName}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <CalendarMonth />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.todayTotal}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Appointments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.todayCompleted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                  <AccessTime />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.todayPending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.upcoming}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Appointments */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Today's Appointments</Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/schedule')}
                size="small"
              >
                View Schedule
              </Button>
            </Box>
            
            {todayAppointments.length === 0 ? (
              <Typography color="text.secondary">
                No appointments scheduled for today
              </Typography>
            ) : (
              <List>
                {todayAppointments.map((appointment) => (
                  <ListItem key={appointment.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {appointment.patient_first_name} {appointment.patient_last_name}
                          </Typography>
                          <Chip 
                            label={appointment.status} 
                            size="small" 
                            color={getStatusColor(appointment.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(appointment.appointment_time)} • {appointment.type}
                          </Typography>
                          {appointment.reason && (
                            <Typography variant="body2" color="text.secondary">
                              Reason: {appointment.reason}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions & Upcoming */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={() => navigate('/patients')}
                startIcon={<Person />}
              >
                View Patients
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/appointments')}
                startIcon={<CalendarMonth />}
              >
                All Appointments
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/schedule')}
                startIcon={<Schedule />}
              >
                Weekly Schedule
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            {upcomingAppointments.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                No upcoming appointments
              </Typography>
            ) : (
              <List dense>
                {upcomingAppointments.slice(0, 5).map((appointment) => (
                  <ListItem key={appointment.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {appointment.patient_first_name} {appointment.patient_last_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(appointment.appointment_date, 'MMM DD')} • {formatTime(appointment.appointment_time)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DoctorDashboard
