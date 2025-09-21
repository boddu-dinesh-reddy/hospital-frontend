import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, Grid, Button, Divider, Chip } from '@mui/material'
import LoadingSpinner from '../common/LoadingSpinner'
import patientService from '../../services/patientService'
import { formatDate } from '../../utils/helpers'

const PatientDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setData(await patientService.getPatientById(id))
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return <LoadingSpinner />

  const { patient, recentAppointments, recentLabResults } = data
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h5">{patient.first_name} {patient.last_name} ({patient.patient_id})</Typography>
            <Typography variant="body2" color="text.secondary">{patient.gender}, DOB: {formatDate(patient.date_of_birth)}</Typography>
            <Typography variant="body2">Phone: {patient.phone}</Typography>
            <Typography variant="body2">Email: {patient.email}</Typography>
            <Typography variant="body2">Address: {patient.address}</Typography>
            <Chip label={patient.blood_group} variant="outlined" sx={{ mt: 1 }} />
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth variant="contained" onClick={() => navigate(`/patients/${id}/edit`)}>Edit</Button>
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => navigate('/patients')}>Back to List</Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>Medical History</Typography>
        <Typography variant="body2" color="text.secondary">{patient.medical_history || 'No history recorded.'}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>Allergies</Typography>
        <Typography variant="body2" color="text.secondary">{patient.allergies || 'None.'}</Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Recent Appointments</Typography>
        {recentAppointments?.length === 0 ?
          <Typography>No recent appointments.</Typography>
          :
          recentAppointments.map(app => (
            <Box key={app.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{formatDate(app.appointment_date)}: {app.doctor_first_name} {app.doctor_last_name}</Typography>
              <Typography variant="body2">{app.notes || ''}</Typography>
            </Box>
          ))
        }
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Recent Lab Results</Typography>
        {recentLabResults?.length === 0 ?
          <Typography>No lab results.</Typography>
          :
          recentLabResults.map(lr => (
            <Box key={lr.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{formatDate(lr.test_date)}: {lr.test_name} - {lr.result}</Typography>
            </Box>
          ))
        }
      </Paper>
    </Box>
  )
}
export default PatientDetails
