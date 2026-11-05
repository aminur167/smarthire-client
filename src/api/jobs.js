import api from './axios';

export const getJobs = (params) => api.get('/jobs/postings/', { params });
export const getJob = (id) => api.get(`/jobs/postings/${id}/`);
export const createJob = (data) => api.post('/jobs/postings/', data);
export const updateJob = (id, data) => api.put(`/jobs/postings/${id}/`, data);
export const deleteJob = (id) => api.delete(`/jobs/postings/${id}/`);
export const getDepartments = () => api.get('/jobs/departments/');
