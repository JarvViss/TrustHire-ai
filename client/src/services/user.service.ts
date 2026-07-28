import api from "@/lib/api";

export const getProfile = async () => {
  const { data } = await api.get("/user/me");
  return data;
};

export const updateProfile = async (
  updates: Record<string, string>
) => {
  const { data } = await api.put("/user/profile", updates);
  return data;
};

export const uploadProfileImage = async (
  file: File,
  type: "profile" | "cover" = "profile"
) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);

  const { data } = await api.post(
    "/user/upload-image",
    formData
  );

  return data;
};
