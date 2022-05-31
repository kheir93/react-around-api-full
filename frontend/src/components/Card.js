import React from "react";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card({card, onCardClick, onCardDelete, onCardLike}) {

  const currentUser = React.useContext(CurrentUserContext);

  //Owner card checking//
  const isOwn = card.owner._id === currentUser._id;

  //Delete button class//
  const cardDeleteButtonClassName = (
    `card__delete ${isOwn ? 'card__delete_visible' : 'card__delete_hidden'}`
  );

  //Like ownage//
  const isLiked = card.likes.some(user => user._id === currentUser._id);

  //Like management//
  const cardLikeButtonClassName = (
    `card__like-icon ${isLiked ? 'card__like-icon_active' : ''}`
  );

  //Card image click click//
  function handleClick() {
    onCardClick(card)
  };

  //Card delete button click//
  function handleDeleteClick() {
    onCardDelete(card)
  };

  //Card like button click//
  function handleLikeClick() {
    onCardLike(card)
  }

  return (
    <li className="card">
      <button className={cardDeleteButtonClassName} type="button" onClick={handleDeleteClick}></button>
      <img className="card__image" alt={card.name}  src={card.link} onClick={handleClick}/>
      <h2 className="card__caption">{card.name}</h2>
      <div className="card__like" >
        <button className={cardLikeButtonClassName} onClick={handleLikeClick} type="button"></button>
        <p className="card__like-count">{card.likes.length}</p>
      </div>
    </li>
  );
}
