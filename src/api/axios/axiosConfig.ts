import axios from 'axios';
import { API_URL } from '@/config/constants';
import { store } from '@/redux/store';
import { clearProfile } from '@/redux/slices/authSlice';

// Tạo instance Axios với URL gốc
const axiosInstance = axios.create({
    baseURL: API_URL
});

// Interceptor cho request - thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho response - xử lý lỗi 401
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Nếu là lỗi 401 Unauthorized, logout người dùng
        if (error.response && error.response.status === 401) {
            // Dispatch action để xóa thông tin người dùng
            store.dispatch(clearProfile());

            // Nếu không phải ở trang login, chuyển đến trang login
            if (typeof window !== 'undefined' &&
                !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 