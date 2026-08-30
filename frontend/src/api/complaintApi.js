import axiosInstance from './axiosInstance';

export const createComplaint = (formData) =>
  axiosInstance.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getMyComplaints = () => axiosInstance.get('/complaints/mine');
export const getComplaintById = (id) => axiosInstance.get(`/complaints/${id}`);
export const getAllComplaints = () => axiosInstance.get('/complaints');
export const updateComplaintStatus = (id, status) =>
  axiosInstance.patch(`/complaints/${id}/status`, { status });
