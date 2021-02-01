'use strict';

(function () {
  if (document.querySelector('.modal--location')) {
    var locationLink = document.querySelector('.site-nav__link--location');
    var location = document.querySelector('.modal--location');
    var locationCloseBtn = location.querySelector('.modal__close-btn');

    var locationModal = new window.utils.Modal(location, locationCloseBtn);

    locationLink.addEventListener('click', locationModal.onModalLinkClick);
  }

  if (document.querySelector('.modal--feedback')) {
    var feedbackLink = document.querySelector('.site-nav__link--question');
    var feedback = document.querySelector('.modal--feedback');
    var feedbackCloseBtn = feedback.querySelector('.modal__close-btn');

    var feedbackModal = new window.utils.Modal(feedback, feedbackCloseBtn);

    feedbackLink.addEventListener('click', feedbackModal.onModalLinkClick);
  }
})();
