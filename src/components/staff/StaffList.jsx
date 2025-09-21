import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Typography, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import staffService from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const StaffList = () => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    staffService.get('/staff?limit=100').then(r => setStaff(r.data.data.staff || [])).finally(() => setLoading(false))
  }, [])

  const columns = [
    { field: 'username', headerName: 'Username', width: 110 },
    { field: 'first_name', headerName: 'First Name', width: 120 },
    { field: 'last_name', headerName: 'Last Name', width: 120 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'role_name', headerName: 'Role', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => navigate(`/staff/${params.id}/edit`)}>Edit</Button>
      )
    }
  ]

  if (loading) return <LoadingSpinner />
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Staff</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/staff/new')}>
          Add Staff
        </Button>
      </Stack>
      <DataGrid rows={staff} columns={columns} autoHeight getRowId={row => row.id} pageSize={10} />
    </Box>
  )
}
export default StaffList
