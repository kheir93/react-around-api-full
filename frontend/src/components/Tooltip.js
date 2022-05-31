import React from 'react';
import union from '../images/union.svg';
import obviouslyNotUnion from '../images/obviouslyNotUnion.svg'

const ToolTip = ({ onOverlayClick, unionStatus, isOpen, onClose }) => {
  return (
    <div className={`popup tooltip-modal ${isOpen ? 'popup_open' : ''}`} onClick={onOverlayClick}>{
      !unionStatus ?
      <div className="form">
          <button className="form__close form__close_center" type="button" onClick={onClose}></button>
          <img className="form__image" src={ obviouslyNotUnion } />
          <p className="form__title form__title_center">Oops, something went wrong! Please try again.</p>
      </div>
      :
      <div className="form">
          <button className="form__close form__close_center" type="button" onClick={onClose}></button>
          <img className="form__image" src={ union } />
          <p className="form__title form__title_center">Success! You have now been registered.</p>
      </div>
  }</div>
  )
}

export default ToolTip;
