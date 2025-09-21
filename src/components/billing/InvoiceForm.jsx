import React, { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Grid, MenuItem } from '@mui/material'
import patientService from '../../services/patientService'
import billingService from '../../services/billingService'
import { SERVICE_TYPES } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'

const InvoiceForm = () => {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({ patientId: '', items: [{ serviceType: '', description: '', unitPrice: '', quantity: '' }] })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    patientService.getAllPatients({ limit: 100 }).then(r => setPatients(r.patients || []))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleItemChange = (idx, field, value) => {
    const updatedItems = form.items.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    setForm({ ...form, items: updatedItems })
  }

  const addItem = () => setForm({ ...form, items: [...form.items, { serviceType: '', description: '', unitPrice: '', quantity: '' }] })

  const removeItem = idx => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await billingService.createBill(form)
      navigate('/billing')
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
          <Typography variant="h6" gutterBottom>New Invoice</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField select fullWidth name="patientId" label="Patient" value={form.patientId} onChange={handleChange} required sx={{ mb: 2 }}>
              {patients.map(p => <MenuItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</MenuItem>)}
            </TextField>
            <Typography variant="subtitle1">Items</Typography>
            {form.items.map((item, idx) => (
              <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
                <Grid item xs={3}>
                  <TextField select name="serviceType" value={item.serviceType} onChange={e => handleItemChange(idx, 'serviceType', e.target.value)} label="Service" fullWidth required>
                    {SERVICE_TYPES.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField name="description" value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} label="Description" fullWidth required />
                </Grid>
                <Grid item xs={2}>
                  <TextField name="unitPrice" value={item.unitPrice} onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)} label="Unit Price" required type="number" fullWidth />
                </Grid>
                <Grid item xs={2}>
                  <TextField name="quantity" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} label="Qty" required type="number" fullWidth />
                </Grid>
                <Grid item xs={1}>
                  <Button color="error" onClick={() => removeItem(idx)}>X</Button>
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" onClick={addItem} sx={{ my: 2 }}>Add Item</Button>
            <Button variant="contained" type="submit" sx={{ mt: 2 }} disabled={loading}>Create Invoice</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
export default InvoiceForm
