import api from './axios';

export const getDashboardStats = () => api.get('/dashboard/stats/');
export const getJobsOverview = () => api.get('/dashboard/jobs-overview/');
export const getRequestsSummary = () => api.get('/dashboard/requests/');
export const getRecentActivity = () => api.get('/dashboard/activity/');
export const getNotifications = () => api.get('/notifications/');
export const getUnreadCount = () => api.get('/notifications/unread-count/');
