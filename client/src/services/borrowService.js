import api from './api';

export const borrowService = {
  list: (params) => api.get('/borrowings', { params }).then((r) => r.data),
  myCurrent: () => api.get('/borrowings/my-current').then((r) => r.data),
  issue: (data) => api.post('/borrowings/issue', data).then((r) => r.data),
  return: (id) => api.post(`/borrowings/${id}/return`).then((r) => r.data),
};
