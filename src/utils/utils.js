export function handleEditPopupOverlayClick(editPopup, closeModal) {
  return function (evt) {
    if (evt.target === evt.currentTarget) {
      closeModal(editPopup);
    }
  };
}

export function handleNewCardPopupOverlayClick(newCardPopup, closeModal) {
  return function (evt) {
    if (evt.target === evt.currentTarget) {
      closeModal(newCardPopup);
    }
  };
}

export function handleImagePopupOverlayClick(imagePopup, closeModal) {
  return function (evt) {
    if (evt.target === evt.currentTarget) {
      closeModal(imagePopup);
    }
  };
}

export function handleEscapeKey(closeModal) {
  return function (evt) {
    if (evt.key === "Escape") {
      const openedPopup = document.querySelector(".popup.popup_is-opened");
      if (openedPopup) {
        closeModal(openedPopup);
      }
    }
  };
}

export function addPopupListeners(popup, overlayClickHandler, escapeHandler) {
  popup.addEventListener("click", overlayClickHandler);
  document.addEventListener("keydown", escapeHandler);
}

export function removePopupListeners(
  popup,
  overlayClickHandler,
  escapeHandler,
) {
  popup.removeEventListener("click", overlayClickHandler);
  const anyPopupOpen = document.querySelector(".popup.popup_is-opened");
  if (!anyPopupOpen) {
    document.removeEventListener("keydown", escapeHandler);
  }
}

export function openModal(
  modal,
  addListenersFn,
  popup,
  overlayHandler,
  escapeHandler,
) {
  modal.classList.add("popup_is-opened");
  if (addListenersFn) {
    addListenersFn(popup, overlayHandler, escapeHandler);
  }
}

export function closeModal(
  modal,
  removeListenersFn,
  popup,
  overlayHandler,
  escapeHandler,
) {
  modal.classList.remove("popup_is-opened");
  if (removeListenersFn) {
    removeListenersFn(popup, overlayHandler, escapeHandler);
  }
}
