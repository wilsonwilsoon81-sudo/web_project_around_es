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
import PopupWithConfirmation from "../scripts/components/PopupWithConfirmation.js";

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

const section = new Section(
  {
    items: [],
    renderer: (data) => createCardElement(data),
  },
  ".cards__list",
);

const editProfilePopup = new PopupWithForm("#edit-popup", (values) => {
  const submitButton = editProfilePopup._submitButton;
  const originalButtonText = submitButton?.textContent || "Guardar";

  if (submitButton) {
    submitButton.textContent = "Guardando...";
    submitButton.disabled = true;
  }

  api
    .updateUserInfo(values.name, values.description)
    .then((updatedUser) => {
      userInfo.setUserInfo({
        name: updatedUser.name,
        job: updatedUser.about,
      });
      editProfilePopup.close();
    })
    .catch((err) => {
      console.error("❌ Error al actualizar perfil:", err);
      alert(
        "No se pudo guardar los cambios. Verifica tu conexión e intenta de nuevo.",
      );
    })
    .finally(() => {
      if (submitButton) {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
});
editProfilePopup.setEventListeners();

const newCardPopup = new PopupWithForm("#new-card-popup", (values) => {
  const submitButton = newCardPopup._submitButton;
  const originalButtonText = submitButton?.textContent || "Crear";

  if (submitButton) {
    submitButton.textContent = "Creando...";
    submitButton.disabled = true;
  }

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
      newCardPopup._form.reset();
    })
    .catch((err) => {
      console.error("❌ Error al agregar tarjeta:", err);
      alert(
        "No se pudo agregar la tarjeta. Verifica la URL de la imagen e intenta de nuevo.",
      );
    })
    .finally(() => {
      if (submitButton) {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
});
newCardPopup.setEventListeners();

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 4: POPUP DE CONFIRMACIÓN (¡UNA SOLA VEZ!)
// ═════════════════════════════════════════════════════════════

const confirmPopup = new PopupWithConfirmation("#confirm-popup");
confirmPopup.setEventListeners();

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 5: FUNCIONES HELPER
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

function handleLikeClick(cardId, isLiked) {
  if (!cardId) {
    console.error("❌ ERROR: cardId es null o undefined");
    return;
  }

  api
    .toggleLike(cardId, isLiked)
    .then((updatedCard) => {
      console.log("❤️ Like actualizado:", updatedCard);
    })
    .catch((err) => {
      console.error("❌ Error al actualizar like:", err);
      alert("No se pudo actualizar el like. Intenta de nuevo.");
    });
}

function handleDeleteClick(cardId, element) {
  confirmPopup.open(() => {
    const confirmButton = confirmPopup._confirmButton;
    const originalButtonText = confirmButton?.textContent || "Sí";

    if (confirmButton) {
      confirmButton.textContent = "Eliminando...";
      confirmButton.disabled = true;
    }

    api
      .deleteCard(cardId)
      .then(() => {
        element.remove();
        console.log("🗑️ Tarjeta eliminada:", cardId);
        confirmPopup.close();
      })
      .catch((err) => {
        console.error("❌ Error al eliminar tarjeta:", err);
        alert("No se pudo eliminar la tarjeta. Intenta de nuevo.");
        confirmPopup.close();
      })
      .finally(() => {
        if (confirmButton) {
          confirmButton.textContent = originalButtonText;
          confirmButton.disabled = false;
        }
      });
  });
}

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 6: CARGA DE DATOS DESDE API
// ═════════════════════════════════════════════════════════════

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
// 🔹 SECCIÓN 7: EVENT LISTENERS
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
