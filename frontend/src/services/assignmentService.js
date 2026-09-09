import api from "./api";

export const getAssignments = async () => {
  const response = await api.get("/assignments/");
  return response.data;
};

export const getAssignment = async (assignmentId) => {
  const response = await api.get(`/assignments/${assignmentId}`);
  return response.data;
};

export const createAssignment = async (data) => {
  const response = await api.post("/assignments/", data);
  return response.data;
};

export const updateAssignment = async (assignmentId, data) => {
  const response = await api.put(
    `/assignments/${assignmentId}`,
    data
  );

  return response.data;
};

export const deleteAssignment = async (assignmentId) => {
  const response = await api.delete(
    `/assignments/${assignmentId}`
  );
  return response.data;
};