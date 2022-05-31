import React from 'react'

export default function Navbar({ onClick, isClicked }) {

  return (
    <button className={`navbar ${isClicked ? 'navbar_remove' : ''}`} onClick={onClick} >
      <div className="navbar__button" />
      <div className="navbar__button" />
      <div className="navbar__button" />
    </button>
  );
}
