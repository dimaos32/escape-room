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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLmpzIiwibW9kYWwuanMiLCJmZWVkYmFjay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcbiAgdmFyIHNpdGVOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXYnKTtcblxuICBmdW5jdGlvbiBNb2RhbChtb2RhbCwgY2xvc2VCdG4pIHtcbiAgICB0aGlzLm1vZGFsID0gbW9kYWw7XG4gICAgdGhpcy5jbG9zZUJ0biA9IGNsb3NlQnRuO1xuXG4gICAgdGhpcy5vbk1vZGFsTGlua0NsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIG9wZW5Nb2RhbChtb2RhbCk7XG5cbiAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbG9zZUJ0bkNsaWNrKTtcbiAgICAgIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVzY1ByZXNzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbkNsb3NlQnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xvc2VCdG5DbGljayk7XG4gICAgICBtb2RhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25Fc2NQcmVzcyk7XG5cbiAgICAgIGNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH07XG5cbiAgICB0aGlzLm9uTW9kYWxDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBtb2RhbCkge1xuICAgICAgICBjbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xvc2VCdG5DbGljayk7XG4gICAgICAgIG1vZGFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Nb2RhbENsaWNrKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uRXNjUHJlc3MpO1xuXG4gICAgICAgIGNsb3NlTW9kYWwobW9kYWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uRXNjUHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xvc2VCdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsb3NlQnRuQ2xpY2spO1xuICAgICAgICBtb2RhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTW9kYWxDbGljayk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkVzY1ByZXNzKTtcblxuICAgICAgICBjbG9zZU1vZGFsKG1vZGFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG9uQ2xvc2VCdG5DbGljayA9IHRoaXMub25DbG9zZUJ0bkNsaWNrO1xuICAgIHZhciBvbk1vZGFsQ2xpY2sgPSB0aGlzLm9uTW9kYWxDbGljaztcbiAgICB2YXIgb25Fc2NQcmVzcyA9IHRoaXMub25Fc2NQcmVzcztcbiAgfVxuXG4gIHZhciBvcGVuTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBpZiAoc2l0ZU5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ3NpdGUtbmF2LS1vcGVuZWQnKSkge1xuICAgICAgc2l0ZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaXRlLW5hdi0tb3BlbmVkJyk7XG4gICAgfVxuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQuc2Nyb2xsWSA9IHNlbGYucGFnZVlPZmZzZXQ7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZICogLTEgKyAncHgnO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuICAgIH1cblxuICAgIGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsJykpIHtcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ21vZGFsLS1vcGVuZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNsb3NlTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBpZiAobW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2RhbCcpKSB7XG4gICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC0tb3BlbmVkJyk7XG4gICAgfVxuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtLWJsb2NrLXNjcm9sbCcpO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IDA7XG4gICAgICBIVE1MLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZKTtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnc21vb3RoJztcbiAgICB9XG4gIH07XG5cbiAgd2luZG93LnV0aWxzID0ge1xuICAgIG9wZW5Nb2RhbDogb3Blbk1vZGFsLFxuICAgIGNsb3NlTW9kYWw6IGNsb3NlTW9kYWwsXG4gICAgTW9kYWw6IE1vZGFsLFxuICB9O1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNpdGVOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXYnKTtcbiAgdmFyIHNpdGVOYXZJbm5lciA9IHNpdGVOYXYucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2X19pbm5lcicpO1xuICB2YXIgc2l0ZU5hdkJvdHRvbSA9IHNpdGVOYXYucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2X19ib3R0b20nKTtcbiAgdmFyIG1lbnVCdG4gPSBzaXRlTmF2LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdl9fbWVudS1idG4nKTtcblxuICB2YXIgb25NZW51QnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNpdGVOYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaXRlLW5hdi0tb3BlbmVkJykpIHtcbiAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKHNpdGVOYXYpO1xuICAgICAgc2l0ZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaXRlLW5hdi0tb3BlbmVkJyk7XG5cbiAgICAgIHNpdGVOYXYucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNpdGVOYXZDbGljayk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25PcGVuTW9kYWxFc2NQcmVzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy51dGlscy5vcGVuTW9kYWwoc2l0ZU5hdik7XG4gICAgICBzaXRlTmF2LmNsYXNzTGlzdC5hZGQoJ3NpdGUtbmF2LS1vcGVuZWQnKTtcblxuICAgICAgc2l0ZU5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uU2l0ZU5hdkNsaWNrKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbk9wZW5Nb2RhbEVzY1ByZXNzKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9uU2l0ZU5hdkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQudGFyZ2V0ID09PSBzaXRlTmF2IHx8IGV2dC50YXJnZXQgPT09IHNpdGVOYXZJbm5lciB8fCBldnQudGFyZ2V0ID09PSBzaXRlTmF2Qm90dG9tKSB7XG4gICAgICBzaXRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtbmF2LS1vcGVuZWQnKTtcbiAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKHNpdGVOYXYpO1xuXG4gICAgICBzaXRlTmF2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25TaXRlTmF2Q2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb25PcGVuTW9kYWxFc2NQcmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBzaXRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtbmF2LS1vcGVuZWQnKTtcbiAgICAgIHdpbmRvdy51dGlscy5jbG9zZU1vZGFsKHNpdGVOYXYpO1xuXG4gICAgICBzaXRlTmF2LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25TaXRlTmF2Q2xpY2spO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uT3Blbk1vZGFsRXNjUHJlc3MpO1xuICAgIH1cbiAgfTtcblxuICBzaXRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtbmF2LS1ub2pzJylcblxuICBtZW51QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25NZW51QnRuQ2xpY2spO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxvY2F0aW9uTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdl9fbGluay0tbG9jYXRpb24nKTtcbiAgdmFyIGxvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLS1sb2NhdGlvbicpO1xuICB2YXIgbG9jYXRpb25DbG9zZUJ0biA9IGxvY2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UtYnRuJyk7XG4gIHZhciBmZWVkYmFja0xpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1uYXZfX2xpbmstLXF1ZXN0aW9uJyk7XG4gIHZhciBmZWVkYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tZmVlZGJhY2snKTtcbiAgdmFyIGZlZWRiYWNrQ2xvc2VCdG4gPSBmZWVkYmFjay5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2Nsb3NlLWJ0bicpO1xuXG4gIHZhciBsb2NhdGlvbk1vZGFsID0gbmV3IHdpbmRvdy51dGlscy5Nb2RhbChsb2NhdGlvbiwgbG9jYXRpb25DbG9zZUJ0bik7XG4gIHZhciBmZWVkYmFja01vZGFsID0gbmV3IHdpbmRvdy51dGlscy5Nb2RhbChmZWVkYmFjaywgZmVlZGJhY2tDbG9zZUJ0bik7XG5cbiAgbG9jYXRpb25MaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9jYXRpb25Nb2RhbC5vbk1vZGFsTGlua0NsaWNrKTtcbiAgZmVlZGJhY2tMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZmVlZGJhY2tNb2RhbC5vbk1vZGFsTGlua0NsaWNrKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBmZWVkYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC0tZmVlZGJhY2sgZm9ybScpO1xuICB2YXIgc3VibWl0QnRuID0gZmVlZGJhY2sucXVlcnlTZWxlY3RvcignLm1vZGFsLWZlZWRiYWNrX19zdWJtaXQnKTtcbiAgdmFyIHVzZXJOYW1lID0gZmVlZGJhY2sucXVlcnlTZWxlY3RvcignI25hbWUnKTtcbiAgdmFyIHVzZXJFbWFpbCA9IGZlZWRiYWNrLnF1ZXJ5U2VsZWN0b3IoJyNlbWFpbCcpO1xuICB2YXIgYWdyZWVtZW50ID0gZmVlZGJhY2sucXVlcnlTZWxlY3RvcignI2FncmVlbWVudCcpO1xuXG4gIHZhciBSRV9FTUFJTCA9IC9eW1xcd117MSx9XFxAW1xcd117Mix9XFwuW1xcd117Mix9JC87XG5cbiAgdmFyIGlzU3RvcmFnZVN1cHBvcnQgPSB0cnVlO1xuICB2YXIgc3RvcmFnZSA9ICcnO1xuXG4gIHZhciB2YWxpZGl0eSA9IHtcbiAgICBuYW1lOiBmYWxzZSxcbiAgICBlbWFpbDogZmFsc2UsXG4gICAgcXVlc3Rpb246IGZhbHNlLFxuICB9O1xuXG4gIHZhciBvbkZvcm1TdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGlzU3RvcmFnZVN1cHBvcnQpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCduYW1lJywgdXNlck5hbWUudmFsdWUpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2VtYWlsJywgdXNlckVtYWlsLnZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNoZWNrVmFsaWRpdHkgPSBmdW5jdGlvbiAoaW5wdXQsIHRhcmdldCkge1xuXG4gICAgaWYgKGlucHV0ICYmIHRhcmdldC52YWx1ZSkge1xuICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1zdWNjZXNzJyk7XG4gICAgICB2YWxpZGl0eVt0YXJnZXQubmFtZV0gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaW5wdXQpIHtcbiAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tc3VjY2VzcycpO1xuICAgICAgdmFsaWRpdHlbdGFyZ2V0Lm5hbWVdID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldCA9PT0gdXNlckVtYWlsKSB7XG4gICAgICBpZiAoIVJFX0VNQUlMLnRlc3QodGFyZ2V0LnZhbHVlKSkge1xuICAgICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1zdWNjZXNzJyk7XG4gICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbGlkaXR5W3RhcmdldC5uYW1lXSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtZmVlZGJhY2tfX2lucHV0LS1zdWNjZXNzJyk7XG4gICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWZlZWRiYWNrX19pbnB1dC0tZXJyb3InKTtcblxuICAgICAgICB2YWxpZGl0eVt0YXJnZXQubmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhZ3JlZW1lbnQuY2hlY2tlZCAmJiB2YWxpZGl0eS5uYW1lICYmIHZhbGlkaXR5LmVtYWlsICYmIHZhbGlkaXR5LnF1ZXN0aW9uKSB7XG4gICAgICBzdWJtaXRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VibWl0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9udGV4dEZpZWxkSW5wdXQgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIGlucHV0ID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcubW9kYWwtZmVlZGJhY2tfX2lucHV0Jyk7XG5cbiAgICBjaGVja1ZhbGlkaXR5KGlucHV0LCBldnQudGFyZ2V0KTtcbiAgfTtcblxuICB0cnkge1xuICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbmFtZScpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpc1N0b3JhZ2VTdXBwb3J0ID0gZmFsc2U7XG4gIH1cblxuICBpZiAoc3RvcmFnZSkge1xuICAgIHVzZXJOYW1lLnZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ25hbWUnKTtcbiAgICB1c2VyRW1haWwudmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZW1haWwnKTtcblxuICAgIGNoZWNrVmFsaWRpdHkodXNlck5hbWUuY2xvc2VzdCgnLm1vZGFsLWZlZWRiYWNrX19pbnB1dCcpLCB1c2VyTmFtZSk7XG4gICAgY2hlY2tWYWxpZGl0eSh1c2VyRW1haWwuY2xvc2VzdCgnLm1vZGFsLWZlZWRiYWNrX19pbnB1dCcpLCB1c2VyRW1haWwpO1xuICB9XG5cbiAgc3VibWl0QnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBmZWVkYmFjay5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9udGV4dEZpZWxkSW5wdXQpO1xuICBmZWVkYmFjay5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBvbkZvcm1TdWJtaXQpO1xufSkoKTtcbiJdfQ==
