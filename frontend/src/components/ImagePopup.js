import React from 'react';

export default function ImagePopup({card, onClose, name, onOverlayClick}) {

   return (
    <div className={`popup ${name}-modal  ${card ? 'popup_open' : ''}`} name={name} onClick={onOverlayClick}>
      <figure className="place-modal__figure">
        <button className="popup__close-button" onClick={onClose}></button>
        <img className="place-modal__image" type="image" name="place" src={card ? card.link : ''} alt={card ? card.name : ''}/>
        <h2 className="place-modal__caption">{card ? card.name : ''}</h2>
      </figure>
    </div>
  );
}
