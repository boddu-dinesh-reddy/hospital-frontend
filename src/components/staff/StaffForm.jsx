import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography, TextField, Button, Alert, MenuItem, Grid } from '@mui/material'
import staffService from '../../services/api'

const StaffForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', email: '', password: '', firstName: '', lastName: '', phone: '', roleId: 2
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Doctor' },
    { id: 3, name: 'Nurse' },
    { id: 4, name: 'Receptionist' }
  ]

  useEffect(() => {
    if (isEdit) {
      staffService.get(`/staff/${id}`).then(r => {
        const u = r.data.data.staff
        setForm({
          username: u.username, email: u.email, password: '',
          firstName: u.first_name, lastName: u.last_name, phone: u.phone, roleId: u.role_id
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
        await staffService.put(`/staff/${id}`, form)
      } else {
        await staffService.post('/staff', form)
      }
      navigate('/staff')
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
            {isEdit ? 'Edit Staff' : 'Add New Staff'}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField name="firstName" label="First Name" value={form.firstName} onChange={handleChange} fullWidth required /></Grid>
              <Grid item xs={6}><TextField name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} fullWidth required /></Grid>
              <Grid item xs={6}><TextField name="username" label="Username" value={form.username} onChange={handleChange} fullWidth required /></Grid>
              <Grid item xs={6}><TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth required /></Grid>
              <Grid item xs={6}><TextField select name="roleId" label="Role" value={form.roleId} onChange={handleChange} fullWidth>
                {roles.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
              </TextField></Grid>
              <Grid item xs={6}><TextField name="phone" label="Phone" value={form.phone} onChange={handleChange} fullWidth /></Grid>
              {!isEdit && (<Grid item xs={12}><TextField name="password" type="password" label="Password" value={form.password} onChange={handleChange} fullWidth required /></Grid>)}
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
export default StaffForm
