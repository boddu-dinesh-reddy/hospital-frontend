import api from './api'

class PatientService {
  async getAllPatients(params = {}) {
    const response = await api.get('/patients', { params })
    return response.data.data
  }

  async getPatientById(id) {
    const response = await api.get(`/patients/${id}`)
    return response.data.data
  }

  async createPatient(patientData) {
    const response = await api.post('/patients', patientData)
    return response.data.data
  }

  async updatePatient(id, patientData) {
    const response = await api.put(`/patients/${id}`, patientData)
    return response.data.data
  }

  async deletePatient(id) {
    const response = await api.delete(`/patients/${id}`)
    return response.data
  }

  async getPatientHistory(id) {
    const response = await api.get(`/patients/${id}/history`)
    return response.data.data
  }

  async searchPatients(query) {
    const response = await api.get('/patients', {
      params: { search: query, limit: 20 }
    })
    return response.data.data
  }
}

export default new PatientService()
