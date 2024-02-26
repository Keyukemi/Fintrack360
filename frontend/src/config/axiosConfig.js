import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fintrack360-backend.vercel.app/',
  // 'http://localhost:4000',
});

export default axiosInstance;
