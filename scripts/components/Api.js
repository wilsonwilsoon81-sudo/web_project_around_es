// scripts/components/Api.js

import { API } from "../utils/constants.js";

// ═════════════════════════════════════════════════════════════
// 🔹 FUNCIÓN HELPER PARA REQUESTS AUTENTICADAS
// ═════════════════════════════════════════════════════════════

function request(endpoint, options = {}) {
  return fetch(`${API.BASE_URL}${endpoint}`, {
    headers: {
      authorization: API.TOKEN,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    // ✅ Rechazar la promesa con el código de error HTTP
    return Promise.reject(`Error: ${res.status}`);
  });
}

// ═════════════════════════════════════════════════════════════
// 🔹 MÉTODOS DE LA API (organizados por funcionalidad)
// ═════════════════════════════════════════════════════════════

export const api = {
  // ═══════════════════════════════════════════════════════════
  // 📦 TARJETAS (Cards)
  // ═══════════════════════════════════════════════════════════

  // ✅ Obtener todas las tarjetas iniciales
  getInitialCards: () => request("/cards"),

  // ✅ Agregar nueva tarjeta
  addNewCard: (name, link) =>
    request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    }),

  // ✅ Eliminar tarjeta por ID
  deleteCard: (cardId) =>
    request(`/cards/${cardId}`, {
      method: "DELETE",
    }),

  // ✅ Dar o quitar like (PUT para agregar, DELETE para quitar)
  toggleLike: (cardId, isLiked) =>
    request(`/cards/likes/${cardId}`, {
      method: isLiked ? "PUT" : "DELETE",
    }),

  // ═══════════════════════════════════════════════════════════
  // 👤 USUARIO (User)
  // ═══════════════════════════════════════════════════════════

  // ✅ Obtener datos del usuario actual
  getUserInfo: () => request("/users/me"),

  // ✅ Actualizar nombre y descripción del usuario
  updateUserInfo: (name, about) =>
    request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    }),

  // ✅ Actualizar avatar del usuario
  updateUserAvatar: (avatarUrl) =>
    request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar: avatarUrl }),
    }),
};

export default api;
