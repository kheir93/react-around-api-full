import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function DeleteConfirmationPopup({isOpen, onClose, onOverlayClick, onDeleteConfirmation, card}) {

  function handleSubmit(e) {
    e.preventDefault();
    onDeleteConfirmation(card);
  }

  return (
     <PopupWithForm onSubmit={handleSubmit} isOpen={isOpen} onClose={onClose} onOverlayClick={onOverlayClick} name="delete" title="Are you sure ?" buttonName="Yes"/>
  )
}
