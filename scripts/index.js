// ═════════════════════════════════════════════════════════════
// 📦 SECCIÓN 1: DATOS Y CONFIGURACIÓN GLOBAL
// ═════════════════════════════════════════════════════════════

// Datos iniciales de tarjetas
const initialCards = [
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg",
  },
  {
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg",
  },
];

// ✅ Configuración para validación de formularios (REUTILIZABLE)
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 2: SELECTORES DEL DOM (Variables globales necesarias)
// ═════════════════════════════════════════════════════════════

const editProfileButton = document.querySelector(".profile__edit-button");
const editPopup = document.querySelector("#edit-popup");
const closeEditPopupButton = editPopup.querySelector(".popup__close");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const nameInput = editPopup.querySelector('input[name="name"]');
const descriptionInput = editPopup.querySelector('input[name="description"]');
const editForm = document.querySelector("#edit-profile-form");
const cardsList = document.querySelector(".cards__list");
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

// ═════════════════════════════════════════════════════════════
// 🗂️ SECCIÓN 3: DEFINICIÓN DE CLASES (Card y FormValidator)
// ═════════════════════════════════════════════════════════════

// ✅ CLASE Card - DEBE IR ANTES DE USARLA
class Card {
  constructor(data, templateSelector, onImageClick) {
    this._name = data.name;
    this._link = data.link;
    this._templateSelector = templateSelector;
    this._onImageClick = onImageClick;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardElement;
  }

  _handleLikeClick(evt) {
    evt.target.classList.toggle("card__like-button_is-active");
  }

  _handleDeleteClick() {
    this._element.remove();
  }

  _handleImageClick() {
    if (typeof this._onImageClick === "function") {
      this._onImageClick(this._name, this._link);
    }
  }

  _setEventListeners() {
    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => this._handleImageClick());

    this._element
      .querySelector(".card__like-button")
      .addEventListener("click", this._handleLikeClick.bind(this));

    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", this._handleDeleteClick.bind(this));
  }

  generateCard() {
    this._element = this._getTemplate();
    this._element.querySelector(".card__title").textContent = this._name;
    const cardImage = this._element.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;
    this._setEventListeners();
    return this._element;
  }
}

// ✅ CLASE FormValidator - DEBE IR ANTES DE USARLA
class FormValidator {
  constructor(config, formElement) {
    this._config = config;
    this._formElement = formElement;
    this._inputList = Array.from(
      this._formElement.querySelectorAll(this._config.inputSelector),
    );
    this._buttonElement = this._formElement.querySelector(
      this._config.submitButtonSelector,
    );
  }

  _showInputError(inputElement, errorMessage) {
    const inputTypeClass = Array.from(inputElement.classList).find((cls) =>
      cls.startsWith("popup__input_type_"),
    );
    if (!inputTypeClass) return;
    const errorClass = inputTypeClass.replace(
      "popup__input_type_",
      "popup__input-error_type_",
    );
    const errorSpan = this._formElement.querySelector(`.${errorClass}`);

    if (!errorSpan) return;

    inputElement.classList.add(this._config.inputErrorClass);
    errorSpan.textContent = inputElement.validationMessage;
    errorSpan.classList.add(this._config.errorClass);
  }

  _hideInputError(inputElement) {
    const inputTypeClass = Array.from(inputElement.classList).find((cls) =>
      cls.startsWith("popup__input_type_"),
    );

    if (!inputTypeClass) return;

    const errorClass = inputTypeClass.replace(
      "popup__input_type_",
      "popup__input-error_type_",
    );
    const errorSpan = this._formElement.querySelector(`.${errorClass}`);

    if (!errorSpan) return;

    inputElement.classList.remove(this._config.inputErrorClass);
    errorSpan.classList.remove(this._config.errorClass);
    errorSpan.textContent = "";
  }

  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _toggleButtonState() {
    const hasInvalidInput = this._inputList.some(
      (input) => !input.validity.valid,
    );
    this._buttonElement.disabled = hasInvalidInput;
  }

  _setInputListeners() {
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });

      // ✅ Validación inicial al cargar (para estado del botón)
      this._checkInputValidity(inputElement);
    });
  }

  _setEventListeners() {
    this._setInputListeners();
    this._toggleButtonState();
  }

  setEventListeners() {
    this._setEventListeners();
  }
}

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 4: FUNCIONES DE POPUPS (openModal, closeModal, etc.)
// ═════════════════════════════════════════════════════════════

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

// ✅ Función helper para abrir popup de imagen (callback para Card)
function openImagePopup(name, link) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imagePopup);
}

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 5: GESTIÓN DINÁMICA DE EVENT LISTENERS PARA POPUPS
// ═════════════════════════════════════════════════════════════

function handleEditPopupOverlayClick(evt) {
  if (evt.target === evt.currentTarget) closeModal(editPopup);
}

function handleNewCardPopupOverlayClick(evt) {
  if (evt.target === evt.currentTarget) closeModal(newCardPopup);
}

function handleImagePopupOverlayClick(evt) {
  if (evt.target === evt.currentTarget) closeModal(imagePopup);
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup.popup_is-opened");
    if (openedPopup) closeModal(openedPopup);
  }
}

function addPopupListeners(popup, overlayClickHandler) {
  popup.addEventListener("click", overlayClickHandler);
  document.addEventListener("keydown", handleEscapeKey);
}

function removePopupListeners(popup, overlayClickHandler) {
  popup.removeEventListener("click", overlayClickHandler);
  const anyPopupOpen = document.querySelector(".popup.popup_is-opened");
  if (!anyPopupOpen) {
    document.removeEventListener("keydown", handleEscapeKey);
  }
}

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 6: HANDLERS DE FORMULARIOS Y MODALES
// ═════════════════════════════════════════════════════════════

function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  nameInput.dispatchEvent(new Event("input", { bubbles: true }));
  descriptionInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleOpenEditModal() {
  fillProfileForm();
  const editErrorSpans = editForm.querySelectorAll(".popup__input-error");
  editErrorSpans.forEach((span) =>
    span.classList.remove("popup__input-error_active"),
  );

  openModal(editPopup);
}

function handleOpenNewCardModal() {
  newCardForm.reset();
  const newCardErrorSpans = newCardForm.querySelectorAll(".popup__input-error");
  newCardErrorSpans.forEach((span) =>
    span.classList.remove("popup__input-error_active"),
  );
  openModal(newCardPopup);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  if (editForm.checkValidity()) {
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;
    editProfileInputs.forEach(({ errorSpan }) => {
      if (errorSpan) errorSpan.classList.remove("popup__input-error_active");
    });
    closeModal(editPopup);
  }
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  if (newCardForm.checkValidity()) {
    const name = placeNameInput.value;
    const link = linkInput.value;
    // ✅ Usamos la clase Card aquí
    const card = new Card({ name, link }, "#card-template", openImagePopup);
    const cardElement = card.generateCard();
    cardsList.prepend(cardElement);
    newCardInputs.forEach(({ errorSpan }) => {
      if (errorSpan) errorSpan.classList.remove("popup__input-error_active");
    });
    closeModal(newCardPopup);
    newCardForm.reset();
  }
}

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 7: INSTANCIACIÓN DE CLASES Y CONFIGURACIÓN INICIAL
// ═════════════════════════════════════════════════════════════

// ✅ Instanciar validadores de formularios
const editFormValidator = new FormValidator(validationConfig, editForm);
editFormValidator.setEventListeners();

const newCardFormValidator = new FormValidator(validationConfig, newCardForm);
newCardFormValidator.setEventListeners();

// ✅ Renderizar tarjetas iniciales usando la clase Card
initialCards.forEach((cardData) => {
  const card = new Card(cardData, "#card-template", openImagePopup);
  const cardElement = card.generateCard();
  cardsList.prepend(cardElement);
});

// ═════════════════════════════════════════════════════════════
// 🔹 SECCIÓN 8: EVENT LISTENERS GLOBALES (Botones, submits, etc.)
// ═════════════════════════════════════════════════════════════

addCardButton.addEventListener("click", handleOpenNewCardModal);
closeNewCardPopupButton.addEventListener("click", () =>
  closeModal(newCardPopup),
);
newCardForm.addEventListener("submit", handleCardFormSubmit);

editProfileButton.addEventListener("click", handleOpenEditModal);
closeEditPopupButton.addEventListener("click", () => closeModal(editPopup));
editForm.addEventListener("submit", handleProfileFormSubmit);

closeImagePopupButton.addEventListener("click", () => closeModal(imagePopup));
