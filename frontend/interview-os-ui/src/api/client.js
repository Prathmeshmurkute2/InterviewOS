import axios from 'axios';

export const authApi = axios.create({ baseURL: import.meta.env.VITE_AUTH_API_URL });
export const sessionApi = axios.create({ baseURL: import.meta.env.VITE_SESSION_API_URL });
export const orchestratorApi = axios.create({ baseURL: import.meta.env.VITE_ORCHESTRATOR_API_URL });

sessionApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});