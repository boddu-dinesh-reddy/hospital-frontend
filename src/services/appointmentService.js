import api from './api'

class AppointmentService {
  async getAllAppointments(params = {}) {
    const response = await api.get('/appointments', { params })
    return response.data.data
  }

  async getAppointmentById(id) {
    const response = await api.get(`/appointments/${id}`)
    return response.data.data
  }

  async createAppointment(appointmentData) {
    const response = await api.post('/appointments', appointmentData)
    return response.data.data
  }

  async updateAppointment(id, appointmentData) {
    const response = await api.put(`/appointments/${id}`, appointmentData)
    return response.data.data
  }

  async cancelAppointment(id, reason = '') {
    const response = await api.delete(`/appointments/${id}`, {
      data: { reason }
    })
    return response.data
  }

  async getAvailableSlots(doctorId, date) {
    const response = await api.get('/appointments/slots/available', {
      params: { doctorId, date }
    })
    return response.data.data
  }

  async getDailySchedule(date) {
    const response = await api.get('/appointments/schedule/daily', {
      params: { date }
    })
    return response.data.data
  }

  async getDoctors() {
    const response = await api.get('/staff/doctors/list')
    return response.data.data
  }
}

export default new AppointmentService()
