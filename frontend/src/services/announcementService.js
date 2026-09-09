import api from "./api";

export const getAnnouncements = async () => {
  const response = await api.get("/announcements/");
  return response.data;
};

export const createAnnouncement = async (data) => {
  const response = await api.post("/announcements/", data);
  return response.data;
};

export const deleteAnnouncement = async (announcementId) => {
  const response = await api.delete(
    `/announcements/${announcementId}`
  );
  return response.data;
};
export const getClassroomAnnouncements = async (classroomId) => {
  const response = await api.get(
    `/announcements/classroom/${classroomId}`
  );
  return response.data;
};