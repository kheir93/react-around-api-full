import React, { useState } from 'react';
import logo from '../images/Logo.svg';
import Navbar from './Navbar'
import { Route, Link, withRouter } from 'react-router-dom';

function Header({ logout, userEmail }) {
  const [mobile, setMobile] = useState(false)
  const [toggleNavbar, setToggleNavbar] = useState(false)
  const [buttonState, setButtonState] = useState(false)

  const toggleMobile = () => {
    setMobile(true);
    setToggleNavbar(true);
    setButtonState(true);
  }

  const toggleMenu = () => {
    setMobile(false);
    setToggleNavbar(false);
    setButtonState(false);
  }


  return (
    <div>
    <div className={`header__mobile ${mobile ? 'header__mobile_open  ' : ''}`} >
        <Route exact path="/">
          <p className="header__user-display-info header__user-display-info_display">{userEmail}</p>
          <button className="header__logout-button header__logout-button_display" onClick={logout}>Logout</button>
        </Route>

      </div>
    <header className="header">

      <img src={logo} className="logo" alt="logo" />

      <Route exact path="/">
          <button className={`header__close ${buttonState ? 'header__close_display' : ''}`} onClick={toggleMenu}></button>
        <Navbar onClick={toggleMobile} isClicked={toggleNavbar} />
        <p className="header__user-display-info">{userEmail}</p>
        <button className="header__logout-button" onClick={logout}>Log out</button>
      </Route>
      <Route exact path="/signin"><p className="header__auth-info"> <Link to="/signup" className="header__auth-link">Sign up</Link></p></Route>
      <Route exact path="/signup"><p className="header__auth-info"> <Link to="/signin" className="header__auth-link">Log in</Link></p></Route>


    </header>
    </div>
  );
}

export default withRouter(Header);
