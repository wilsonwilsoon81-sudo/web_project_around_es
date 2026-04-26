export default class FormValidator {
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

  _showInputError(inputElement) {
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

  resetForm() {
    this._formElement.reset();
    this._inputList.forEach((input) => this._hideInputError(input));
    this._toggleButtonState();
  }
}
