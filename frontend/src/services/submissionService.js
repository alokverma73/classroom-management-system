import api from "./api";

export const submitAssignment = async (data) => {
  const response = await api.post("/submissions/", data);
  return response.data;
};

export const getMySubmissions = async () => {
  const response = await api.get("/submissions/my");
  return response.data;
};

export const getSubmissions = async () => {
  const response = await api.get("/submissions/");
  return response.data;
};

export const getSubmission = async (submissionId) => {
  const response = await api.get(`/submissions/${submissionId}`);
  return response.data;
};

export const gradeSubmission = async (submissionId, data) => {
  const response = await api.post(
    `/submissions/${submissionId}/grade`,
    data
  );

  return response.data;
};