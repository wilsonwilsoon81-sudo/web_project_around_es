import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import { API } from "../utils/constants.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";

let currentUserId = null;

const api = new Api({
  baseUrl: API.BASE_URL,
  headers: {
    authorization: API.TOKEN,
    "Content-Type": "application/json",
  },
});

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

const confirmPopup = new PopupWithConfirmation("#confirm-popup");
confirmPopup.setEventListeners();

const avatarPopup = new PopupWithForm("#avatar-popup", (values) => {
  const submitButton = avatarPopup._submitButton;
  const originalButtonText = submitButton?.textContent || "Guardar";

  if (submitButton) {
    submitButton.textContent = "Guardando...";
    submitButton.disabled = true;
  }

  api
    .updateUserAvatar(values.avatar)
    .then((updatedUser) => {
      const avatarElement = document.querySelector(".profile__image");
      if (avatarElement) {
        avatarElement.src = updatedUser.avatar;
        avatarElement.alt = `Avatar de ${updatedUser.name}`;
      }
      avatarPopup.close();
    })
    .catch((err) => {
      console.error("❌ Error al actualizar avatar:", err);
      alert(
        "No se pudo actualizar el avatar. Verifica la URL e intenta de nuevo.",
      );
    })
    .finally(() => {
      if (submitButton) {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
});
avatarPopup.setEventListeners();

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

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
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

    section.renderItems(cards);
  })
  .catch((err) => {
    console.error("❌ Error al cargar datos iniciales:", err);

    const cardsList = document.querySelector(".cards__list");
    const profileTitle = document.querySelector(".profile__title");

    if (cardsList) {
      cardsList.innerHTML =
        '<li class="error">No se pudieron cargar las tarjetas</li>';
    }
    if (profileTitle) {
      profileTitle.textContent = "Error al cargar perfil";
    }
  });

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

document.getElementById("edit-avatar-button")?.addEventListener("click", () => {
  avatarPopup.resetValidation();
  avatarPopup.open();
});
