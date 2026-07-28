export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  coverImage?: string;
  headline?: string;
  location?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
