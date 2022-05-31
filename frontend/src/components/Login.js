import React, { useState } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import * as auth from '../utils/auth'
import { AppContext } from "../contexts/CurrentUserContext"
import SignForm from './SignForm';

const Login = ({ handleLoginSubmit }) => {
  // static contextType = AppContext;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
  }

  return (
      <SignForm title="Log in" onSubmit={handleSubmit} onChangeEmail={onChangeEmail} onChangePassword={onChangePassword} authMode="Not a member yet? " authAction="Sign up here!" link={'/signup'} email={email} password={password}/>
  )
};

export default withRouter(Login);
