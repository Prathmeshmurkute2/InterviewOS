import axios from 'axios';

export const authApi = axios.create({ baseURL: 'http://localhost:8081/api'});
export const sessionApi = axios.create({ baseURL: 'http://localhost:8082/api'});

sessionApi.interceptors.request.use((config) =>{
    const token = localStorage.getItem('token');
    if(token) config.headers.Authorization = 'Bearer ${token}';
    return config;
})