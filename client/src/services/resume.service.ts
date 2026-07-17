import { api } from "./api";

export const uploadResume = (file: File) => {
    const formData = new FormData();

    formData.append("resume", file);

    return api.post("/resume/upload", formData);
};

export const getResume = () =>
    api.get("/resume");