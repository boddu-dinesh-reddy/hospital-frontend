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
  Paper
} from '@mui/material'
import {
  People,
  CalendarMonth,
  Receipt,
  TrendingUp,
  Person,
  Event,
  Payment
} from '@mui/icons-material'
import { formatCurrency, formatDate } from '../../utils/helpers'
import patientService from '../../services/patientService'
import appointmentService from '../../services/appointmentService'
import billingService from '../../services/billingService'
import LoadingSpinner from '../common/LoadingSpinner'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    todayAppointments: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch stats
      const [patientsRes, appointmentsRes, billingRes, todaySchedule] = await Promise.all([
        patientService.getAllPatients({ limit: 1 }),
        appointmentService.getAllAppointments({ limit: 1 }),
        billingService.getBillingStats(),
        appointmentService.getDailySchedule(new Date().toISOString().split('T')[0])
      ])

      setStats({
        totalPatients: patientsRes.pagination?.totalItems || 0,
        totalAppointments: appointmentsRes.pagination?.totalItems || 0,
        totalRevenue: billingRes.overview?.total_revenue || 0,
        todayAppointments: todaySchedule.appointments?.length || 0
      })

      // Mock recent activity (in a real app, this would come from an API)
      setRecentActivity([
        {
          id: 1,
          type: 'patient',
          title: 'New patient registered',
          subtitle: 'John Doe - ID: P0123',
          timestamp: new Date(),
          icon: <Person />
        },
        {
          id: 2,
          type: 'appointment',
          title: 'Appointment scheduled',
          subtitle: 'Jane Smith with Dr. Johnson',
          timestamp: new Date(Date.now() - 30 * 60000),
          icon: <Event />
        },
        {
          id: 3,
          type: 'payment',
          title: 'Payment received',
          subtitle: '$250.00 - Invoice INV0145',
          timestamp: new Date(Date.now() - 60 * 60000),
          icon: <Payment />
        }
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={<CalendarMonth />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<Event />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<Receipt />}
            color="warning"
            subtitle="This month"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1 }} />
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity) => (
                <ListItem key={activity.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {activity.subtitle}
                        </Typography>
                        <br />
                        <Typography component="span" variant="caption" color="text.secondary">
                          {formatDate(activity.timestamp, 'MMM DD, hh:mm A')}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Quick Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Active Patients</Typography>
                  <Chip label={stats.totalPatients} color="primary" size="small" />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Today's Appointments</Typography>
                  <Chip label={stats.todayAppointments} color="success" size="small" />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Pending Payments</Typography>
                  <Chip label="12" color="warning" size="small" />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Available Doctors</Typography>
                  <Chip label="8" color="info" size="small" />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
