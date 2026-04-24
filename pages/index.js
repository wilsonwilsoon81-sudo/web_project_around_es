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

// ═════════════════════════════════════════════════════════════
// 🔹 EDITAR PERFIL CON PERSISTENCIA (reemplaza tu callback actual)
// ═════════════════════════════════════════════════════════════

const editProfilePopup = new PopupWithForm("#edit-popup", (values) => {
  // ✅ 1. Mostrar estado de "guardando" (deshabilitar botón)
  const submitButton = editProfilePopup._submitButton; // o editProfilePopup._form.querySelector('[type="submit"]')
  const originalButtonText = submitButton?.textContent || "Guardar";

  if (submitButton) {
    submitButton.textContent = "Guardando...";
    submitButton.disabled = true;
  }

  // ✅ 2. Enviar datos al servidor
  api
    .updateUserInfo(values.name, values.description)
    .then((updatedUser) => {
      // ✅ 3. Actualizar la UI con los datos confirmados por el servidor
      userInfo.setUserInfo({
        name: updatedUser.name,
        job: updatedUser.about, // La API devuelve "about", tu UI usa "job"
      });

      // ✅ 4. Cerrar el popup
      editProfilePopup.close();
    })
    .catch((err) => {
      // ❌ 5. Manejar errores
      console.error("❌ Error al actualizar perfil:", err);
      alert(
        "No se pudo guardar los cambios. Verifica tu conexión e intenta de nuevo.",
      );
    })
    .finally(() => {
      // 🔄 6. Restaurar botón (siempre, haya éxito o error)
      if (submitButton) {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
});
editProfilePopup.setEventListeners();

// ═════════════════════════════════════════════════════════════
// 🔹 AGREGAR NUEVA TARJETA CON PERSISTENCIA (reemplaza tu callback actual)
// ═════════════════════════════════════════════════════════════

const newCardPopup = new PopupWithForm("#new-card-popup", (values) => {
  // ✅ 1. Mostrar estado de "creando" (deshabilitar botón)
  const submitButton = newCardPopup._submitButton;
  const originalButtonText = submitButton?.textContent || "Crear";

  if (submitButton) {
    submitButton.textContent = "Creando...";
    submitButton.disabled = true;
  }

  // ✅ 2. Enviar datos al servidor
  api
    .addNewCard(values["place-name"], values.link)
    .then((newCardData) => {
      // ✅ 3. Crear tarjeta con los datos DEL SERVIDOR (incluye _id, owner, isLiked, etc.)
      const newCard = new Card(
        newCardData, // ← Datos completos desde API: { name, link, _id, owner, isLiked, createdAt }
        "#card-template",
        {
          handleCardClick: (name, link) => imagePopup.open(name, link),
          handleLikeClick: (id, isLiked) => handleLikeClick(id, isLiked),
          handleDeleteClick: (id, element) => handleDeleteClick(id, element),
        },
        currentUserId, // ← Para verificar si puede eliminarla
      );

      // ✅ 4. Agregar la tarjeta nueva al inicio de la cuadrícula
      section.addItem(newCard.generateCard());

      // ✅ 5. Cerrar el popup y resetear el formulario
      newCardPopup.close();
      newCardPopup._form.reset(); // ← Limpia los campos para la próxima vez
    })
    .catch((err) => {
      // ❌ 6. Manejar errores
      console.error("❌ Error al agregar tarjeta:", err);
      alert(
        "No se pudo agregar la tarjeta. Verifica la URL de la imagen e intenta de nuevo.",
      );
    })
    .finally(() => {
      // 🔄 7. Restaurar botón (siempre, haya éxito o error)
      if (submitButton) {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
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
