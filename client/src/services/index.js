import api from './api';

export { authService } from './authService';
export { bookService } from './bookService';
export { categoryService } from './categoryService';
export { borrowService } from './borrowService';

export const requestService = {
  list: (params) => api.get('/requests', { params }).then((r) => r.data),
  create: (data) => api.post('/requests', data).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/requests/${id}`, { status }).then((r) => r.data),
};

export const wishlistService = {
  list: () => api.get('/wishlist').then((r) => r.data),
  add: (bookId) => api.post('/wishlist', { bookId }).then((r) => r.data),
  remove: (bookId) => api.delete(`/wishlist/${bookId}`).then((r) => r.data),
};

export const notificationService = {
  list: () => api.get('/notifications').then((r) => r.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),
};

export const userService = {
  updateProfile: (data) => api.put('/users/profile', data).then((r) => r.data),
  students: (params) => api.get('/users/students', { params }).then((r) => r.data),
  studentDetail: (id) => api.get(`/users/students/${id}`).then((r) => r.data),
  toggleStudentStatus: (id, isActive) =>
    api.patch(`/users/students/${id}/status`, { isActive }).then((r) => r.data),
};

export const fineService = {
  list: (params) => api.get('/fines', { params }).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/fines/${id}`, { status }).then((r) => r.data),
};

export const reportService = {
  get: () => api.get('/reports').then((r) => r.data),
};

export const dashboardService = {
  publicStats: () => api.get('/dashboard/public-stats').then((r) => r.data),
  student: () => api.get('/dashboard/student').then((r) => r.data),
  admin: () => api.get('/dashboard/admin').then((r) => r.data),
};
