// scripts/components/Api.js

// ✅ Importar configuración segura
import { API } from "../utils/constants.js";

// ✅ Función helper para requests autenticadas
function request(endpoint, options = {}) {
  return fetch(`${API.BASE_URL}${endpoint}`, {
    headers: {
      authorization: API.TOKEN, // ← Token desde constants.js
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  });
}

// ✅ Exportar métodos de la API
export const api = {
  getInitialCards: () => request("/cards"),
  getUserInfo: () => request("/users/me"),
  updateUserInfo: (name, about) =>
    request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    }),
  // ... más métodos
};

export default api;
