import api from './axios';

export const login = (email, password) => api.post('/auth/token/', { email, password });
export const register = (data) => api.post('/accounts/register/', data);
export const getProfile = () => api.get('/accounts/profile/');
export const updateProfile = (data) => api.put('/accounts/profile/', data);
export const changePassword = (data) => api.put('/accounts/change-password/', data);
