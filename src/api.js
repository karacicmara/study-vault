const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'API error');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: (email, password) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
};

// User API
export const userAPI = {
  getMe: () => apiCall('/users/me'),
  
  connectWallet: () =>
    apiCall('/users/wallet/connect', {
      method: 'POST'
    }),

  airdrop: () =>
    apiCall('/users/airdrop', {
      method: 'POST'
    })
};

// Scripts API
export const scriptsAPI = {
  getAll: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiCall(`/scripts${query}`);
  },

  getById: (id) => apiCall(`/scripts/${id}`),

  create: (scriptData) =>
    apiCall('/scripts', {
      method: 'POST',
      body: JSON.stringify(scriptData)
    }),

  purchase: (id) =>
    apiCall(`/scripts/${id}/purchase`, {
      method: 'POST'
    }),

  rate: (id, rating, review = '') =>
    apiCall(`/scripts/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, review })
    })
};

