import React from 'react';
import Card from './Card';
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Main({onEditAvatarClick, onEditProfileClick, onAddPlaceClick, onCardClick, onBinClick, cards, onCardLike, onCardDelete}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <button className="profile__avatar-button" onClick={onEditAvatarClick}>
          <img className="profile__avatar"  src={currentUser.avatar} alt="avatar"/>
        </button>
        <h1 className="profile__name">{currentUser.name}</h1>
        <button className="profile__edit-button" onClick={onEditProfileClick} type="button"></button>
        <p className="profile__about">{currentUser.about}</p>
        <button className="profile__add-button" onClick={onAddPlaceClick} type="button"></button>
      </section>
      <section>
        <ul className="elements">
          {cards.map((card) => (
            <Card
              key={card._id}
              like={card.like}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />))}
        </ul>
      </section>
    </main>
  );
}


