import React from 'react'
import { Typography, Paper, Box } from '@mui/material'
const NurseDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>Nurse Dashboard</Typography>
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="body1">View assigned patients, patient histories, and today's appointments here.</Typography>
    </Paper>
  </Box>
)
export default NurseDashboard
