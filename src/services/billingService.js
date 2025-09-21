import api from './api'

class BillingService {
  async getAllBills(params = {}) {
    const response = await api.get('/billing', { params })
    return response.data.data
  }

  async getBillById(id) {
    const response = await api.get(`/billing/${id}`)
    return response.data.data
  }

  async createBill(billData) {
    const response = await api.post('/billing', billData)
    return response.data.data
  }

  async processPayment(billId, paymentData) {
    const response = await api.post(`/billing/${billId}/payment`, paymentData)
    return response.data.data
  }

  async getPaymentHistory(params = {}) {
    const response = await api.get('/billing/payments/history', { params })
    return response.data.data
  }

  async getBillingStats() {
    const response = await api.get('/billing/stats/overview')
    return response.data.data
  }
}

export default new BillingService()
