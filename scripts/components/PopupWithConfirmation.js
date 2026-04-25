// scripts/components/PopupWithConfirmation.js

import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);

    // ✅ Obtener el botón de confirmar (usa la clase base popup__button)
    this._confirmButton = this._popup.querySelector(".popup__button_confirm");
    this._handleConfirm = null;
  }

  setEventListeners() {
    // ✅ Llamar al método padre para configurar close, escape, overlay
    super.setEventListeners();

    // ✅ Configurar el botón de confirmar
    if (this._confirmButton) {
      this._confirmButton.addEventListener("click", (evt) => {
        evt.preventDefault(); // Prevenir comportamiento por defecto
        this._handleConfirmClick();
      });
    }
  }

  _handleConfirmClick() {
    // ✅ Ejecutar el callback si existe
    if (typeof this._handleConfirm === "function") {
      this._handleConfirm();
    }
    // ✅ El popup se cierra desde el callback en index.js
  }

  // ✅ Método para abrir con el callback de confirmación
  open(handleConfirmCallback) {
    this._handleConfirm = handleConfirmCallback;
    super.open(); // Usar el método padre para abrir
  }
}
