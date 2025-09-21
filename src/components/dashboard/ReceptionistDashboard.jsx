import React from 'react'
import { Typography, Paper, Box } from '@mui/material'
const ReceptionistDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>Receptionist Dashboard</Typography>
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="body1">
        Manage appointments, patient registrations, and billing details from this screen.
      </Typography>
    </Paper>
  </Box>
)
export default ReceptionistDashboard
