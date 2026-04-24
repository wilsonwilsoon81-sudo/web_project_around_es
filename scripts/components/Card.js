export default class Card {
  constructor(
    data,
    templateSelector,
    { handleCardClick, handleLikeClick, handleDeleteClick },
    userId,
  ) {
    this._name = data.name;
    this._link = data.link;
    this._cardId = data._id || data.id || null;
    this._ownerId = data.owner?._id || data.owner || null;
    this._isLiked = data.isLiked ?? false;
    this._templateSelector = templateSelector;
    this._userId = userId;
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

  _setLikeStatus() {
    const likeButton = this._element.querySelector(".card__like-button");
    if (!likeButton) {
      console.error("❌ No se encontró .card__like-button");
      return;
    }

    if (this._isLiked) {
      likeButton.classList.add("card__like-button_is-active");
      console.log("❤️ Like activo aplicado");
    } else {
      likeButton.classList.remove("card__like-button_is-active");
      console.log("💔 Like inactivo aplicado");
    }
  }

  generateCard() {
    this._element = this._getTemplate();
    if (!this._element) return null;

    this._element.querySelector(".card__title").textContent = this._name;
    const cardImage = this._element.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;

    console.log("🔍 Card.generateCard() - Estado inicial:");
    console.log("   - this._name:", this._name);
    console.log("   - this._cardId:", this._cardId);
    console.log("   - this._isLiked:", this._isLiked);
    console.log("   - this._ownerId:", this._ownerId);

    this._setLikeStatus();

    this._checkOwner();

    this._setEventListeners();
    return this._element;
  }

  _checkOwner() {
    const deleteButton = this._element.querySelector(".card__delete-button");

    if (this._ownerId !== this._userId) {
      deleteButton.style.display = "none";
    }
  }

  _handleLikeClick(evt) {
    evt.currentTarget.classList.toggle("card__like-button_is-active");

    const isLiked = evt.currentTarget.classList.contains(
      "card__like-button_is-active",
    );

    this._isLiked = isLiked;

    console.log("🔄 _handleLikeClick - Nuevo estado:", isLiked);
    console.log("🔄 _handleLikeClick - cardId:", this._cardId);

    if (typeof this._onLikeClick === "function" && this._cardId) {
      this._onLikeClick(this._cardId, isLiked);
    }
  }
  _handleDeleteClick() {
    if (typeof this._onDeleteClick === "function") {
      this._onDeleteClick(this._cardId, this._element);
    }
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

    this._setLikeStatus();
    this._checkOwner();

    this._setEventListeners();
    return this._element;
  }

  updateLikeStatus(isLiked) {
    this._isLiked = isLiked;
    this._setLikeStatus();
  }
}
