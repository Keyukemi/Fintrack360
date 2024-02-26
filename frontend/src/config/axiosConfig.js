import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fintrack360-backend.vercel.app/',
});

export default instance;
