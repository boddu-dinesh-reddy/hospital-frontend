import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Typography, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import patientService from '../../services/patientService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'

const PatientList = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true)
      try {
        const res = await patientService.getAllPatients({ limit: 100 })
        setPatients(res.patients || [])
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const columns = [
    { field: 'patient_id', headerName: 'Patient ID', width: 120 },
    { field: 'first_name', headerName: 'First Name', width: 130 },
    { field: 'last_name', headerName: 'Last Name', width: 130 },
    { field: 'gender', headerName: 'Gender', width: 90 },
    { field: 'date_of_birth', headerName: 'DOB', width: 110 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'email', headerName: 'Email', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => navigate(`/patients/${params.id}`)}>Details</Button>
      )
    }
  ]

  if (loading) return <LoadingSpinner />
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Patients</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/patients/new')}>
          Add Patient
        </Button>
      </Stack>
      <DataGrid rows={patients} columns={columns} autoHeight getRowId={row => row.id} pageSize={10} />
    </Box>
  )
}
export default PatientList
