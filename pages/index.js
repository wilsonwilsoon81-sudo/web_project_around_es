import Card from "../scripts/components/Card.js";
import Section from "../scripts/components/Section.js";
import PopupWithImage from "../scripts/components/PopupWithImage.js";
import PopupWithForm from "../scripts/components/PopupWithForm.js";
import UserInfo from "../scripts/components/UserInfo.js";

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

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

const imagePopup = new PopupWithImage("#image-popup");
imagePopup.setEventListeners();

const editProfilePopup = new PopupWithForm("#edit-popup", (values) => {
  userInfo.setUserInfo({
    name: values.name,
    job: values.description,
  });
  editProfilePopup.close();
});
editProfilePopup.setEventListeners();

const newCardPopup = new PopupWithForm("#new-card-popup", (values) => {
  const newCard = new Card(
    { name: values["place-name"], link: values.link },
    "#card-template",
    {
      handleCardClick: (name, link) => imagePopup.open(name, link),
      handleLikeClick: (id) => console.log("Like:", id),
      handleDeleteClick: (id, element) => element.remove(),
    },
  );
  const cardElement = newCard.generateCard();
  if (cardElement) {
    section.addItem(cardElement);
  }
  newCardPopup.close();
});
newCardPopup.setEventListeners();

function createCardElement(data) {
  try {
    const card = new Card(data, "#card-template", {
      handleCardClick: (name, link) => imagePopup.open(name, link),
      handleLikeClick: (id) => console.log("Like:", id),
      handleDeleteClick: (id, element) => element.remove(),
    });
    return card.generateCard();
  } catch (error) {
    console.error("❌ Error al crear tarjeta:", error);
    return null;
  }
}

const section = new Section(
  {
    items: initialCards,
    renderer: (data) => createCardElement(data),
  },
  ".cards__list",
);

section.renderItems();

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
