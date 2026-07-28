import api from "@/lib/api";

export const startInterview = async (role: string) => {
  const { data } = await api.post("/interview/start", {
    role,
  });

  return data;
};

export const submitAnswer = async (
  interviewId: string,
  answer: string
) => {
  const { data } = await api.post(
    "/interview/answer",
    {
      interviewId,
      answer,
    }
  );

  return data;
};

export const getInterview = async (
  interviewId: string
) => {
  const { data } = await api.get(
    `/interview/${interviewId}`
  );

  return data;
};