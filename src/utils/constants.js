export const ROLES = {
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  RECEPTIONIST: 'Receptionist'
}

export const APPOINTMENT_TYPES = [
  'Consultation',
  'Follow-up',
  'Emergency',
  'Routine Check'
]

export const APPOINTMENT_STATUS = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled',
  'No Show'
]

export const PAYMENT_STATUS = [
  'Pending',
  'Partially Paid',
  'Paid'
]

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Insurance',
  'Bank Transfer'
]

export const SERVICE_TYPES = [
  'Consultation',
  'Lab Test',
  'Medication',
  'Procedure',
  'Room Charge'
]

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Other'
]

export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
]

export const PERMISSIONS = {
  // Patients
  VIEW_PATIENTS: 'view_patients',
  CREATE_PATIENTS: 'create_patients',
  UPDATE_PATIENTS: 'update_patients',
  DELETE_PATIENTS: 'delete_patients',
  
  // Appointments
  VIEW_APPOINTMENTS: 'view_appointments',
  CREATE_APPOINTMENTS: 'create_appointments',
  UPDATE_APPOINTMENTS: 'update_appointments',
  DELETE_APPOINTMENTS: 'delete_appointments',
  
  // Billing
  VIEW_BILLING: 'view_billing',
  CREATE_BILLING: 'create_billing',
  PROCESS_PAYMENTS: 'process_payments',
  
  // Staff
  VIEW_STAFF: 'view_staff',
  CREATE_STAFF: 'create_staff',
  UPDATE_STAFF: 'update_staff',
  DELETE_STAFF: 'delete_staff',
  
  // Admin
  MANAGE_ALL: 'manage_all'
}
