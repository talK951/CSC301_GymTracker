import {jwtDecode} from "jwt-decode";
import { getToken } from "./authStorage";

export interface JwtPayload {
  sub: string;
  userId: number;
}

export async function getCurrentUserId(): Promise<number | null> {
  const token = await getToken();
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.userId;
    } catch (error) {
      console.error("Failed to decode token", error);
      return null;
    }
  }
  return null;
}