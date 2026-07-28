import api from "@/lib/api";

export const analyzeJob = async (
  jobDescription: string
) => {
  const { data } = await api.post(
    "/job/analyze",
    {
      jobDescription,
    }
  );

  return data;
};

export const getLatestJobAnalysis = async () => {
  const { data } = await api.get("/job/latest");
  return data;
};
