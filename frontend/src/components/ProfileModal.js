import React from 'react';

export default function ProfileModal() {

  return (
    <div className='form'>
      <label className="form__field">
        <input type="text" className="form__input form__input_name" placeholder="name" name="name" defaultValue="Jacques Cousteau" required minLength="2" maxLength="40"/>
        <span className="form__input-error inputName-error">Please fill out this field.</span>
      </label>
      <label className="form__field">
        <input type="text" className="form__input form__input_job" placeholder="about me" name="about" defaultValue="Explorer" required minLength="2" maxLength="200"/>
        <span className="form__input-error inputJob-error">Please fill out this field.</span>
      </label>
    </div>
  );
}
