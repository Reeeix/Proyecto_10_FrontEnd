const BASE_URL = "http://localhost:3000/api/v1";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (options.body && !isFormData) {
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

 
  const contentType = res.headers.get("content-type");

  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) throw new Error(data.message || data || "Error desconocido");

  return data;
};