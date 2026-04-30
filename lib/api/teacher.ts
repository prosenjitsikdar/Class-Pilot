import { axiosInstance } from "../axios";

export const getTeacherDashboard = async () => {
  const response = await axiosInstance.get('/teacher/dashboard');
  return response.data;
};

export const getTeacherBatches = async () => {
  const response = await axiosInstance.get('/teacher/my-batches');
  return response.data;
};

export const getBatchStudents = async (batchId: string) => {
  const response = await axiosInstance.get(`/teacher/batches/${batchId}/students`);
  return response.data;
};
