import { axiosInstance } from "../axios";

export const getAdminOverview = async () => {
  const response = await axiosInstance.get('/admin/overview');
  return response.data;
};

export const getAdminTeachers = async () => {
  const response = await axiosInstance.get('/admin/teachers');
  return response.data;
};

export const getAdminStudents = async () => {
  const response = await axiosInstance.get('/admin/students');
  return response.data;
};

export const getAdminBatches = async () => {
  const response = await axiosInstance.get('/admin/batches');
  return response.data;
};

export const createTeacher = async (data: any) => {
  const response = await axiosInstance.post('/user/create-teacher', data);
  return response.data;
};

export const createStudent = async (data: any) => {
  const response = await axiosInstance.post('/user/create-student', data);
  return response.data;
};
