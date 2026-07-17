export interface User {
  _id: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";

  avatar: string;
  walletAddress: string;

  profileImage: string;
  phone: string;
  headline: string;
  bio: string;
  github: string;
  linkedin: string;
  portfolio: string;
  location: string;

  isVerified: boolean;

  createdAt: string;
  updatedAt: string;
}