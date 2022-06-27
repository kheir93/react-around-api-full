import React, {useRef} from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({ isOpen, onClose, onOverlayClick, onUpdateAvatar }) {

  const avatarRef = useRef()

  //Submit updated avatar values//
  function handleSubmit(e) {
    e.preventDefault();
    //Value to pass to the external handler//
    onUpdateAvatar({
      avatar: avatarRef.current.value
  });}

  return (
    <PopupWithForm onSubmit={handleSubmit}  isOpen={isOpen} onClose={onClose} onOverlayClick={onOverlayClick} name="avatar" title="Change profile picture" buttonName="Save" submitValue="Submit" >
      <label className="form__field">
        <input type="url" className="form__input form__input_avatar" placeholder="Avatar image link" name="avatarURL" id="inputAvatar" ref={ avatarRef } required/>
        <span className={'form__input-error inputAvatar-error'}>Please enter a web address.</span>
      </label>
    </PopupWithForm>
  );
}
