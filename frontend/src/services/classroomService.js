import api from "./api";

export const getClassrooms = async () => {
  const response = await api.get("/classrooms/");
  return response.data;
};

export const getClassroom = async (classroomId) => {
  const response = await api.get(`/classrooms/${classroomId}`);
  return response.data;
};

export const createClassroom = async (data) => {
  const response = await api.post("/classrooms/", data);
  return response.data;
};

export const deleteClassroom = async (classroomId) => {
  const response = await api.delete(
    `/classrooms/${classroomId}`
  );
  return response.data;
};