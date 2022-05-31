import React, {useState, useEffect, useContext} from "react";
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function EditProfilePopup({isOpen, onClose, onOverlayClick, onUpdateUser}) {

  //State management//
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // Subscription to the context
  const currentUser = useContext(CurrentUserContext);

  //Profile fields sync//
  useEffect(() => {
    setName(currentUser.name || '');
    setDescription(currentUser.about || '')
  }, [currentUser, isOpen])

  //Name field change management//
  function handleChangeName(e) {
    setName(e.target.value);
  }

  //About field change management//
  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  //Submit updated profile values//
  function handleSubmit(e) {
    e.preventDefault();
    //Value to pass to the external handler//
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm onSubmit={handleSubmit} isOpen={isOpen} onClose={onClose} onOverlayClick={onOverlayClick} name="edit" title="Edit Profile" buttonName="Save" submitValue="Submit">
      <label className="form__field" >
        <input type="text" className="form__input form__input_name" onChange={handleChangeName} placeholder="name" name="name" value={name} required minLength="2" maxLength="40"/>
        <span className="form__input-error inputName-error">Please fill out this field.</span>
      </label>
      <label className="form__field">
        <input type="text" className="form__input form__input_job" onChange={handleChangeDescription} placeholder="about me" name="about" value={description} required minLength="2" maxLength="200"/>
        <span className="form__input-error inputJob-error">Please fill out this field.</span>
      </label>
    </PopupWithForm>
  );
}
