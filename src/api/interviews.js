import api from './axios';

export const getInterviews = (params) => api.get('/interviews/', { params });
export const getUpcomingInterviews = () => api.get('/interviews/upcoming/');
export const createInterview = (data) => api.post('/interviews/', data);
export const updateInterview = (id, data) => api.patch(`/interviews/${id}/`, data);
