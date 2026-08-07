import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export const API_BASE_URL = rawApiUrl.replace(/\/api\/?$/, "");

export function resolveMediaUrl(url?: string | null) {
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  return `${API_BASE_URL}${url}`;
}

export function avatarFallback(name?: string | null) {
  return `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(name || "User")}`;
}
