import api from './axios';

export const getApplications = (params) => api.get('/candidates/applications/', { params });
export const applyForJob = (data) => api.post('/candidates/applications/', data);
export const updateApplicationStatus = (id, data) => api.patch(`/candidates/applications/${id}/`, data);
export const uploadResume = (formData) => api.post('/candidates/upload-resume/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getProfiles = (params) => api.get('/candidates/profiles/', { params });
export const getApplicationMatch = (id) => api.get(`/candidates/applications/${id}/match/`);
