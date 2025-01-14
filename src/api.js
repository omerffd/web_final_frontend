import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL;

// Axios örneği oluşturma
const api = axios.create({
  baseURL: `${API_URL}/api`, // API base URL
});

// İstek öncesi çalışacak interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  
  // Upload endpoint'i için Content-Type header'ını değiştirme
  if (config.url === "/upload") {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
