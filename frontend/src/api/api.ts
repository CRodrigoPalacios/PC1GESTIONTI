import axios from "axios";

const api = axios.create({
  baseURL: "https://pc1gestionti.onrender.com/api",
  timeout: 10000,
});

export default api;
