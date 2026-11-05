const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const getAuthHeaders = () => {
  const token = localStorage.getItem('medsupply_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getDemoAccounts() {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    return res.json();
  },

  // Donors
  async getDonors(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/donors?${query}`);
    return res.json();
  },

  async getDonorById(id) {
    const res = await fetch(`${API_BASE}/donors/${id}`);
    return res.json();
  },

  async createDonor(data) {
    const res = await fetch(`${API_BASE}/donors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateDonor(id, data) {
    const res = await fetch(`${API_BASE}/donors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async toggleDonorAvailability(id) {
    const res = await fetch(`${API_BASE}/donors/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async checkEligibility(id) {
    const res = await fetch(`${API_BASE}/donors/${id}/eligibility`);
    return res.json();
  },

  // Equipment
  async getEquipment(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/equipment?${query}`);
    return res.json();
  },

  async getEquipmentById(id) {
    const res = await fetch(`${API_BASE}/equipment/${id}`);
    return res.json();
  },

  async createEquipment(data) {
    const res = await fetch(`${API_BASE}/equipment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateEquipment(id, data) {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateEquipmentStatus(id, status, extra = {}) {
    const res = await fetch(`${API_BASE}/equipment/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, ...extra })
    });
    return res.json();
  },

  async getEquipmentWhatsAppLink(id) {
    const res = await fetch(`${API_BASE}/equipment/${id}/whatsapp-link`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Emergency Requests
  async getEmergencyFeed(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/emergency?${query}`);
    return res.json();
  },

  async createEmergencyRequest(data) {
    const res = await fetch(`${API_BASE}/emergency`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async resolveEmergencyRequest(id) {
    const res = await fetch(`${API_BASE}/emergency/${id}/resolve`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getEmergencyWhatsAppAction(id) {
    const res = await fetch(`${API_BASE}/emergency/${id}/whatsapp-action`);
    return res.json();
  },

  // Dashboard
  async getDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async recordDonation(data) {
    const res = await fetch(`${API_BASE}/dashboard/donations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async returnEquipment(id) {
    const res = await fetch(`${API_BASE}/dashboard/equipment/${id}/return`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Member 3 Ops & WhatsApp Logs
  async getOpsHealth() {
    const res = await fetch(`${API_BASE}/notifications/ops-health`);
    return res.json();
  },

  async getBroadcastLogs() {
    const res = await fetch(`${API_BASE}/notifications/broadcast-logs`);
    return res.json();
  }
};
