'use strict';

(function () {
  var feedback = document.querySelector('.modal--feedback form');
  var submitBtn = feedback.querySelector('.modal-feedback__submit');
  var userName = feedback.querySelector('#name');
  var userEmail = feedback.querySelector('#email');
  var agreement = feedback.querySelector('#agreement');

  var RE_EMAIL = /^[\w]{1,}\@[\w]{2,}\.[\w]{2,}$/;

  var isStorageSupport = true;
  var storage = '';

  var validity = {
    name: false,
    email: false,
    question: false,
  };

  var onFormSubmit = function () {
    if (isStorageSupport) {
      localStorage.setItem('name', userName.value);
      localStorage.setItem('email', userEmail.value);
    }
  };

  var checkValidity = function (input, target) {

    if (input && target.value) {
      input.classList.add('modal-feedback__input--success');
      validity[target.name] = true;
    } else if (input) {
      input.classList.remove('modal-feedback__input--success');
      validity[target.name] = false;
    }

    if (target === userEmail) {
      if (!RE_EMAIL.test(target.value)) {
        if (target.value) {
          input.classList.remove('modal-feedback__input--success');
          input.classList.add('modal-feedback__input--error');
        } else {
          input.classList.remove('modal-feedback__input--error');
        }

        validity[target.name] = false;
      } else {
        input.classList.add('modal-feedback__input--success');
        input.classList.remove('modal-feedback__input--error');

        validity[target.name] = true;
      }
    }

    if (agreement.checked && validity.name && validity.email && validity.question) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  };

  var ontextFieldInput = function (evt) {
    var input = evt.target.closest('.modal-feedback__input');

    checkValidity(input, evt.target);
  };

  try {
    storage = localStorage.getItem('name');
  } catch (err) {
    isStorageSupport = false;
  }

  if (storage) {
    userName.value = localStorage.getItem('name');
    userEmail.value = localStorage.getItem('email');

    checkValidity(userName.closest('.modal-feedback__input'), userName);
    checkValidity(userEmail.closest('.modal-feedback__input'), userEmail);
  }

  submitBtn.disabled = true;

  feedback.addEventListener('input', ontextFieldInput);
  feedback.addEventListener('submit', onFormSubmit);
})();
