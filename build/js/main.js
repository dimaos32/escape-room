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

  siteNav.classList.remove('site-nav--nojs');

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

'use strict';

(function () {
  if (document.querySelector('.order')) {
    var order = document.querySelector('.order');
    var orderDetailsTop = order.querySelector('.order__details--top');
    var SelectedDateTop = orderDetailsTop.querySelector('.order__selected-date');
    var SelectedTimeTop = orderDetailsTop.querySelector('.order__selected-time');
    var SelectedPriceTop = orderDetailsTop.querySelector('.order__selected-price');
    var orderDetailsBottom = order.querySelector('.order__details--bottom');
    var SelectedDateBottom = orderDetailsBottom.querySelector('.order__selected-date');
    var SelectedTimeBottom = orderDetailsBottom.querySelector('.order__selected-time');
    var SelectedPriceBottom = orderDetailsBottom.querySelector('.order__selected-price');
    var orderTime = order.querySelector('.order__time');

    var onOrderTimeClick = function (evt) {
      var date = order.querySelector('.order__date time');
      var time = order.querySelector('#' + evt.target.id + ' ~ label');
      var price = order.querySelector('#' + evt.target.id + ' ~ p');

      SelectedDateTop.textContent = date.textContent;
      SelectedTimeTop.textContent = time.textContent;
      SelectedPriceTop.textContent = price.textContent;
      SelectedDateBottom.textContent = date.textContent;
      SelectedTimeBottom.textContent = time.textContent;
      SelectedPriceBottom.textContent = price.textContent;

      orderDetailsTop.classList.remove('order__details--hidden');
      orderDetailsBottom.classList.remove('order__details--hidden');
    };

    orderTime.addEventListener('change', onOrderTimeClick);
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLmpzIiwibW9kYWwuanMiLCJmZWVkYmFjay5qcyIsIm9yZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEhUTUwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJyk7XG4gIHZhciBzaXRlTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2Jyk7XG5cbiAgZnVuY3Rpb24gTW9kYWwobW9kYWwsIGNsb3NlQnRuKSB7XG4gICAgdGhpcy5tb2RhbCA9IG1vZGFsO1xuICAgIHRoaXMuY2xvc2VCdG4gPSBjbG9zZUJ0bjtcblxuICAgIHRoaXMub25Nb2RhbExpbmtDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBvcGVuTW9kYWwobW9kYWwpO1xuXG4gICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xvc2VCdG5DbGljayk7XG4gICAgICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbGljayk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25Fc2NQcmVzcyk7XG4gICAgfTtcblxuICAgIHRoaXMub25DbG9zZUJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsb3NlQnRuQ2xpY2spO1xuICAgICAgbW9kYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRXNjUHJlc3MpO1xuXG4gICAgICBjbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbk1vZGFsQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LnRhcmdldCA9PT0gbW9kYWwpIHtcbiAgICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsb3NlQnRuQ2xpY2spO1xuICAgICAgICBtb2RhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbGljayk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVzY1ByZXNzKTtcblxuICAgICAgICBjbG9zZU1vZGFsKG1vZGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5vbkVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbG9zZUJ0bkNsaWNrKTtcbiAgICAgICAgbW9kYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vZGFsQ2xpY2spO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25Fc2NQcmVzcyk7XG5cbiAgICAgICAgY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvbkNsb3NlQnRuQ2xpY2sgPSB0aGlzLm9uQ2xvc2VCdG5DbGljaztcbiAgICB2YXIgb25Nb2RhbENsaWNrID0gdGhpcy5vbk1vZGFsQ2xpY2s7XG4gICAgdmFyIG9uRXNjUHJlc3MgPSB0aGlzLm9uRXNjUHJlc3M7XG4gIH1cblxuICB2YXIgb3Blbk1vZGFsID0gZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgaWYgKHNpdGVOYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaXRlLW5hdi0tb3BlbmVkJykpIHtcbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuICAgIH1cblxuICAgIGlmIChkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkgPSBzZWxmLnBhZ2VZT2Zmc2V0O1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSBkb2N1bWVudC5ib2R5LmRhdGFzZXQuc2Nyb2xsWSAqIC0xICsgJ3B4JztcblxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdwYWdlLS1ibG9jay1zY3JvbGwnKTtcbiAgICB9XG5cbiAgICBpZiAobW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbCcpKSB7XG4gICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC0tb3BlbmVkJyk7XG4gICAgfVxuXG4gICAgaWYgKG1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwtLWZlZWRiYWNrJykpIHtcbiAgICAgIHZhciB1c2VyTmFtZSA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJyNuYW1lJyk7XG4gICAgICB2YXIgdXNlclF1ZXN0aW9uID0gbW9kYWwucXVlcnlTZWxlY3RvcignI3F1ZXN0aW9uJyk7XG5cbiAgICAgIGlmICghdXNlck5hbWUudmFsdWUpIHtcbiAgICAgICAgdXNlck5hbWUuZm9jdXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVzZXJRdWVzdGlvbi5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChtb2RhbCkge1xuICAgIGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsJykpIHtcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLS1vcGVuZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gMDtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnYXV0byc7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkpO1xuICAgICAgSFRNTC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9ICdzbW9vdGgnO1xuICAgIH1cbiAgfTtcblxuICB3aW5kb3cudXRpbHMgPSB7XG4gICAgb3Blbk1vZGFsOiBvcGVuTW9kYWwsXG4gICAgY2xvc2VNb2RhbDogY2xvc2VNb2RhbCxcbiAgICBNb2RhbDogTW9kYWwsXG4gIH07XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgc2l0ZU5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdicpO1xuICB2YXIgc2l0ZU5hdklubmVyID0gc2l0ZU5hdi5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXZfX2lubmVyJyk7XG4gIHZhciBzaXRlTmF2Qm90dG9tID0gc2l0ZU5hdi5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXZfX2JvdHRvbScpO1xuICB2YXIgbWVudUJ0biA9IHNpdGVOYXYucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2X19tZW51LWJ0bicpO1xuXG4gIHZhciBvbk1lbnVCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2l0ZU5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ3NpdGUtbmF2LS1vcGVuZWQnKSkge1xuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwoc2l0ZU5hdik7XG4gICAgICBzaXRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtbmF2LS1vcGVuZWQnKTtcblxuICAgICAgc2l0ZU5hdi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uU2l0ZU5hdkNsaWNrKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LnV0aWxzLm9wZW5Nb2RhbChzaXRlTmF2KTtcbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LmFkZCgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuXG4gICAgICBzaXRlTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25TaXRlTmF2Q2xpY2spO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb25TaXRlTmF2Q2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dC50YXJnZXQgPT09IHNpdGVOYXYgfHwgZXZ0LnRhcmdldCA9PT0gc2l0ZU5hdklubmVyIHx8IGV2dC50YXJnZXQgPT09IHNpdGVOYXZCb3R0b20pIHtcbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwoc2l0ZU5hdik7XG5cbiAgICAgIHNpdGVOYXYucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNpdGVOYXZDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvbk9wZW5Nb2RhbEVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwoc2l0ZU5hdik7XG5cbiAgICAgIHNpdGVOYXYucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNpdGVOYXZDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfVxuICB9O1xuXG4gIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW5vanMnKTtcblxuICBtZW51QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25NZW51QnRuQ2xpY2spO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxvY2F0aW9uTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdl9fbGluay0tbG9jYXRpb24nKTtcbiAgdmFyIGxvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1sb2NhdGlvbicpO1xuICB2YXIgbG9jYXRpb25DbG9zZUJ0biA9IGxvY2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UtYnRuJyk7XG4gIHZhciBmZWVkYmFja0xpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXZfX2xpbmstLXF1ZXN0aW9uJyk7XG4gIHZhciBmZWVkYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tZmVlZGJhY2snKTtcbiAgdmFyIGZlZWRiYWNrQ2xvc2VCdG4gPSBmZWVkYmFjay5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2Nsb3NlLWJ0bicpO1xuXG4gIHZhciBsb2NhdGlvbk1vZGFsID0gbmV3IHdpbmRvdy51dGlscy5Nb2RhbChsb2NhdGlvbiwgbG9jYXRpb25DbG9zZUJ0bik7XG4gIHZhciBmZWVkYmFja01vZGFsID0gbmV3IHdpbmRvdy51dGlscy5Nb2RhbChmZWVkYmFjaywgZmVlZGJhY2tDbG9zZUJ0bik7XG5cbiAgbG9jYXRpb25MaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9jYXRpb25Nb2RhbC5vbk1vZGFsTGlua0NsaWNrKTtcbiAgZmVlZGJhY2tMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZmVlZGJhY2tNb2RhbC5vbk1vZGFsTGlua0NsaWNrKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBmZWVkYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tZmVlZGJhY2sgZm9ybScpO1xuICB2YXIgc3VibWl0QnRuID0gZmVlZGJhY2sucXVlcnlTZWxlY3RvcignLm1vZGFsLWZlZWRiYWNrX19zdWJtaXQnKTtcbiAgdmFyIHVzZXJOYW1lID0gZmVlZGJhY2sucXVlcnlTZWxlY3RvcignI25hbWUnKTtcbiAgdmFyIHVzZXJFbWFpbCA9IGZlZWRiYWNrLnF1ZXJ5U2VsZWN0b3IoJyNlbWFpbCcpO1xuICB2YXIgYWdyZWVtZW50ID0gZmVlZGJhY2sucXVlcnlTZWxlY3RvcignI2FncmVlbWVudCcpO1xuXG4gIHZhciBSRV9FTUFJTCA9IC9eW1xcd117MSx9XFxAW1xcd117Mix9XFwuW1xcd117Mix9JC87XG5cbiAgdmFyIGlzU3RvcmFnZVN1cHBvcnQgPSB0cnVlO1xuICB2YXIgc3RvcmFnZSA9ICcnO1xuXG4gIHZhciB2YWxpZGl0eSA9IHtcbiAgICBuYW1lOiBmYWxzZSxcbiAgICBlbWFpbDogZmFsc2UsXG4gIH07XG5cbiAgdmFyIG9uRm9ybVN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaXNTdG9yYWdlU3VwcG9ydCkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ25hbWUnLCB1c2VyTmFtZS52YWx1ZSk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZW1haWwnLCB1c2VyRW1haWwudmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY2hlY2tWYWxpZGl0eSA9IGZ1bmN0aW9uIChpbnB1dCwgdGFyZ2V0KSB7XG4gICAgaWYgKGlucHV0ICYmIHRhcmdldC52YWx1ZSkge1xuICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1zdWNjZXNzJyk7XG4gICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1mZWVkYmFja19faW5wdXQtLWVycm9yJyk7XG4gICAgICB2YWxpZGl0eVt0YXJnZXQubmFtZV0gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaW5wdXQpIHtcbiAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tc3VjY2VzcycpO1xuICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1lcnJvcicpO1xuICAgICAgdmFsaWRpdHlbdGFyZ2V0Lm5hbWVdID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldCA9PT0gdXNlckVtYWlsKSB7XG4gICAgICBpZiAoIVJFX0VNQUlMLnRlc3QodGFyZ2V0LnZhbHVlKSkge1xuICAgICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1zdWNjZXNzJyk7XG4gICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbGlkaXR5W3RhcmdldC5uYW1lXSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1zdWNjZXNzJyk7XG4gICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tZXJyb3InKTtcblxuICAgICAgICB2YWxpZGl0eVt0YXJnZXQubmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhZ3JlZW1lbnQuY2hlY2tlZCAmJiB2YWxpZGl0eS5uYW1lICYmIHZhbGlkaXR5LmVtYWlsKSB7XG4gICAgICBzdWJtaXRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VibWl0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9udGV4dEZpZWxkSW5wdXQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLm1vZGFsLWZlZWRiYWNrX19pbnB1dCBpbnB1dCcpKSB7XG4gICAgICB2YXIgaW5wdXQgPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbC1mZWVkYmFja19faW5wdXQnKTtcbiAgICB9XG5cbiAgICBjaGVja1ZhbGlkaXR5KGlucHV0LCBldnQudGFyZ2V0KTtcbiAgfTtcblxuICB2YXIgb250ZXh0RmllbGRGb2N1c091dCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcubW9kYWwtZmVlZGJhY2tfX2lucHV0IGlucHV0JykpIHtcbiAgICAgIHZhciBpbnB1dCA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLm1vZGFsLWZlZWRiYWNrX19pbnB1dCcpO1xuXG4gICAgICBpZiAoIWV2dC50YXJnZXQudmFsdWUpIHtcbiAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1lcnJvcicpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0cnkge1xuICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbmFtZScpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpc1N0b3JhZ2VTdXBwb3J0ID0gZmFsc2U7XG4gIH1cblxuICBpZiAoc3RvcmFnZSkge1xuICAgIHVzZXJOYW1lLnZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ25hbWUnKTtcbiAgICB1c2VyRW1haWwudmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZW1haWwnKTtcblxuICAgIGNoZWNrVmFsaWRpdHkodXNlck5hbWUuY2xvc2VzdCgnLm1vZGFsLWZlZWRiYWNrX19pbnB1dCcpLCB1c2VyTmFtZSk7XG4gICAgY2hlY2tWYWxpZGl0eSh1c2VyRW1haWwuY2xvc2VzdCgnLm1vZGFsLWZlZWRiYWNrX19pbnB1dCcpLCB1c2VyRW1haWwpO1xuICB9XG5cbiAgc3VibWl0QnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBmZWVkYmFjay5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9udGV4dEZpZWxkSW5wdXQpO1xuICBmZWVkYmFjay5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIG9udGV4dEZpZWxkRm9jdXNPdXQpO1xuICBmZWVkYmFjay5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBvbkZvcm1TdWJtaXQpO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcicpKSB7XG4gICAgdmFyIG9yZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yZGVyJyk7XG4gICAgdmFyIG9yZGVyRGV0YWlsc1RvcCA9IG9yZGVyLnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcl9fZGV0YWlscy0tdG9wJyk7XG4gICAgdmFyIFNlbGVjdGVkRGF0ZVRvcCA9IG9yZGVyRGV0YWlsc1RvcC5xdWVyeVNlbGVjdG9yKCcub3JkZXJfX3NlbGVjdGVkLWRhdGUnKTtcbiAgICB2YXIgU2VsZWN0ZWRUaW1lVG9wID0gb3JkZXJEZXRhaWxzVG9wLnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcl9fc2VsZWN0ZWQtdGltZScpO1xuICAgIHZhciBTZWxlY3RlZFByaWNlVG9wID0gb3JkZXJEZXRhaWxzVG9wLnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcl9fc2VsZWN0ZWQtcHJpY2UnKTtcbiAgICB2YXIgb3JkZXJEZXRhaWxzQm90dG9tID0gb3JkZXIucXVlcnlTZWxlY3RvcignLm9yZGVyX19kZXRhaWxzLS1ib3R0b20nKTtcbiAgICB2YXIgU2VsZWN0ZWREYXRlQm90dG9tID0gb3JkZXJEZXRhaWxzQm90dG9tLnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcl9fc2VsZWN0ZWQtZGF0ZScpO1xuICAgIHZhciBTZWxlY3RlZFRpbWVCb3R0b20gPSBvcmRlckRldGFpbHNCb3R0b20ucXVlcnlTZWxlY3RvcignLm9yZGVyX19zZWxlY3RlZC10aW1lJyk7XG4gICAgdmFyIFNlbGVjdGVkUHJpY2VCb3R0b20gPSBvcmRlckRldGFpbHNCb3R0b20ucXVlcnlTZWxlY3RvcignLm9yZGVyX19zZWxlY3RlZC1wcmljZScpO1xuICAgIHZhciBvcmRlclRpbWUgPSBvcmRlci5xdWVyeVNlbGVjdG9yKCcub3JkZXJfX3RpbWUnKTtcblxuICAgIHZhciBvbk9yZGVyVGltZUNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIGRhdGUgPSBvcmRlci5xdWVyeVNlbGVjdG9yKCcub3JkZXJfX2RhdGUgdGltZScpO1xuICAgICAgdmFyIHRpbWUgPSBvcmRlci5xdWVyeVNlbGVjdG9yKCcjJyArIGV2dC50YXJnZXQuaWQgKyAnIH4gbGFiZWwnKTtcbiAgICAgIHZhciBwcmljZSA9IG9yZGVyLnF1ZXJ5U2VsZWN0b3IoJyMnICsgZXZ0LnRhcmdldC5pZCArICcgfiBwJyk7XG5cbiAgICAgIFNlbGVjdGVkRGF0ZVRvcC50ZXh0Q29udGVudCA9IGRhdGUudGV4dENvbnRlbnQ7XG4gICAgICBTZWxlY3RlZFRpbWVUb3AudGV4dENvbnRlbnQgPSB0aW1lLnRleHRDb250ZW50O1xuICAgICAgU2VsZWN0ZWRQcmljZVRvcC50ZXh0Q29udGVudCA9IHByaWNlLnRleHRDb250ZW50O1xuICAgICAgU2VsZWN0ZWREYXRlQm90dG9tLnRleHRDb250ZW50ID0gZGF0ZS50ZXh0Q29udGVudDtcbiAgICAgIFNlbGVjdGVkVGltZUJvdHRvbS50ZXh0Q29udGVudCA9IHRpbWUudGV4dENvbnRlbnQ7XG4gICAgICBTZWxlY3RlZFByaWNlQm90dG9tLnRleHRDb250ZW50ID0gcHJpY2UudGV4dENvbnRlbnQ7XG5cbiAgICAgIG9yZGVyRGV0YWlsc1RvcC5jbGFzc0xpc3QucmVtb3ZlKCdvcmRlcl9fZGV0YWlscy0taGlkZGVuJyk7XG4gICAgICBvcmRlckRldGFpbHNCb3R0b20uY2xhc3NMaXN0LnJlbW92ZSgnb3JkZXJfX2RldGFpbHMtLWhpZGRlbicpO1xuICAgIH07XG5cbiAgICBvcmRlclRpbWUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25PcmRlclRpbWVDbGljayk7XG4gIH1cbn0pKCk7XG4iXX0=
