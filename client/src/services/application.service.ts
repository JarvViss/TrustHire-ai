import api from "@/lib/api";

export const applyToJob = async (data: {
  jobTitle: string;
  company: string;
  jobDescription: string;
}) => {
  const { data: res } = await api.post(
    "/applications",
    data
  );
  return res;
};

export const getMyApplications = async () => {
  const { data } = await api.get("/applications");
  return data;
};
