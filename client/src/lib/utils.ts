import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export const API_BASE_URL = rawApiUrl.replace(/\/api\/?$/, "");
