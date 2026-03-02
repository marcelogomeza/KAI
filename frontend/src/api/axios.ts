import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

// Interceptor to inject token on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('kai_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Global response interceptor (e.g. for handling 401s centrally)
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        // Optionally trigger a logout event here if needed
    }
    return Promise.reject(error);
});

export default api;
