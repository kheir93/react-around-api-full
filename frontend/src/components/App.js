import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, withRouter, useHistory } from 'react-router-dom';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import Tooltip from "./Tooltip";
import { CurrentUserContext } from "../contexts/CurrentUserContext"
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import { register, authorize, checkToken } from "../utils/auth";
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

function App() {

  //State management//
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardDelete, setCardDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [tooltipWindow, setTooltipWindow] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('jwt'))

  const history = useHistory();

  const handleLogin = () => {
    setLoggedIn(true);
    history.push("/");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/signin');
    setCurrentUser({})
  }

  const handleRegisterSubmit = (email, password) => {
    register(email, password)
      .then((res) => {
        if (res) {
          setTooltipWindow(true);
          history.push('/signin');
        } else {
          console.log('Something went wrong.');
          setTooltipWindow(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setTooltipWindow(false);
      })
      .finally(() => setTooltipOpen(true))
    };

  const handleLoginSubmit = (email, password) => {
    if (!email || !password) {
      return Promise.reject(new Error('User with this ID not found'))
    }
    authorize(email, password)
      .then((res) => {
        if (res.token) {
          setCurrentUser(res.data);
          setToken(res.token);
          localStorage.setItem('jwt', res.token);
          handleLogin();
          // handleTokenCheck();
        }
        localStorage.removeItem('jwt');
      })
      .catch((err) => console.log(err)
    )}

  // Cards and profile rendering//
  // useEffect(() => {
  //   const jwt = localStorage.getItem("jwt");
  //   if (jwt && loggedIn) {
  //   api.getAppInfo()
  //     .then(([profile, cardData]) => {
  //       setCurrentUser(profile)
  //       setCards(cardData)
  //     })
  //     .catch(err => console.log(err));
  //   }
  // }, [loggedIn]);

  // useEffect(() => {
  //   const jwt = localStorage.getItem("jwt");
  //   if (jwt && loggedIn) {
  //     api.getUserInfo()
  //       .then((profile) => {
  //         setCurrentUser(profile.data)
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //     api.getInitialCards()
  //       .then((data) => {
  //         setCards(data)
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //   }
  // }, [loggedIn])

  const handleTokenCheck = () => {
    if (token) {
      checkToken(token)
        .then((res) => {
          if (!res) {
            return res.status(400).send({
              message: "Token is missing or expired",
            });
          }
          setLoggedIn(true);
          history.push("/");
        })
        .catch((err) => console.log(err))
    } else {
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    if (token && loggedIn) {
      api.getInitialCards(token)
      .then((cards) => {
        setCards(cards)
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [loggedIn])

  useEffect(() => {
      handleTokenCheck(token)
  }, []);

  //Profile popup validation//
  function handleUpdateUser({ name, about }) {
    api.setUserInfo({
      name,
      about
    }, token)
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch(err => console.log(err))
  }

  //Avatar popup validation//
  function handleUpdateAvatar(user) {
    api.setUserAvatar({avatar: user.avatar}, token)
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups()
      })
      .catch(err => console.log(err))
  }

  //Add new card//
  function handleAddPlaceSubmit(card) {
    api.newCard({
      title: card.title,
      link: card.link
    }, token)
      .then((res) => {
        setCards([res.data, ...cards]);
        closeAllPopups()
      })
      .catch(err => console.log(err))
  }

  //Delete button//
  function handleDeleteClick(card) {
    setIsDeletePopupOpen(true);
    setCardDelete(card)
  };

  function handleCardDelete(card) {
    api.removeCard( card._id , token)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  //Likes handling//
  function handleCardLike(card) {
    //Like status//
    const isLiked = card.likes.some((user) => user === currentUser._id);
    //Like status management//
    if (isLiked) {
      api.removeLike(card._id, token).then((res) => {
        setCards((state) => state.map((currentCard) =>
          currentCard._id === card._id ? res.data : currentCard
          )
        )
      })
        .catch(err => console.log(err));
    } else {
      api.addLike(card._id, token).then((res) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? res.data : currentCard
          )
        )
      })
        .catch(err => console.log(err));
    }
  }

  // function handleCardLike(card) {
  //   //Like status//
  //   const isLiked = card.likes.some((user) => user === currentUser._id);
  //   //Like status management//
  //   isLiked ? api.removeLike(card._id, token)
  //     .then((res) => {
  //       const newCard = cards.map((currentCard) => currentCard._id === card._id ? res.data : currentCard)
  //       setCards((newCard)
  //       )
  //     })
  //     .catch(err => console.log(err))
  //     : api.addLike(card._id, token)
  //       .then((res) => {
  //         const newCard = cards.map((currentCard) => currentCard._id === card._id ? res.data : currentCard)
  //         setCards((newCard)
  //         )
  //       })
  //       .catch(err => console.log(err));
  // }

  //Profile button//
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  //Add button//
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  //Avatar icon//
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  //Image zoomin//
  function handleCardClick(card) {
    setSelectedCard(card);
  };

  //Popup closing management//
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard(null);
    setTooltipOpen(false);
  }

  //Escape key binding//
  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }
    document.addEventListener('keydown', closeByEscape)
    return () => document.removeEventListener('keydown', closeByEscape)
  }, [])

  //Close popups on overlay clicks//
  function handleOverlayClick(e) {
    if (e.target.classList.contains("popup")) {
      closeAllPopups()
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header logout={handleLogout} userEmail={localStorage.getItem('email')} signup={<Redirect to="/signup" />} />
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn} >
            <Main
              onEditAvatarClick={handleEditAvatarClick}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onCardDelete={handleDeleteClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              cards={cards}>
            </Main>
          </ProtectedRoute>
          <Route path="/signin">
            <Login handleLoginSubmit={handleLoginSubmit}  />
          </Route>
          <Route path="/signup">
            <Register handleRegisterSubmit={handleRegisterSubmit} />
          </Route>
          <Route path="*">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <Footer />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onOverlayClick={handleOverlayClick} onUpdateAvatar={handleUpdateAvatar} />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onOverlayClick={handleOverlayClick} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onOverlayClick={handleOverlayClick} onAddPlaceSubmit={handleAddPlaceSubmit} />

        <DeleteConfirmationPopup isOpen={isDeletePopupOpen} card={cardDelete} onClose={closeAllPopups} onOverlayClick={handleOverlayClick} onDeleteConfirmation={handleCardDelete} />

        <ImagePopup card={selectedCard} name={'place'} onClose={closeAllPopups} overlayCloseByClick={closeAllPopups} onOverlayClick={handleOverlayClick} />
        <Tooltip isOpen={tooltipOpen} unionStatus={tooltipWindow} onClose={closeAllPopups} onOverlayClick={handleOverlayClick} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
