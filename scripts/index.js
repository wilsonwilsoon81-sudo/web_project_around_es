const initialCards = [
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg  ",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg  ",
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg  ",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg  ",
  },
  {
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg  ",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg  ",
  },
];

// 🔹 Selectores del DOM
const editProfileButton = document.querySelector(".profile__edit-button");
const editPopup = document.querySelector("#edit-popup");
const closeEditPopupButton = editPopup.querySelector(".popup__close");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const nameInput = editPopup.querySelector('input[name="name"]');
const descriptionInput = editPopup.querySelector('input[name="description"]');
const editForm = document.querySelector("#edit-profile-form");
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const addCardButton = document.querySelector(".profile__add-button");
const newCardPopup = document.querySelector("#new-card-popup");
const closeNewCardPopupButton = newCardPopup.querySelector(".popup__close");
const newCardForm = document.querySelector("#new-card-form");
const placeNameInput = newCardForm.querySelector('input[name="place-name"]');
const linkInput = newCardForm.querySelector('input[name="link"]');
const imagePopup = document.querySelector("#image-popup");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");
const closeImagePopupButton = imagePopup.querySelector(".popup__close");
const saveButton = editForm.querySelector(".popup__button");

// 🔹 Configuración de validación de formularios
const editProfileInputs = [
  {
    input: nameInput,
    errorSpan: editPopup.querySelector(".popup__input-error_type_name"),
  },
  {
    input: descriptionInput,
    errorSpan: editPopup.querySelector(".popup__input-error_type_description"),
  },
];

const newCardSubmitButton = newCardForm.querySelector(".popup__button");
const newCardInputs = [
  {
    input: placeNameInput,
    errorSpan: newCardPopup.querySelector(".popup__input-error_type_card-name"),
  },
  {
    input: linkInput,
    errorSpan: newCardPopup.querySelector(".popup__input-error_type_url"),
  },
];

setupFormValidation(newCardForm, newCardSubmitButton, newCardInputs);
setupFormValidation(editForm, saveButton, editProfileInputs);

// 🔹 Función para crear elementos de tarjeta
function getCardElement(name, link) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;

  // Event listeners internos de la tarjeta (estos SÍ permanecen, son por instancia)
  cardImage.addEventListener("click", function () {
    popupImage.src = cardImage.src;
    popupImage.alt = cardImage.alt;
    popupCaption.textContent = name;
    openModal(imagePopup);
  });

  likeButton.addEventListener("click", function () {
    likeButton.classList.toggle("card__like-button_is-active");
  });

  deleteButton.addEventListener("click", function () {
    cardElement.remove();
  });

  return cardElement;
}

function renderCard(name, link, container) {
  const cardElement = getCardElement(name, link);
  container.prepend(cardElement);
}

// 🔹 Funciones para gestionar listeners de popups (¡LA MEJORA CLAVE!)

// Handlers con nombre para overlay click (uno por popup)
function handleEditPopupOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(editPopup);
  }
}

function handleNewCardPopupOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(newCardPopup);
  }
}

function handleImagePopupOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(imagePopup);
  }
}

// Handler para tecla Escape (compartido)
function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup.popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Agregar listeners cuando se abre un popup
function addPopupListeners(popup, overlayClickHandler) {
  popup.addEventListener("click", overlayClickHandler);
  document.addEventListener("keydown", handleEscapeKey);
}

// Remover listeners cuando se cierra un popup
function removePopupListeners(popup, overlayClickHandler) {
  popup.removeEventListener("click", overlayClickHandler);

  // Solo removemos el keydown si NO hay otros popups abiertos
  const anyPopupOpen = document.querySelector(".popup.popup_is-opened");
  if (!anyPopupOpen) {
    document.removeEventListener("keydown", handleEscapeKey);
  }
}

// 🔹 Funciones para abrir/cerrar modales (con gestión dinámica de listeners)
function openModal(modal) {
  modal.classList.add("popup_is-opened");

  if (modal === editPopup) {
    addPopupListeners(editPopup, handleEditPopupOverlayClick);
  } else if (modal === newCardPopup) {
    addPopupListeners(newCardPopup, handleNewCardPopupOverlayClick);
  } else if (modal === imagePopup) {
    addPopupListeners(imagePopup, handleImagePopupOverlayClick);
  }
}

function closeModal(modal) {
  modal.classList.remove("popup_is-opened");

  if (modal === editPopup) {
    removePopupListeners(editPopup, handleEditPopupOverlayClick);
  } else if (modal === newCardPopup) {
    removePopupListeners(newCardPopup, handleNewCardPopupOverlayClick);
  } else if (modal === imagePopup) {
    removePopupListeners(imagePopup, handleImagePopupOverlayClick);
  }
}

// 🔹 Funciones de validación de formularios
function toggleinputError(input, errorSpan) {
  if (!errorSpan) return;

  if (input.validity.valid) {
    errorSpan.classList.remove("popup__input-error_active");
  } else {
    errorSpan.textContent = input.validationMessage;
    errorSpan.classList.add("popup__input-error_active");
  }
}

function toggleSubmitButton(form, submitButton) {
  if (!submitButton) return;
  submitButton.disabled = !form.checkValidity();
}

function setupFormValidation(form, submitButton, inputsConfig) {
  form.addEventListener("input", (evt) => {
    const targetInput = evt.target;
    const config = inputsConfig.find((conf) => conf.input === targetInput);
    if (config && config.errorSpan) {
      toggleinputError(targetInput, config.errorSpan);
    }
    toggleSubmitButton(form, submitButton);
  });

  inputsConfig.forEach(({ input, errorSpan }) => {
    if (errorSpan) {
      toggleinputError(input, errorSpan);
    }
  });
  toggleSubmitButton(form, submitButton);
}

// 🔹 Handlers de apertura de modales
function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;

  nameInput.dispatchEvent(new Event("input", { bubbles: true }));
  descriptionInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleOpenEditModal() {
  fillProfileForm();

  editProfileInputs.forEach(({ errorSpan }) => {
    if (errorSpan) {
      errorSpan.classList.remove("popup__input-error_active");
    }
  });

  openModal(editPopup);
}

function handleOpenNewCardModal() {
  newCardForm.reset();

  newCardInputs.forEach(({ errorSpan }) => {
    if (errorSpan) {
      errorSpan.classList.remove("popup__input-error_active");
    }
  });

  newCardSubmitButton.disabled = true;

  openModal(newCardPopup);
}

// 🔹 Handlers de envío de formularios
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  if (editForm.checkValidity()) {
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;

    editProfileInputs.forEach(({ errorSpan }) => {
      if (errorSpan) {
        errorSpan.classList.remove("popup__input-error_active");
      }
    });

    closeModal(editPopup);
  }
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  if (newCardForm.checkValidity()) {
    const name = placeNameInput.value;
    const link = linkInput.value;

    renderCard(name, link, cardsList);

    newCardInputs.forEach(({ errorSpan }) => {
      if (errorSpan) {
        errorSpan.classList.remove("popup__input-error_active");
      }
    });

    closeModal(newCardPopup);
    newCardForm.reset();
  }
}

// 🔹 Event listeners iniciales (botones de apertura y cierre directo)
addCardButton.addEventListener("click", handleOpenNewCardModal);

closeNewCardPopupButton.addEventListener("click", () => {
  closeModal(newCardPopup);
});

newCardForm.addEventListener("submit", handleCardFormSubmit);

editProfileButton.addEventListener("click", handleOpenEditModal);

closeEditPopupButton.addEventListener("click", () => {
  closeModal(editPopup);
});

editForm.addEventListener("submit", handleProfileFormSubmit);

closeImagePopupButton.addEventListener("click", () => {
  closeModal(imagePopup);
});

// 🔹 Renderizado inicial de tarjetas
initialCards.forEach((card) => {
  renderCard(card.name, card.link, cardsList);
});
