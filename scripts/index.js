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

setupFormValidation(editForm, saveButton, editProfileInputs);

function getCardElement(
  name = "Sin título",
  link = "./images/placeholder.jpg",
) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;

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

function openModal(modal) {
  modal.classList.add("popup_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
}

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

function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;

  nameInput.dispatchEvent(new Event("input", { bubbles: true }));
  descriptionInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleOpenEditModal() {
  fillProfileForm();
  openModal(editPopup);
}

function handleOpenNewCardModal() {
  openModal(newCardPopup);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  if (editForm.checkValidity()) {
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;

    // Ocultar errores al cerrar el popup
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

  const name = placeNameInput.value;
  const link = linkInput.value;

  renderCard(name, link, cardsList);

  closeModal(newCardPopup);

  newCardForm.reset();
}

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

initialCards.forEach((card) => {
  renderCard(card.name, card.link, cardsList);
});

closeImagePopupButton.addEventListener("click", () => {
  closeModal(imagePopup);
});
