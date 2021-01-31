'use strict';

(function () {
  var HTML = document.querySelector('html');
  var siteNav = document.querySelector('.site-nav');

  function Modal(modal, closeBtn) {
    this.modal = modal;
    this.closeBtn = closeBtn;

    this.onModalLinkClick = function (evt) {
      evt.preventDefault();

      openModal(modal);

      closeBtn.addEventListener('click', onCloseBtnClick);
      modal.addEventListener('click', onModalClick);
      document.addEventListener('keydown', onEscPress);
    };

    this.onCloseBtnClick = function () {
      closeBtn.removeEventListener('click', onCloseBtnClick);
      modal.removeEventListener('click', onModalClick);
      document.removeEventListener('keydown', onEscPress);

      closeModal(modal);
    };

    this.onModalClick = function (evt) {
      if (evt.target === modal) {
        closeBtn.removeEventListener('click', onCloseBtnClick);
        modal.removeEventListener('click', onModalClick);
        document.removeEventListener('keydown', onEscPress);

        closeModal(modal);
      }
    };

    this.onEscPress = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();

        closeBtn.removeEventListener('click', onCloseBtnClick);
        modal.removeEventListener('click', onModalClick);
        document.removeEventListener('keydown', onEscPress);

        closeModal(modal);
      }
    };

    var onCloseBtnClick = this.onCloseBtnClick;
    var onModalClick = this.onModalClick;
    var onEscPress = this.onEscPress;
  }

  var openModal = function (modal) {
    if (siteNav.classList.contains('site-nav--opened')) {
      siteNav.classList.remove('site-nav--opened');
    }

    if (document.body.offsetHeight > window.innerHeight) {
      document.body.dataset.scrollY = self.pageYOffset;
      document.body.style.top = document.body.dataset.scrollY * -1 + 'px';

      document.body.classList.add('page--block-scroll');
    }

    if (modal.classList.contains('modal')) {
      modal.classList.add('modal--opened');
    }
  };

  var closeModal = function (modal) {
    if (modal.classList.contains('modal')) {
      modal.classList.remove('modal--opened');
    }

    if (document.body.offsetHeight > window.innerHeight) {
      document.body.classList.remove('page--block-scroll');

      document.body.style.top = 0;
      HTML.style.scrollBehavior = 'auto';
      window.scrollTo(0, document.body.dataset.scrollY);
      HTML.style.scrollBehavior = 'smooth';
    }
  };

  window.utils = {
    openModal: openModal,
    closeModal: closeModal,
    Modal: Modal,
  };
})();

'use strict';

(function () {
  var siteNav = document.querySelector('.site-nav');
  var siteNavInner = siteNav.querySelector('.site-nav__inner');
  var siteNavBottom = siteNav.querySelector('.site-nav__bottom');
  var menuBtn = siteNav.querySelector('.site-nav__menu-btn');

  var onMenuBtnClick = function () {
    if (siteNav.classList.contains('site-nav--opened')) {
      window.utils.closeModal(siteNav);
      siteNav.classList.remove('site-nav--opened');

      siteNav.removeEventListener('click', onSiteNavClick);
      document.removeEventListener('keydown', onOpenModalEscPress);
    } else {
      window.utils.openModal(siteNav);
      siteNav.classList.add('site-nav--opened');

      siteNav.addEventListener('click', onSiteNavClick);
      document.addEventListener('keydown', onOpenModalEscPress);
    }
  };

  var onSiteNavClick = function (evt) {
    if (evt.target === siteNav || evt.target === siteNavInner || evt.target === siteNavBottom) {
      siteNav.classList.remove('site-nav--opened');
      window.utils.closeModal(siteNav);

      siteNav.removeEventListener('click', onSiteNavClick);
      document.removeEventListener('keydown', onOpenModalEscPress);
    }
  };

  var onOpenModalEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      siteNav.classList.remove('site-nav--opened');
      window.utils.closeModal(siteNav);

      siteNav.removeEventListener('click', onSiteNavClick);
      document.removeEventListener('keydown', onOpenModalEscPress);
    }
  };

  siteNav.classList.remove('site-nav--nojs')

  menuBtn.addEventListener('click', onMenuBtnClick);
})();

'use strict';

(function () {
  var locationLink = document.querySelector('.site-nav__link--location');
  var location = document.querySelector('.modal--location');
  var locationCloseBtn = location.querySelector('.modal__close-btn');
  var feedbackLink = document.querySelector('.site-nav__link--question');
  var feedback = document.querySelector('.modal--feedback');
  var feedbackCloseBtn = feedback.querySelector('.modal__close-btn');

  var locationModal = new window.utils.Modal(location, locationCloseBtn);
  var feedbackModal = new window.utils.Modal(feedback, feedbackCloseBtn);

  locationLink.addEventListener('click', locationModal.onModalLinkClick);
  feedbackLink.addEventListener('click', feedbackModal.onModalLinkClick);
})();

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
      input.classList.remove('modal-feedback__input--error');
      validity[target.name] = true;
    } else if (input) {
      input.classList.remove('modal-feedback__input--success');
      input.classList.add('modal-feedback__input--error');
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

    if (agreement.checked && validity.name && validity.email) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  };

  var ontextFieldInput = function (evt) {
    if (evt.target.closest('.modal-feedback__input input')) {
      var input = evt.target.closest('.modal-feedback__input');
    }

    checkValidity(input, evt.target);
  };

  var ontextFieldFocusOut = function (evt) {
    if (evt.target.closest('.modal-feedback__input input')) {
      var input = evt.target.closest('.modal-feedback__input');

      if (!evt.target.value) {
        input.classList.add('modal-feedback__input--error');
      }
    }
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
  feedback.addEventListener('focusout', ontextFieldFocusOut);
  feedback.addEventListener('submit', onFormSubmit);
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLmpzIiwibW9kYWwuanMiLCJmZWVkYmFjay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuICB2YXIgc2l0ZU5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdicpO1xuXG4gIGZ1bmN0aW9uIE1vZGFsKG1vZGFsLCBjbG9zZUJ0bikge1xuICAgIHRoaXMubW9kYWwgPSBtb2RhbDtcbiAgICB0aGlzLmNsb3NlQnRuID0gY2xvc2VCdG47XG5cbiAgICB0aGlzLm9uTW9kYWxMaW5rQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgb3Blbk1vZGFsKG1vZGFsKTtcblxuICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsb3NlQnRuQ2xpY2spO1xuICAgICAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xpY2spO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRXNjUHJlc3MpO1xuICAgIH07XG5cbiAgICB0aGlzLm9uQ2xvc2VCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG1vZGFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVzY1ByZXNzKTtcblxuICAgICAgY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfTtcblxuICAgIHRoaXMub25Nb2RhbENsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC50YXJnZXQgPT09IG1vZGFsKSB7XG4gICAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbG9zZUJ0bkNsaWNrKTtcbiAgICAgICAgbW9kYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xpY2spO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25Fc2NQcmVzcyk7XG5cbiAgICAgICAgY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25Fc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xvc2VCdG5DbGljayk7XG4gICAgICAgIG1vZGFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsaWNrKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRXNjUHJlc3MpO1xuXG4gICAgICAgIGNsb3NlTW9kYWwobW9kYWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgb25DbG9zZUJ0bkNsaWNrID0gdGhpcy5vbkNsb3NlQnRuQ2xpY2s7XG4gICAgdmFyIG9uTW9kYWxDbGljayA9IHRoaXMub25Nb2RhbENsaWNrO1xuICAgIHZhciBvbkVzY1ByZXNzID0gdGhpcy5vbkVzY1ByZXNzO1xuICB9XG5cbiAgdmFyIG9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChtb2RhbCkge1xuICAgIGlmIChzaXRlTmF2LmNsYXNzTGlzdC5jb250YWlucygnc2l0ZS1uYXYtLW9wZW5lZCcpKSB7XG4gICAgICBzaXRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtbmF2LS1vcGVuZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZID0gc2VsZi5wYWdlWU9mZnNldDtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkgKiAtMSArICdweCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG4gICAgfVxuXG4gICAgaWYgKG1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwnKSkge1xuICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnbW9kYWwtLW9wZW5lZCcpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChtb2RhbCkge1xuICAgIGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsJykpIHtcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLS1vcGVuZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gMDtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnYXV0byc7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkpO1xuICAgICAgSFRNTC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9ICdzbW9vdGgnO1xuICAgIH1cbiAgfTtcblxuICB3aW5kb3cudXRpbHMgPSB7XG4gICAgb3Blbk1vZGFsOiBvcGVuTW9kYWwsXG4gICAgY2xvc2VNb2RhbDogY2xvc2VNb2RhbCxcbiAgICBNb2RhbDogTW9kYWwsXG4gIH07XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgc2l0ZU5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdicpO1xuICB2YXIgc2l0ZU5hdklubmVyID0gc2l0ZU5hdi5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXZfX2lubmVyJyk7XG4gIHZhciBzaXRlTmF2Qm90dG9tID0gc2l0ZU5hdi5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXZfX2JvdHRvbScpO1xuICB2YXIgbWVudUJ0biA9IHNpdGVOYXYucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2X19tZW51LWJ0bicpO1xuXG4gIHZhciBvbk1lbnVCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2l0ZU5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ3NpdGUtbmF2LS1vcGVuZWQnKSkge1xuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwoc2l0ZU5hdik7XG4gICAgICBzaXRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtbmF2LS1vcGVuZWQnKTtcblxuICAgICAgc2l0ZU5hdi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uU2l0ZU5hdkNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LnV0aWxzLm9wZW5Nb2RhbChzaXRlTmF2KTtcbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LmFkZCgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuXG4gICAgICBzaXRlTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25TaXRlTmF2Q2xpY2spO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb25TaXRlTmF2Q2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dC50YXJnZXQgPT09IHNpdGVOYXYgfHwgZXZ0LnRhcmdldCA9PT0gc2l0ZU5hdklubmVyIHx8IGV2dC50YXJnZXQgPT09IHNpdGVOYXZCb3R0b20pIHtcbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwoc2l0ZU5hdik7XG5cbiAgICAgIHNpdGVOYXYucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNpdGVOYXZDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvbk9wZW5Nb2RhbEVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwoc2l0ZU5hdik7XG5cbiAgICAgIHNpdGVOYXYucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNpdGVOYXZDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfVxuICB9O1xuXG4gIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW5vanMnKVxuXG4gIG1lbnVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1lbnVCdG5DbGljayk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgbG9jYXRpb25MaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2X19saW5rLS1sb2NhdGlvbicpO1xuICB2YXIgbG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWxvY2F0aW9uJyk7XG4gIHZhciBsb2NhdGlvbkNsb3NlQnRuID0gbG9jYXRpb24ucXVlcnlTZWxlY3RvcignLm1vZGFsX19jbG9zZS1idG4nKTtcbiAgdmFyIGZlZWRiYWNrTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdl9fbGluay0tcXVlc3Rpb24nKTtcbiAgdmFyIGZlZWRiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1mZWVkYmFjaycpO1xuICB2YXIgZmVlZGJhY2tDbG9zZUJ0biA9IGZlZWRiYWNrLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UtYnRuJyk7XG5cbiAgdmFyIGxvY2F0aW9uTW9kYWwgPSBuZXcgd2luZG93LnV0aWxzLk1vZGFsKGxvY2F0aW9uLCBsb2NhdGlvbkNsb3NlQnRuKTtcbiAgdmFyIGZlZWRiYWNrTW9kYWwgPSBuZXcgd2luZG93LnV0aWxzLk1vZGFsKGZlZWRiYWNrLCBmZWVkYmFja0Nsb3NlQnRuKTtcblxuICBsb2NhdGlvbkxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb2NhdGlvbk1vZGFsLm9uTW9kYWxMaW5rQ2xpY2spO1xuICBmZWVkYmFja0xpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmZWVkYmFja01vZGFsLm9uTW9kYWxMaW5rQ2xpY2spO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZlZWRiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1mZWVkYmFjayBmb3JtJyk7XG4gIHZhciBzdWJtaXRCdG4gPSBmZWVkYmFjay5xdWVyeVNlbGVjdG9yKCcubW9kYWwtZmVlZGJhY2tfX3N1Ym1pdCcpO1xuICB2YXIgdXNlck5hbWUgPSBmZWVkYmFjay5xdWVyeVNlbGVjdG9yKCcjbmFtZScpO1xuICB2YXIgdXNlckVtYWlsID0gZmVlZGJhY2sucXVlcnlTZWxlY3RvcignI2VtYWlsJyk7XG4gIHZhciBhZ3JlZW1lbnQgPSBmZWVkYmFjay5xdWVyeVNlbGVjdG9yKCcjYWdyZWVtZW50Jyk7XG5cbiAgdmFyIFJFX0VNQUlMID0gL15bXFx3XXsxLH1cXEBbXFx3XXsyLH1cXC5bXFx3XXsyLH0kLztcblxuICB2YXIgaXNTdG9yYWdlU3VwcG9ydCA9IHRydWU7XG4gIHZhciBzdG9yYWdlID0gJyc7XG5cbiAgdmFyIHZhbGlkaXR5ID0ge1xuICAgIG5hbWU6IGZhbHNlLFxuICAgIGVtYWlsOiBmYWxzZSxcbiAgfTtcblxuICB2YXIgb25Gb3JtU3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc1N0b3JhZ2VTdXBwb3J0KSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbmFtZScsIHVzZXJOYW1lLnZhbHVlKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdlbWFpbCcsIHVzZXJFbWFpbC52YWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjaGVja1ZhbGlkaXR5ID0gZnVuY3Rpb24gKGlucHV0LCB0YXJnZXQpIHtcbiAgICBpZiAoaW5wdXQgJiYgdGFyZ2V0LnZhbHVlKSB7XG4gICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLXN1Y2Nlc3MnKTtcbiAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tZXJyb3InKTtcbiAgICAgIHZhbGlkaXR5W3RhcmdldC5uYW1lXSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChpbnB1dCkge1xuICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1zdWNjZXNzJyk7XG4gICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLWVycm9yJyk7XG4gICAgICB2YWxpZGl0eVt0YXJnZXQubmFtZV0gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0ID09PSB1c2VyRW1haWwpIHtcbiAgICAgIGlmICghUkVfRU1BSUwudGVzdCh0YXJnZXQudmFsdWUpKSB7XG4gICAgICAgIGlmICh0YXJnZXQudmFsdWUpIHtcbiAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLXN1Y2Nlc3MnKTtcbiAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsaWRpdHlbdGFyZ2V0Lm5hbWVdID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLXN1Y2Nlc3MnKTtcbiAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1lcnJvcicpO1xuXG4gICAgICAgIHZhbGlkaXR5W3RhcmdldC5uYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFncmVlbWVudC5jaGVja2VkICYmIHZhbGlkaXR5Lm5hbWUgJiYgdmFsaWRpdHkuZW1haWwpIHtcbiAgICAgIHN1Ym1pdEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJtaXRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb250ZXh0RmllbGRJbnB1dCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcubW9kYWwtZmVlZGJhY2tfX2lucHV0IGlucHV0JykpIHtcbiAgICAgIHZhciBpbnB1dCA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLm1vZGFsLWZlZWRiYWNrX19pbnB1dCcpO1xuICAgIH1cblxuICAgIGNoZWNrVmFsaWRpdHkoaW5wdXQsIGV2dC50YXJnZXQpO1xuICB9O1xuXG4gIHZhciBvbnRleHRGaWVsZEZvY3VzT3V0ID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbC1mZWVkYmFja19faW5wdXQgaW5wdXQnKSkge1xuICAgICAgdmFyIGlucHV0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcubW9kYWwtZmVlZGJhY2tfX2lucHV0Jyk7XG5cbiAgICAgIGlmICghZXZ0LnRhcmdldC52YWx1ZSkge1xuICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLWVycm9yJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHRyeSB7XG4gICAgc3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCduYW1lJyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlzU3RvcmFnZVN1cHBvcnQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChzdG9yYWdlKSB7XG4gICAgdXNlck5hbWUudmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbmFtZScpO1xuICAgIHVzZXJFbWFpbC52YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlbWFpbCcpO1xuXG4gICAgY2hlY2tWYWxpZGl0eSh1c2VyTmFtZS5jbG9zZXN0KCcubW9kYWwtZmVlZGJhY2tfX2lucHV0JyksIHVzZXJOYW1lKTtcbiAgICBjaGVja1ZhbGlkaXR5KHVzZXJFbWFpbC5jbG9zZXN0KCcubW9kYWwtZmVlZGJhY2tfX2lucHV0JyksIHVzZXJFbWFpbCk7XG4gIH1cblxuICBzdWJtaXRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGZlZWRiYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0Jywgb250ZXh0RmllbGRJbnB1dCk7XG4gIGZlZWRiYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0Jywgb250ZXh0RmllbGRGb2N1c091dCk7XG4gIGZlZWRiYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIG9uRm9ybVN1Ym1pdCk7XG59KSgpO1xuIl19
