class FormValidator {

  constructor(defaultFormConfig, formElement) {
    this._defaultFormConfig = defaultFormConfig,
    this._formElement = formElement,
    this._inputList = Array.from(this._formElement.querySelectorAll(this._defaultFormConfig.inputSelector)),
    this._buttonElement = this._formElement.querySelector(this._defaultFormConfig.formSubmit)
};

  _showInputError(inputElement, errorMessage) {
    const errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(this._defaultFormConfig.inputErrorClass);
    errorElement.classList.add(this._defaultFormConfig.errorClass);
    errorElement.textContent = errorMessage;
    };

  _hideInputError(inputElement) {
    const errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(this._defaultFormConfig.inputErrorClass);
    errorElement.classList.remove(this._defaultFormConfig.errorClass);
    errorElement.textContent = "";
    };

  _hasInvalidInput() {
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
      });
    };

  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      return this._showInputError(inputElement, inputElement.validationMessage);
    }
    this._hideInputError(inputElement);
  };

  _toggleButtonState() {
    if (this._hasInvalidInput(this._inputList)) {
      this.disableButton()
    } else {
      this.enableButton()
    }
  };

  disableButton() {
    this._buttonElement.classList.add(this._defaultFormConfig.formSubmitInactive);
    this._buttonElement.disabled = true;
  }

  enableButton() {
    this._buttonElement.classList.remove(this._defaultFormConfig.formSubmitInactive);
    this._buttonElement.disabled = false;
  }

  _setEventListeners() {
    this._toggleButtonState();
    this.resetValidation();
    this._inputList.forEach(inputElement => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });
    })
  }

  resetValidation() {
    this._formElement.addEventListener("reset", () => {
      setTimeout(() => {
        this._toggleButtonState();
      });
      this._inputList.forEach((inputElement) => {
        this._hideInputError(inputElement)
      })
    });
  }

  enableValidation() {
    this._formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });
    this._setEventListeners();
  }
};

export default FormValidator;
