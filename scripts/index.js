import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import {
  handleEditPopupOverlayClick,
  handleNewCardPopupOverlayClick,
  handleImagePopupOverlayClick,
  handleEscapeKey,
  addPopupListeners,
  removePopupListeners,
  openModal,
  closeModal,
} from "./utils.js";

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

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

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

const escapeHandler = handleEscapeKey(closeModal);

const editOverlayHandler = handleEditPopupOverlayClick(editPopup, closeModal);
const newCardOverlayHandler = handleNewCardPopupOverlayClick(
  newCardPopup,
  closeModal,
);
const imageOverlayHandler = handleImagePopupOverlayClick(
  imagePopup,
  closeModal,
);

function openModalWithListeners(modal) {
  modal.classList.add("popup_is-opened");
  if (modal === editPopup) {
    addPopupListeners(editPopup, editOverlayHandler, escapeHandler);
  } else if (modal === newCardPopup) {
    addPopupListeners(newCardPopup, newCardOverlayHandler, escapeHandler);
  } else if (modal === imagePopup) {
    addPopupListeners(imagePopup, imageOverlayHandler, escapeHandler);
  }
}

function closeModalWithListeners(modal) {
  modal.classList.remove("popup_is-opened");
  if (modal === editPopup) {
    removePopupListeners(editPopup, editOverlayHandler, escapeHandler);
  } else if (modal === newCardPopup) {
    removePopupListeners(newCardPopup, newCardOverlayHandler, escapeHandler);
  } else if (modal === imagePopup) {
    removePopupListeners(imagePopup, imageOverlayHandler, escapeHandler);
  }
}

function openImagePopup(name, link) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModalWithListeners(imagePopup);
}

const editFormValidator = new FormValidator(validationConfig, editForm);
editFormValidator.setEventListeners();

const newCardFormValidator = new FormValidator(validationConfig, newCardForm);
newCardFormValidator.setEventListeners();

initialCards.forEach((cardData) => {
  const card = new Card(cardData, "#card-template", openImagePopup);
  const cardElement = card.generateCard();
  cardsList.prepend(cardElement);
});

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
  openModalWithListeners(editPopup);
}

function handleOpenNewCardModal() {
  newCardFormValidator.resetForm();
  openModalWithListeners(newCardPopup);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  if (editForm.checkValidity()) {
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;
    const editErrorSpans = editForm.querySelectorAll(".popup__input-error");
    editErrorSpans.forEach((span) =>
      span.classList.remove("popup__input-error_active"),
    );
    closeModalWithListeners(editPopup);
  }
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  if (newCardForm.checkValidity()) {
    const name = placeNameInput.value;
    const link = linkInput.value;
    const card = new Card({ name, link }, "#card-template", openImagePopup);
    const cardElement = card.generateCard();
    cardsList.prepend(cardElement);
    newCardFormValidator.resetForm();
    closeModalWithListeners(newCardPopup);
  }
}

addCardButton.addEventListener("click", handleOpenNewCardModal);
closeNewCardPopupButton.addEventListener("click", () =>
  closeModalWithListeners(newCardPopup),
);
newCardForm.addEventListener("submit", handleCardFormSubmit);

editProfileButton.addEventListener("click", handleOpenEditModal);
closeEditPopupButton.addEventListener("click", () =>
  closeModalWithListeners(editPopup),
);
editForm.addEventListener("submit", handleProfileFormSubmit);

closeImagePopupButton.addEventListener("click", () =>
  closeModalWithListeners(imagePopup),
);
