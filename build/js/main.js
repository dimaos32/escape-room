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

    if (modal.classList.contains('modal--feedback')) {
      var userName = modal.querySelector('#name');
      var userQuestion = modal.querySelector('#question');

      if (!userName.value) {
        userName.focus();
      } else {
        userQuestion.focus();
      }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLmpzIiwibW9kYWwuanMiLCJmZWVkYmFjay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcbiAgdmFyIHNpdGVOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXYnKTtcblxuICBmdW5jdGlvbiBNb2RhbChtb2RhbCwgY2xvc2VCdG4pIHtcbiAgICB0aGlzLm1vZGFsID0gbW9kYWw7XG4gICAgdGhpcy5jbG9zZUJ0biA9IGNsb3NlQnRuO1xuXG4gICAgdGhpcy5vbk1vZGFsTGlua0NsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIG9wZW5Nb2RhbChtb2RhbCk7XG5cbiAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVzY1ByZXNzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbkNsb3NlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xvc2VCdG5DbGljayk7XG4gICAgICBtb2RhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25Fc2NQcmVzcyk7XG5cbiAgICAgIGNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH07XG5cbiAgICB0aGlzLm9uTW9kYWxDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBtb2RhbCkge1xuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xvc2VCdG5DbGljayk7XG4gICAgICAgIG1vZGFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsaWNrKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRXNjUHJlc3MpO1xuXG4gICAgICAgIGNsb3NlTW9kYWwobW9kYWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uRXNjUHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsb3NlQnRuQ2xpY2spO1xuICAgICAgICBtb2RhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbGljayk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVzY1ByZXNzKTtcblxuICAgICAgICBjbG9zZU1vZGFsKG1vZGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uQ2xvc2VCdG5DbGljayA9IHRoaXMub25DbG9zZUJ0bkNsaWNrO1xuICAgIHZhciBvbk1vZGFsQ2xpY2sgPSB0aGlzLm9uTW9kYWxDbGljaztcbiAgICB2YXIgb25Fc2NQcmVzcyA9IHRoaXMub25Fc2NQcmVzcztcbiAgfVxuXG4gIHZhciBvcGVuTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBpZiAoc2l0ZU5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ3NpdGUtbmF2LS1vcGVuZWQnKSkge1xuICAgICAgc2l0ZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaXRlLW5hdi0tb3BlbmVkJyk7XG4gICAgfVxuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuc2Nyb2xsWSA9IHNlbGYucGFnZVlPZmZzZXQ7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZICogLTEgKyAncHgnO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuICAgIH1cblxuICAgIGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsJykpIHtcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ21vZGFsLS1vcGVuZWQnKTtcbiAgICB9XG5cbiAgICBpZiAobW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbC0tZmVlZGJhY2snKSkge1xuICAgICAgdmFyIHVzZXJOYW1lID0gbW9kYWwucXVlcnlTZWxlY3RvcignI25hbWUnKTtcbiAgICAgIHZhciB1c2VyUXVlc3Rpb24gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcjcXVlc3Rpb24nKTtcblxuICAgICAgaWYgKCF1c2VyTmFtZS52YWx1ZSkge1xuICAgICAgICB1c2VyTmFtZS5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXNlclF1ZXN0aW9uLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhciBjbG9zZU1vZGFsID0gZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgaWYgKG1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwnKSkge1xuICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtLW9wZW5lZCcpO1xuICAgIH1cblxuICAgIGlmIChkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLS1ibG9jay1zY3JvbGwnKTtcblxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAwO1xuICAgICAgSFRNTC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9ICdhdXRvJztcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBkb2N1bWVudC5ib2R5LmRhdGFzZXQuc2Nyb2xsWSk7XG4gICAgICBIVE1MLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gJ3Ntb290aCc7XG4gICAgfVxuICB9O1xuXG4gIHdpbmRvdy51dGlscyA9IHtcbiAgICBvcGVuTW9kYWw6IG9wZW5Nb2RhbCxcbiAgICBjbG9zZU1vZGFsOiBjbG9zZU1vZGFsLFxuICAgIE1vZGFsOiBNb2RhbCxcbiAgfTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBzaXRlTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2Jyk7XG4gIHZhciBzaXRlTmF2SW5uZXIgPSBzaXRlTmF2LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdl9faW5uZXInKTtcbiAgdmFyIHNpdGVOYXZCb3R0b20gPSBzaXRlTmF2LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdl9fYm90dG9tJyk7XG4gIHZhciBtZW51QnRuID0gc2l0ZU5hdi5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXZfX21lbnUtYnRuJyk7XG5cbiAgdmFyIG9uTWVudUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzaXRlTmF2LmNsYXNzTGlzdC5jb250YWlucygnc2l0ZS1uYXYtLW9wZW5lZCcpKSB7XG4gICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChzaXRlTmF2KTtcbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuXG4gICAgICBzaXRlTmF2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25TaXRlTmF2Q2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cudXRpbHMub3Blbk1vZGFsKHNpdGVOYXYpO1xuICAgICAgc2l0ZU5hdi5jbGFzc0xpc3QuYWRkKCdzaXRlLW5hdi0tb3BlbmVkJyk7XG5cbiAgICAgIHNpdGVOYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNpdGVOYXZDbGljayk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvblNpdGVOYXZDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0LnRhcmdldCA9PT0gc2l0ZU5hdiB8fCBldnQudGFyZ2V0ID09PSBzaXRlTmF2SW5uZXIgfHwgZXZ0LnRhcmdldCA9PT0gc2l0ZU5hdkJvdHRvbSkge1xuICAgICAgc2l0ZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaXRlLW5hdi0tb3BlbmVkJyk7XG4gICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChzaXRlTmF2KTtcblxuICAgICAgc2l0ZU5hdi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uU2l0ZU5hdkNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9uT3Blbk1vZGFsRXNjUHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgc2l0ZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaXRlLW5hdi0tb3BlbmVkJyk7XG4gICAgICB3aW5kb3cudXRpbHMuY2xvc2VNb2RhbChzaXRlTmF2KTtcblxuICAgICAgc2l0ZU5hdi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uU2l0ZU5hdkNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcbiAgICB9XG4gIH07XG5cbiAgc2l0ZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaXRlLW5hdi0tbm9qcycpXG5cbiAgbWVudUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTWVudUJ0bkNsaWNrKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBsb2NhdGlvbkxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXZfX2xpbmstLWxvY2F0aW9uJyk7XG4gIHZhciBsb2NhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tbG9jYXRpb24nKTtcbiAgdmFyIGxvY2F0aW9uQ2xvc2VCdG4gPSBsb2NhdGlvbi5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2Nsb3NlLWJ0bicpO1xuICB2YXIgZmVlZGJhY2tMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2X19saW5rLS1xdWVzdGlvbicpO1xuICB2YXIgZmVlZGJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWZlZWRiYWNrJyk7XG4gIHZhciBmZWVkYmFja0Nsb3NlQnRuID0gZmVlZGJhY2sucXVlcnlTZWxlY3RvcignLm1vZGFsX19jbG9zZS1idG4nKTtcblxuICB2YXIgbG9jYXRpb25Nb2RhbCA9IG5ldyB3aW5kb3cudXRpbHMuTW9kYWwobG9jYXRpb24sIGxvY2F0aW9uQ2xvc2VCdG4pO1xuICB2YXIgZmVlZGJhY2tNb2RhbCA9IG5ldyB3aW5kb3cudXRpbHMuTW9kYWwoZmVlZGJhY2ssIGZlZWRiYWNrQ2xvc2VCdG4pO1xuXG4gIGxvY2F0aW9uTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxvY2F0aW9uTW9kYWwub25Nb2RhbExpbmtDbGljayk7XG4gIGZlZWRiYWNrTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZlZWRiYWNrTW9kYWwub25Nb2RhbExpbmtDbGljayk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgZmVlZGJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtLWZlZWRiYWNrIGZvcm0nKTtcbiAgdmFyIHN1Ym1pdEJ0biA9IGZlZWRiYWNrLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1mZWVkYmFja19fc3VibWl0Jyk7XG4gIHZhciB1c2VyTmFtZSA9IGZlZWRiYWNrLnF1ZXJ5U2VsZWN0b3IoJyNuYW1lJyk7XG4gIHZhciB1c2VyRW1haWwgPSBmZWVkYmFjay5xdWVyeVNlbGVjdG9yKCcjZW1haWwnKTtcbiAgdmFyIGFncmVlbWVudCA9IGZlZWRiYWNrLnF1ZXJ5U2VsZWN0b3IoJyNhZ3JlZW1lbnQnKTtcblxuICB2YXIgUkVfRU1BSUwgPSAvXltcXHddezEsfVxcQFtcXHddezIsfVxcLltcXHddezIsfSQvO1xuXG4gIHZhciBpc1N0b3JhZ2VTdXBwb3J0ID0gdHJ1ZTtcbiAgdmFyIHN0b3JhZ2UgPSAnJztcblxuICB2YXIgdmFsaWRpdHkgPSB7XG4gICAgbmFtZTogZmFsc2UsXG4gICAgZW1haWw6IGZhbHNlLFxuICB9O1xuXG4gIHZhciBvbkZvcm1TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGlzU3RvcmFnZVN1cHBvcnQpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCduYW1lJywgdXNlck5hbWUudmFsdWUpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2VtYWlsJywgdXNlckVtYWlsLnZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNoZWNrVmFsaWRpdHkgPSBmdW5jdGlvbiAoaW5wdXQsIHRhcmdldCkge1xuICAgIGlmIChpbnB1dCAmJiB0YXJnZXQudmFsdWUpIHtcbiAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tc3VjY2VzcycpO1xuICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1lcnJvcicpO1xuICAgICAgdmFsaWRpdHlbdGFyZ2V0Lm5hbWVdID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGlucHV0KSB7XG4gICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLXN1Y2Nlc3MnKTtcbiAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tZXJyb3InKTtcbiAgICAgIHZhbGlkaXR5W3RhcmdldC5uYW1lXSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0YXJnZXQgPT09IHVzZXJFbWFpbCkge1xuICAgICAgaWYgKCFSRV9FTUFJTC50ZXN0KHRhcmdldC52YWx1ZSkpIHtcbiAgICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tc3VjY2VzcycpO1xuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YWxpZGl0eVt0YXJnZXQubmFtZV0gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tc3VjY2VzcycpO1xuICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLWVycm9yJyk7XG5cbiAgICAgICAgdmFsaWRpdHlbdGFyZ2V0Lm5hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWdyZWVtZW50LmNoZWNrZWQgJiYgdmFsaWRpdHkubmFtZSAmJiB2YWxpZGl0eS5lbWFpbCkge1xuICAgICAgc3VibWl0QnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Ym1pdEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvbnRleHRGaWVsZElucHV0ID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbC1mZWVkYmFja19faW5wdXQgaW5wdXQnKSkge1xuICAgICAgdmFyIGlucHV0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcubW9kYWwtZmVlZGJhY2tfX2lucHV0Jyk7XG4gICAgfVxuXG4gICAgY2hlY2tWYWxpZGl0eShpbnB1dCwgZXZ0LnRhcmdldCk7XG4gIH07XG5cbiAgdmFyIG9udGV4dEZpZWxkRm9jdXNPdXQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLm1vZGFsLWZlZWRiYWNrX19pbnB1dCBpbnB1dCcpKSB7XG4gICAgICB2YXIgaW5wdXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbC1mZWVkYmFja19faW5wdXQnKTtcblxuICAgICAgaWYgKCFldnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tZXJyb3InKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdHJ5IHtcbiAgICBzdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ25hbWUnKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaXNTdG9yYWdlU3VwcG9ydCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKHN0b3JhZ2UpIHtcbiAgICB1c2VyTmFtZS52YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCduYW1lJyk7XG4gICAgdXNlckVtYWlsLnZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VtYWlsJyk7XG5cbiAgICBjaGVja1ZhbGlkaXR5KHVzZXJOYW1lLmNsb3Nlc3QoJy5tb2RhbC1mZWVkYmFja19faW5wdXQnKSwgdXNlck5hbWUpO1xuICAgIGNoZWNrVmFsaWRpdHkodXNlckVtYWlsLmNsb3Nlc3QoJy5tb2RhbC1mZWVkYmFja19faW5wdXQnKSwgdXNlckVtYWlsKTtcbiAgfVxuXG4gIHN1Ym1pdEJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgZmVlZGJhY2suYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBvbnRleHRGaWVsZElucHV0KTtcbiAgZmVlZGJhY2suYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBvbnRleHRGaWVsZEZvY3VzT3V0KTtcbiAgZmVlZGJhY2suYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0Jywgb25Gb3JtU3VibWl0KTtcbn0pKCk7XG4iXX0=
