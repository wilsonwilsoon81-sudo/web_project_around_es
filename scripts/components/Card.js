export default class Card {
  constructor(
    data,
    templateSelector,
    { handleCardClick, handleLikeClick, handleDeleteClick },
  ) {
    this._name = data.name;
    this._link = data.link;
    this._cardId = data._id || data.id || null;
    this._templateSelector = templateSelector;
    this._onCardClick = handleCardClick;
    this._onLikeClick = handleLikeClick;
    this._onDeleteClick = handleDeleteClick;
  }

  _getTemplate() {
    const template = document.querySelector(this._templateSelector);
    if (!template) {
      console.error(`Template no encontrado: ${this._templateSelector}`);
      return null;
    }
    return template.content.querySelector(".card").cloneNode(true);
  }

  _handleLikeClick(evt) {
    evt.currentTarget.classList.toggle("card__like-button_is-active");

    if (typeof this._onLikeClick === "function" && this._cardId) {
      this._onLikeClick(this._cardId);
    }
  }

  _handleDeleteClick() {
    if (typeof this._onDeleteClick === "function") {
      this._onDeleteClick(this._cardId, this._element);
    }

    this._element.remove();
  }

  _handleImageClick() {
    if (typeof this._onCardClick === "function") {
      this._onCardClick(this._name, this._link);
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
    if (!this._element) return null;

    this._element.querySelector(".card__title").textContent = this._name;
    const cardImage = this._element.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;

    this._setEventListeners();
    return this._element;
  }
}
