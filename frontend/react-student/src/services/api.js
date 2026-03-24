import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://project-track-8i5i.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('techtrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('techtrack_token');
      localStorage.removeItem('techtrack_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Projects
export const getProjects = (params) => api.get('/projects', { params });
export const getProject = (id) => api.get(`/projects/${id}`);
export const requestRole = (projectId, data) => api.post(`/projects/${projectId}/request-role`, data);
export const getMyRequests = () => api.get('/projects/my/requests');

// Users
export const getStaffList = (params) => api.get('/users/staff', { params });
export const getStaffProfile = (id) => api.get(`/users/staff/${id}`);
export const getStudentProfile = (id) => api.get(`/users/student/${id}`);
export const updateProfile = (data) => api.put('/users/profile', data);

// Notifications
export const getNotifications = (params) => api.get('/notifications', { params });
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllRead = () => api.put('/notifications/read-all');

// Chat
export const getMessages = (projectId, params) => api.get(`/chat/${projectId}`, { params });
export const postMessage = (projectId, data) => api.post(`/chat/${projectId}`, data);

// Documents
export const uploadDocument = (formData) => api.post('/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getMyDocuments = () => api.get('/documents/my');

export default api;
