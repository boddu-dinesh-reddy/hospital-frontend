import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import billingService from '../../services/billingService'
import LoadingSpinner from '../common/LoadingSpinner'
import { formatCurrency, formatDate } from '../../utils/helpers'

const PaymentHistory = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    billingService.getPaymentHistory({ limit: 100 })
      .then(r => setPayments(r.payments || []))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    { field: 'bill_number', headerName: 'Invoice', width: 110 },
    { field: 'patient_first_name', headerName: 'Patient', width: 120, valueGetter: (p) => p.row.patient_first_name + ' ' + p.row.patient_last_name },
    { field: 'amount', headerName: 'Amount', width: 110, valueFormatter: ({ value }) => formatCurrency(value) },
    { field: 'payment_method', headerName: 'Method', width: 110 },
    { field: 'payment_date', headerName: 'Date', width: 140, valueFormatter: ({ value }) => formatDate(value) }
  ]

  if (loading) return <LoadingSpinner />
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Payment History</Typography>
      <DataGrid rows={payments} columns={columns} autoHeight getRowId={row => row.id} pageSize={10} />
    </Box>
  )
}
export default PaymentHistory
