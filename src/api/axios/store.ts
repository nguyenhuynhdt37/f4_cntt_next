import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
    withCredentials: true,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
