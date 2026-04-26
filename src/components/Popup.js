export default class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this._closeButton = this._popup?.querySelector(".popup__close");
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    if (!this._popup) return;
    this._popup.classList.add("popup_is-opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    if (!this._popup) return;
    this._popup.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    if (!this._popup) return;

    if (this._closeButton) {
      this._closeButton.addEventListener("click", () => this.close());
    }

    this._popup.addEventListener("click", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
  }
}
