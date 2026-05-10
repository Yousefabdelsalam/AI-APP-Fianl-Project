import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect if already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => {
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);
    return API.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  me: () => API.get('/auth/me'),
};

// ── Destinations ──
export const destinationsAPI = {
  list: (skip = 0, limit = 50) => API.get(`/destinations/?skip=${skip}&limit=${limit}`),
  get: (id) => API.get(`/destinations/${id}`),
  search: (params) => API.get('/destinations/search', { params }),
  create: (data) => API.post('/destinations/', data),
  update: (id, data) => API.put(`/destinations/${id}`, data),
  delete: (id) => API.delete(`/destinations/${id}`),
};

// ── AI ──
export const aiAPI = {
  recommend: (data) => API.post('/ai/recommend-destinations', data),
  generateTrip: (data) => API.post('/ai/generate-trip-plan', data),
  chat: (data) => API.post('/ai/chat', data),
  virtualDestination: (data) => API.post('/ai/generate-virtual-destination', data),
  estimateBudget: (data) => API.post('/ai/estimate-budget', data),
};

// ── Trips ──
export const tripsAPI = {
  save: (tripId) => API.post(`/trips/save/${tripId}`),
  myTrips: () => API.get('/trips/my-trips'),
  myPlans: () => API.get('/trips/my-plans'),
  delete: (id) => API.delete(`/trips/${id}`),
};

// ── Reviews ──
export const reviewsAPI = {
  create: (data) => API.post('/reviews/', data),
  getByDestination: (id) => API.get(`/reviews/destination/${id}`),
  delete: (id) => API.delete(`/reviews/${id}`),
};

// ── Admin ──
export const adminAPI = {
  stats: () => API.get('/admin/dashboard-stats'),
  users: () => API.get('/admin/users'),
  trips: () => API.get('/admin/trips'),
  reviews: () => API.get('/admin/reviews'),
};

// ── Weather ──
export const weatherAPI = {
  get: (city) => API.get(`/weather/?city=${city}`),
};

export default API;
