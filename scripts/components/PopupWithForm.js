import Popup from "./Popup.js";
import FormValidator from "./FormValidator.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleSubmit) {
    super(popupSelector);
    this._handleSubmit = handleSubmit;
    this._form = this._popup.querySelector(".popup__form");
    this._validator = new FormValidator(validationConfig, this._form);
  }

  _getInputValues() {
    const values = {};
    this._form.querySelectorAll(".popup__input").forEach((input) => {
      values[input.name] = input.value;
    });
    return values;
  }

  setEventListeners() {
    super.setEventListeners();

    this._validator.setEventListeners();

    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      if (this._form.checkValidity()) {
        this._handleSubmit(this._getInputValues());
      }
    });
  }

  close() {
    this._form.reset();

    this._form.querySelectorAll(".popup__input-error").forEach((span) => {
      span.classList.remove("popup__input-error_active");
    });
    super.close();
  }

  resetValidation() {
    this._form.querySelectorAll(".popup__input-error").forEach((span) => {
      span.classList.remove("popup__input-error_active");
    });

    const button = this._form.querySelector(".popup__button");
    if (button) button.disabled = false;
  }
}
