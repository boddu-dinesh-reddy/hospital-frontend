import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from './hooks/useAuth'

// Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProtectedRoute from './components/common/ProtectedRoute'
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import LoadingSpinner from './components/common/LoadingSpinner'

// Dashboards
import AdminDashboard from './components/dashboard/AdminDashboard'
import DoctorDashboard from './components/dashboard/DoctorDashboard'
import NurseDashboard from './components/dashboard/NurseDashboard'
import ReceptionistDashboard from './components/dashboard/ReceptionistDashboard'

// Patients
import PatientList from './components/patients/PatientList'
import PatientForm from './components/patients/PatientForm'
import PatientDetails from './components/patients/PatientDetails'

// Appointments
import AppointmentList from './components/appointments/AppointmentList'
import AppointmentForm from './components/appointments/AppointmentForm'
import ScheduleView from './components/appointments/ScheduleView'

// Billing
import BillingList from './components/billing/BillingList'
import InvoiceForm from './components/billing/InvoiceForm'
import PaymentHistory from './components/billing/PaymentHistory'

// Staff
import StaffList from './components/staff/StaffList'
import StaffForm from './components/staff/StaffForm'

function App() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const getDashboard = () => {
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />
      case 'Doctor':
        return <DoctorDashboard />
      case 'Nurse':
        return <NurseDashboard />
      case 'Receptionist':
        return <ReceptionistDashboard />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar 
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: sidebarOpen ? '240px' : '60px',
          transition: 'margin-left 0.3s',
        }}
      >
        <Routes>
          <Route path="/" element={getDashboard()} />
          
          {/* Patients */}
          <Route path="/patients" element={
            <ProtectedRoute permissions={['view_patients']}>
              <PatientList />
            </ProtectedRoute>
          } />
          <Route path="/patients/new" element={
            <ProtectedRoute permissions={['create_patients']}>
              <PatientForm />
            </ProtectedRoute>
          } />
          <Route path="/patients/:id" element={
            <ProtectedRoute permissions={['view_patients']}>
              <PatientDetails />
            </ProtectedRoute>
          } />
          <Route path="/patients/:id/edit" element={
            <ProtectedRoute permissions={['update_patients']}>
              <PatientForm />
            </ProtectedRoute>
          } />
          
          {/* Appointments */}
          <Route path="/appointments" element={
            <ProtectedRoute permissions={['view_appointments']}>
              <AppointmentList />
            </ProtectedRoute>
          } />
          <Route path="/appointments/new" element={
            <ProtectedRoute permissions={['create_appointments']}>
              <AppointmentForm />
            </ProtectedRoute>
          } />
          <Route path="/appointments/:id/edit" element={
            <ProtectedRoute permissions={['update_appointments']}>
              <AppointmentForm />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute permissions={['view_appointments']}>
              <ScheduleView />
            </ProtectedRoute>
          } />
          
          {/* Billing */}
          <Route path="/billing" element={
            <ProtectedRoute permissions={['view_billing']}>
              <BillingList />
            </ProtectedRoute>
          } />
          <Route path="/billing/new" element={
            <ProtectedRoute permissions={['create_billing']}>
              <InvoiceForm />
            </ProtectedRoute>
          } />
          <Route path="/billing/payments" element={
            <ProtectedRoute permissions={['view_billing']}>
              <PaymentHistory />
            </ProtectedRoute>
          } />
          
          {/* Staff */}
          <Route path="/staff" element={
            <ProtectedRoute permissions={['view_staff']}>
              <StaffList />
            </ProtectedRoute>
          } />
          <Route path="/staff/new" element={
            <ProtectedRoute permissions={['create_staff']}>
              <StaffForm />
            </ProtectedRoute>
          } />
          <Route path="/staff/:id/edit" element={
            <ProtectedRoute permissions={['update_staff']}>
              <StaffForm />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
