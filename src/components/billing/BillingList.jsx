import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Typography, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import billingService from '../../services/billingService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'

const BillingList = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true)
      const res = await billingService.getAllBills({ limit: 100 })
      setBills(res.bills || res.bills || [])
      setLoading(false)
    }
    fetchBills()
  }, [])

  const columns = [
    { field: 'bill_number', headerName: 'Invoice', width: 120 },
    { field: 'patient_first_name', headerName: 'Patient', width: 140, valueGetter: (p) => p.row.patient_first_name + ' ' + p.row.patient_last_name },
    { field: 'total_amount', headerName: 'Total', width: 110, valueFormatter: ({ value }) => formatCurrency(value) },
    { field: 'payment_status', headerName: 'Status', width: 110 },
    { field: 'created_at', headerName: 'Created', width: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => navigate(`/billing/${params.id}`)}>Details</Button>
      )
    }
  ]

  if (loading) return <LoadingSpinner />
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Billing</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/billing/new')}>
          New Invoice
        </Button>
      </Stack>
      <DataGrid rows={bills} columns={columns} autoHeight getRowId={row => row.id} pageSize={10} />
    </Box>
  )
}
export default BillingList
