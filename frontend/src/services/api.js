import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export const predictTransaction = async (transaction) => {
  const response = await API.post("/predict", transaction);

  return response.data;
};

export const checkHealth = async () => {
  const response = await API.get("/health");

  return response.data;
};
export const getDemoTransaction = async () => {
  const response = await API.get("/demo-transaction");

  return response.data;
};
export default API;
export const getAnalytics = async () => {
  const response = await API.get("/analytics");

  return response.data;
};
export const analyzeCSV = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post("/analyze-csv", formData);

  return response.data;
};
