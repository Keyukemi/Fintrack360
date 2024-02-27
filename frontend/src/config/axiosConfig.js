import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fintrack360.onrender.com',
  // 'http://localhost:4000',
});

export default axiosInstance;
