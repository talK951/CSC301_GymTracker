import {jwtDecode} from "jwt-decode";
import { getToken } from "./authStorage";
import { CurrentUser } from "@/types/api";

export interface JwtPayload {
  sub: string;
  userId: number;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = await getToken();
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return {userId: decoded.userId, username: decoded.sub}
    } catch (error) {
      console.error("Failed to decode token", error);
      return null;
    }
  }
  return null;
}