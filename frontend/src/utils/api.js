class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }
  //Api ATHENTICATION//

  _checkResponse(res) {
    if (res.ok) {
      return res.json()
    } else {
      return Promise.reject(`Error ${res.status}`);
    }
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()])
  }

  getUserInfo(jwt) {
    return fetch(this._baseUrl + '/users/me', {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
    })
      .then(this._checkResponse)
  }

  setUserInfo(data, jwt) {
    return fetch(this._baseUrl + '/users/me', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
      .then(this._checkResponse)
  }

  setUserAvatar({ avatar, jwt }) {
    return fetch(this._baseUrl + '/users/me/avatar', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar
      })
    })
      .then(this._checkResponse)
  }

  getInitialCards(jwt) {
    return fetch(this._baseUrl + '/cards', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
    })
      .then(this._checkResponse)
  }

  newCard({ title, link }, jwt) {
    return fetch(this._baseUrl + '/cards', {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        name: title,
        link: link,
      })
    })
      .then(this._checkResponse)
  }

  removeCard({ cardId }, jwt) {
    return fetch(this._baseUrl + '/cards/' + cardId, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE'
    })
      .then(this._checkResponse)
  }

  addLike(cardId, jwt) {
    return fetch(this._baseUrl + '/cards/likes/' + cardId, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    })
      .then(this._checkResponse)
  }

  removeLike(cardId, jwt) {
    return fetch(this._baseUrl + '/cards/likes/' + cardId, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    })
      .then(this._checkResponse)
  }
}

// const api = new Api({
//     baseUrl: 'https://around.nomoreparties.co/v1/group-13',
//     headers: {
//       Authorization: "4b9bb316-6c12-461f-86a3-76e6af7325ba",
//       "Content-Type": "application/json"
//     }
//   });

// const api = new Api({
//   baseUrl: 'https://api.kheir93.students.nomoreparties.sbs',
// });

const api = new Api({
  baseUrl: 'http://localhost:3000',
});

export default api
