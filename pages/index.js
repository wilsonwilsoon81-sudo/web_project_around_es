// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 1: IMPORTACIONES
// ═════════════════════════════════════════════════════════════

import Card from "../scripts/components/Card.js";
import Section from "../scripts/components/Section.js";
import PopupWithImage from "../scripts/components/PopupWithImage.js";
import PopupWithForm from "../scripts/components/PopupWithForm.js";
import UserInfo from "../scripts/components/UserInfo.js";
import FormValidator from "../scripts/components/FormValidator.js";
import { api } from "../scripts/components/Api.js";

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 2: VARIABLES GLOBALES
// ═════════════════════════════════════════════════════════════

let currentUserId = null;

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 3: INSTANCIACIÓN DE CLASES
// ═════════════════════════════════════════════════════════════

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

const imagePopup = new PopupWithImage("#image-popup");
imagePopup.setEventListeners();

// ✅ Section primero (para que los popups puedan usarlo)
const section = new Section(
  {
    items: [],
    renderer: (data) => createCardElement(data),
  },
  ".cards__list",
);

const editProfilePopup = new PopupWithForm("#edit-popup", (values) => {
  userInfo.setUserInfo({
    name: values.name,
    job: values.description,
  });
  editProfilePopup.close();
});
editProfilePopup.setEventListeners();

const newCardPopup = new PopupWithForm("#new-card-popup", (values) => {
  api
    .addNewCard(values["place-name"], values.link)
    .then((newCardData) => {
      const newCard = new Card(
        newCardData,
        "#card-template",
        {
          handleCardClick: (name, link) => imagePopup.open(name, link),
          handleLikeClick: (id, isLiked) => handleLikeClick(id, isLiked),
          handleDeleteClick: (id, element) => handleDeleteClick(id, element),
        },
        currentUserId,
      );
      section.addItem(newCard.generateCard());
      newCardPopup.close();
    })
    .catch((err) => console.error("❌ Error al agregar tarjeta:", err));
});
newCardPopup.setEventListeners();

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 4: FUNCIÓN HELPER
// ═════════════════════════════════════════════════════════════

function createCardElement(data) {
  try {
    const card = new Card(
      data,
      "#card-template",
      {
        handleCardClick: (name, link) => imagePopup.open(name, link),
        handleLikeClick: (id, isLiked) => handleLikeClick(id, isLiked),
        handleDeleteClick: (id, element) => handleDeleteClick(id, element),
      },
      currentUserId,
    );
    return card.generateCard();
  } catch (error) {
    console.error("❌ Error al crear tarjeta:", error);
    return null;
  }
}

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 5: CARGA DE DATOS DESDE API
// ═════════════════════════════════════════════════════════════

// Cargar tarjetas
api
  .getInitialCards()
  .then((cards) => {
    section.renderItems(cards);
  })
  .catch((err) => {
    console.error("❌ Error al cargar tarjetas:", err);
    const cardsList = document.querySelector(".cards__list");
    if (cardsList) {
      cardsList.innerHTML =
        '<li class="error">No se pudieron cargar las tarjetas</li>';
    }
  });

// Cargar usuario
api
  .getUserInfo()
  .then((user) => {
    currentUserId = user._id;
    userInfo.setUserInfo({
      name: user.name,
      job: user.about,
    });
    const avatarElement = document.querySelector(".profile__image");
    if (user.avatar && avatarElement) {
      avatarElement.src = user.avatar;
      avatarElement.alt = `Avatar de ${user.name}`;
    }
  })
  .catch((err) => {
    console.error("❌ Error al cargar usuario:", err);
    const profileTitle = document.querySelector(".profile__title");
    if (profileTitle) {
      profileTitle.textContent = "Error al cargar perfil";
    }
  });

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 6: EVENT LISTENERS
// ═════════════════════════════════════════════════════════════

document
  .querySelector(".profile__edit-button")
  .addEventListener("click", () => {
    const inputs = editProfilePopup._form.querySelectorAll(".popup__input");
    const currentInfo = userInfo.getUserInfo();
    if (inputs[0] && inputs[1]) {
      inputs[0].value = currentInfo.name;
      inputs[1].value = currentInfo.job;
    }
    editProfilePopup.resetValidation();
    editProfilePopup.open();
  });

document.querySelector(".profile__add-button").addEventListener("click", () => {
  newCardPopup.resetValidation();
  newCardPopup.open();
});

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 7: FUNCIONES DE MANEJO (like, delete)
// ═════════════════════════════════════════════════════════════

function handleLikeClick(cardId, isLiked) {
  // 🔜 Aquí irá: api.toggleLike(cardId, isLiked)
  console.log("Like:", cardId, isLiked);
}

function handleDeleteClick(cardId, element) {
  // 🔜 Aquí irá: api.deleteCard(cardId).then(() => element.remove())
  console.log("Eliminar:", cardId);
  element.remove(); // Eliminación visual temporal
}
