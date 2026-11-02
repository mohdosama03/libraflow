import api from './api';

export const bookService = {
  list: (params) => api.get('/books', { params }).then((r) => r.data),
  get: (id) => api.get(`/books/${id}`).then((r) => r.data),
  popular: () => api.get('/books/popular').then((r) => r.data),
  recent: () => api.get('/books/recent').then((r) => r.data),
  recommendations: () => api.get('/books/recommendations').then((r) => r.data),
  create: (data) => api.post('/books', data).then((r) => r.data),
  update: (id, data) => api.put(`/books/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/books/${id}`).then((r) => r.data),
  review: (id, data) => api.post(`/books/${id}/reviews`, data).then((r) => r.data),
};
