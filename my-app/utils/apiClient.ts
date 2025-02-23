import axios from "axios";
import { getToken } from "./authStorage";
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;


const apiClient = axios.create({
    // baseURL: "http://localhost:8080/api",
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
export default apiClient;