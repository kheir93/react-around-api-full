import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import SignForm from './SignForm'


const Register = ({ handleRegisterSubmit }) => {

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
    handleRegisterSubmit(email, password);
  }

return (
      <SignForm title="Sign up" onSubmit={handleSubmit} onChangeEmail={onChangeEmail} onChangePassword={onChangePassword} authMode="Already a member? " authAction="Log in here !" link={'/signin'} email={email} password={password}/>
  )
};

export default withRouter(Register);

