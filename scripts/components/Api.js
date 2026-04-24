import { API } from "../utils/constants.js";

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
    return Promise.reject(`Error: ${res.status}`);
  });
}

export const api = {
  getInitialCards: () => request("/cards"),

  addNewCard: (name, link) =>
    request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    }),

  deleteCard: (cardId) =>
    request(`/cards/${cardId}`, {
      method: "DELETE",
    }),

  toggleLike: (cardId, isLiked) =>
    request(`/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
    }),

  getUserInfo: () => request("/users/me"),

  updateUserInfo: (name, about) =>
    request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    }),

  updateUserAvatar: (avatarUrl) =>
    request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar: avatarUrl }),
    }),
};

export default api;
