import api from "@/lib/api";

export const uploadResume = async (file: File) => {
  const formData = new FormData();

  formData.append("resume", file);

  const { data } = await api.post(
    "/resume/upload",
    formData
  );

  return data;
};

export const getResumeHistory = async () => {
  const { data } = await api.get(
    "/resume/history"
  );

  return data;
};

export const getResumeById = async (
  id: string
) => {
  const { data } = await api.get(
    `/resume/${id}`
  );

  return data;
};

export const deleteResume = async (
  id: string
) => {
  const { data } = await api.delete(
    `/resume/${id}`
  );

  return data;
};

export const getResumeStats = async () => {
  const { data } = await api.get(
    "/resume/stats"
  );

  return data;
};