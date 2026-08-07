import api from "@/lib/axios";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/auth/register", data);

  return res.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);

  return res.data.data;
};

export const verifyEmail = async (data: {
  email: string;
  code: string;
}) => {
  const res = await api.post("/auth/verify-email", data);

  return res.data;
};

export const resendVerificationCode = async (email: string) => {
  const res = await api.post("/auth/resend-verification", {
    email,
  });

  return res.data;
};
