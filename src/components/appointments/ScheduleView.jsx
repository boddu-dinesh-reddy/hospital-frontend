import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material'
import appointmentService from '../../services/appointmentService'
import LoadingSpinner from '../common/LoadingSpinner'
import { formatDate, formatTime } from '../../utils/helpers'

const ScheduleView = () => {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    appointmentService.getDailySchedule(today).then((data) => {
      setSchedule(data.appointments || [])
      setLoading(false)
    })
  }, [today])

  if (loading) return <LoadingSpinner />
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>Today's Schedule</Typography>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <List>
            {schedule.length === 0 ? (
              <Typography>No appointments scheduled for today.</Typography>
            ) : schedule.map((a, i) => (
              <React.Fragment key={a.id}>
                <ListItem>
                  <ListItemText 
                    primary={`${formatTime(a.appointment_time)} - ${a.patient_first_name} ${a.patient_last_name}`} 
                    secondary={`Doctor: Dr. ${a.doctor_first_name} ${a.doctor_last_name} (${a.doctor_specialization || ''}) | ${a.type}`} 
                  />
                </ListItem>
                {i !== schedule.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
export default ScheduleView
