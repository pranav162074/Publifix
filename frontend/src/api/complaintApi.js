import axiosInstance from './axiosInstance';

export const createComplaint = (formData) =>
  axiosInstance.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getMyComplaints = (page = 1, limit = 9) =>
  axiosInstance.get(`/complaints/mine?page=${page}&limit=${limit}`);

export const getComplaintById = (id) => axiosInstance.get(`/complaints/${id}`);

export const getAllComplaints = (page = 1, limit = 9) =>
  axiosInstance.get(`/complaints?page=${page}&limit=${limit}`);

export const updateComplaintStatus = (id, status) =>
  axiosInstance.patch(`/complaints/${id}/status`, { status });