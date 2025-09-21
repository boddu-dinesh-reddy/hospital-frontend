import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Typography, Stack, MenuItem, Select } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import appointmentService from '../../services/appointmentService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import { APPOINTMENT_STATUS } from '../../utils/constants'

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAppointments()
    // eslint-disable-next-line
  }, [statusFilter])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await appointmentService.getAllAppointments({ limit: 100, status: statusFilter })
      setAppointments(res.appointments || [])
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { field: 'appointment_number', headerName: 'Ref#', width: 110 },
    { field: 'patient_first_name', headerName: 'Patient', width: 120, valueGetter: (p) => p.row.patient_first_name + ' ' + p.row.patient_last_name },
    { field: 'doctor_first_name', headerName: 'Doctor', width: 120, valueGetter: (p) => p.row.doctor_first_name + ' ' + p.row.doctor_last_name },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'appointment_date', headerName: 'Date', width: 110 },
    { field: 'appointment_time', headerName: 'Time', width: 90 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => navigate(`/appointments/${params.id}/edit`)}>Edit</Button>
      )
    }
  ]

  if (loading) return <LoadingSpinner />
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Appointments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/appointments/new')}>New</Button>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          size="small"
          displayEmpty
        >
          <MenuItem value="">All Status</MenuItem>
          {APPOINTMENT_STATUS.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
        </Select>
      </Box>
      <DataGrid rows={appointments} columns={columns} autoHeight getRowId={row => row.id} pageSize={10} />
    </Box>
  )
}
export default AppointmentList
