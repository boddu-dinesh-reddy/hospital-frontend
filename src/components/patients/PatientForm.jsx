import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material'
import patientService from '../../services/patientService'
import { GENDER_OPTIONS, BLOOD_GROUPS } from '../../utils/constants'

const PatientForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    phone: '', email: '', address: '', emergencyContact: '', emergencyPhone: '',
    medicalHistory: '', allergies: '', bloodGroup: '', insuranceInfo: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      patientService.getPatientById(id).then(data => {
        setForm({
          firstName: data.patient.first_name, lastName: data.patient.last_name,
          dateOfBirth: data.patient.date_of_birth, gender: data.patient.gender,
          phone: data.patient.phone, email: data.patient.email, address: data.patient.address,
          emergencyContact: data.patient.emergency_contact, emergencyPhone: data.patient.emergency_phone,
          medicalHistory: data.patient.medical_history, allergies: data.patient.allergies,
          bloodGroup: data.patient.blood_group, insuranceInfo: data.patient.insurance_info || ''
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
        await patientService.updatePatient(id, form)
      } else {
        await patientService.createPatient(form)
      }
      navigate('/patients')
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
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField name="firstName" label="First Name" value={form.firstName} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={6}>
                <TextField name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={6}>
                <TextField name="dateOfBirth" label="Date of Birth" type="date" value={form.dateOfBirth} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField name="gender" label="Gender" value={form.gender} onChange={handleChange} select fullWidth required>
                  {GENDER_OPTIONS.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField name="phone" label="Phone" value={form.phone} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={6}>
                <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField name="address" label="Address" value={form.address} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField name="emergencyContact" label="Emergency Contact" value={form.emergencyContact} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField name="emergencyPhone" label="Emergency Phone" value={form.emergencyPhone} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField name="medicalHistory" label="Medical History" value={form.medicalHistory} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField name="allergies" label="Allergies" value={form.allergies} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField name="bloodGroup" label="Blood Group" value={form.bloodGroup} onChange={handleChange} select fullWidth>
                  {BLOOD_GROUPS.map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField name="insuranceInfo" label="Insurance Info (JSON)" value={form.insuranceInfo} onChange={handleChange} fullWidth />
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
export default PatientForm
