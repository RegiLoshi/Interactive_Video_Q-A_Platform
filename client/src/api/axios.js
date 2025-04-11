import axios from 'axios';
import useUserStore from '../stores/userStore';

const baseURL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor -> adds auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useUserStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor -> handles token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 403 and we haven't tried refreshing yet
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(`${baseURL}/refresh`, {}, {
                    withCredentials: true
                });

                const { token, user } = response.data;
                
                useUserStore.getState().setToken(token);
                useUserStore.getState().setUser(user);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout user
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 