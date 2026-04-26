import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);

    this._confirmButton = this._popup.querySelector(".popup__button_confirm");
    this._handleConfirm = null;
  }

  setEventListeners() {
    super.setEventListeners();

    if (this._confirmButton) {
      this._confirmButton.addEventListener("click", (evt) => {
        evt.preventDefault();
        this._handleConfirmClick();
      });
    }
  }

  _handleConfirmClick() {
    if (typeof this._handleConfirm === "function") {
      this._handleConfirm();
    }
  }

  open(handleConfirmCallback) {
    this._handleConfirm = handleConfirmCallback;
    super.open();
  }
}
