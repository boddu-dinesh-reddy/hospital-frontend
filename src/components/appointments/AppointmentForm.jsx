import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material'
import appointmentService from '../../services/appointmentService'
import patientService from '../../services/patientService'
import { APPOINTMENT_TYPES } from '../../utils/constants'

const AppointmentForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    patientId: '', doctorId: '', appointmentDate: '', appointmentTime: '', type: '', reason: '', notes: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch doctors and patients list
    appointmentService.getDoctors().then(setDoctors)
    patientService.getAllPatients({ limit: 100 }).then(r => setPatients(r.patients || []))
    if (isEdit) {
      appointmentService.getAppointmentById(id).then(data => {
        setForm({
          patientId: data.patient_id,
          doctorId: data.doctor_id,
          appointmentDate: data.appointment_date,
          appointmentTime: data.appointment_time,
          type: data.type,
          reason: data.reason,
          notes: data.notes
        })
      })
    }
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isEdit) {
        await appointmentService.updateAppointment(id, form)
      } else {
        await appointmentService.createAppointment(form)
      }
      navigate('/appointments')
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth="sm" mx="auto">
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {isEdit ? 'Edit Appointment' : 'New Appointment'}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select required fullWidth label="Patient" name="patientId" value={form.patientId} onChange={handleChange}>
                  {patients.map(p => (
                    <MenuItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select required fullWidth label="Doctor" name="doctorId" value={form.doctorId} onChange={handleChange}>
                  {doctors.map(d => (
                    <MenuItem key={d.id} value={d.id}>
                      Dr. {d.first_name} {d.last_name} ({d.specialization})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField name="appointmentDate" label="Date" type="date" required fullWidth value={form.appointmentDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField name="appointmentTime" label="Time" type="time" required fullWidth value={form.appointmentTime} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField select name="type" label="Type" fullWidth value={form.type} onChange={handleChange}>
                  {APPOINTMENT_TYPES.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField name="reason" label="Reason" fullWidth value={form.reason} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField name="notes" label="Notes" fullWidth value={form.notes} onChange={handleChange} />
              </Grid>
            </Grid>
            <Button variant="contained" type="submit" sx={{ mt: 3 }} disabled={loading}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
export default AppointmentForm
