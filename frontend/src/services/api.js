const resolveApiBase = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!envUrl) return '/api';
  const clean = envUrl.replace(/\/+$/, '');
  // If user provided base domain without /api (e.g. https://medsupply-api.onrender.com)
  if (!clean.endsWith('/api')) {
    return `${clean}/api`;
  }
  return clean;
};

const API_BASE = resolveApiBase();

const getAuthHeaders = () => {
  const token = localStorage.getItem('medsupply_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

const safeFetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    const text = await res.text();
    return {
      success: false,
      message: res.status === 404
        ? `API endpoint ${url} not found (Status 404). Please ensure backend service is running.`
        : (text.length < 200 ? text : `Server returned status ${res.status}`)
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Network error connecting to MedSupply server.'
    };
  }
};

export const api = {
  // Auth
  async login(email, password) {
    return safeFetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },

  async register(data) {
    return safeFetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getMe() {
    return safeFetchJson(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
  },

  async getDemoAccounts() {
    return safeFetchJson(`${API_BASE}/auth/demo-accounts`);
  },

  // Donors
  async getDonors(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetchJson(`${API_BASE}/donors?${query}`);
  },

  async getDonorById(id) {
    return safeFetchJson(`${API_BASE}/donors/${id}`);
  },

  async createDonor(data) {
    return safeFetchJson(`${API_BASE}/donors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },

  async updateDonor(id, data) {
    return safeFetchJson(`${API_BASE}/donors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },

  async toggleDonorAvailability(id) {
    return safeFetchJson(`${API_BASE}/donors/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
  },

  async checkEligibility(id) {
    return safeFetchJson(`${API_BASE}/donors/${id}/eligibility`);
  },

  // Equipment
  async getEquipment(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetchJson(`${API_BASE}/equipment?${query}`);
  },

  async getEquipmentById(id) {
    return safeFetchJson(`${API_BASE}/equipment/${id}`);
  },

  async createEquipment(data) {
    return safeFetchJson(`${API_BASE}/equipment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },

  async updateEquipment(id, data) {
    return safeFetchJson(`${API_BASE}/equipment/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },

  async updateEquipmentStatus(id, status, extra = {}) {
    return safeFetchJson(`${API_BASE}/equipment/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, ...extra })
    });
  },

  async getEquipmentWhatsAppLink(id) {
    return safeFetchJson(`${API_BASE}/equipment/${id}/whatsapp-link`, {
      headers: getAuthHeaders()
    });
  },

  // Emergency Requests
  async getEmergencyFeed(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetchJson(`${API_BASE}/emergency?${query}`);
  },

  async createEmergencyRequest(data) {
    return safeFetchJson(`${API_BASE}/emergency`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },

  async resolveEmergencyRequest(id) {
    return safeFetchJson(`${API_BASE}/emergency/${id}/resolve`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
  },

  async getEmergencyWhatsAppAction(id) {
    return safeFetchJson(`${API_BASE}/emergency/${id}/whatsapp-action`);
  },

  // Dashboard
  async getDashboard() {
    return safeFetchJson(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders()
    });
  },

  async recordDonation(data) {
    return safeFetchJson(`${API_BASE}/dashboard/donations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },

  async returnEquipment(id) {
    return safeFetchJson(`${API_BASE}/dashboard/equipment/${id}/return`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
  },

  // Member 3 Ops & WhatsApp Logs
  async getOpsHealth() {
    return safeFetchJson(`${API_BASE}/notifications/ops-health`);
  },

  async getBroadcastLogs() {
    return safeFetchJson(`${API_BASE}/notifications/broadcast-logs`);
  }
};
