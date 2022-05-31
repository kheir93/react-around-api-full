import React, {useState, useEffect} from 'react';
import PopupWithForm from './PopupWithForm';

export default function AddPlacePopup({isOpen, onClose, onOverlayClick,  onAddPlaceSubmit}) {

  //State management//
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  //Place name field change management//
  function handleChangeTitle(e) {
    setTitle(e.target.value);
  };

  //Place URL field change management//
  function handleChangeLink(e) {
    setLink(e.target.value);
  };

  //Field content//
  useEffect(() => {
    setTitle('');
    setLink('');
  }, [isOpen])

  ////Submit updated place values//
  function handleSubmit(e) {
    e.preventDefault();
    onAddPlaceSubmit({title, link})
  }

  return (
    <PopupWithForm onSubmit={handleSubmit} isOpen={isOpen} onClose={onClose} onOverlayClick={onOverlayClick} name="add" title="New place" buttonName="Create" submitValue="Submit">
      <label className="form__field" >
        <input type="text" className="form__input form__input_title" onChange={handleChangeTitle} placeholder="Title" value={title} name="title" required minLength="2" maxLength="30"/>
        <span className="form__input-error inputTitle-error">Please fill out this field.</span>
      </label>
      <label className="form__field">
        <input type="url" className="form__input form__input_image" onChange={handleChangeLink} placeholder="Image link" value={link} name="url" required/>
        <span className="form__input-error inputImage-error">Please enter a web address.</span>
      </label>
    </PopupWithForm>
  );
}
