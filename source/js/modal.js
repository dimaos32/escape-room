'use strict';

(function () {
  var locationLink = document.querySelector('.site-nav__link--location');
  var location = document.querySelector('.modal--location');
  var locationCloseBtn = location.querySelector('.modal__close-btn');

  var locationModal = new window.utils.Modal(location, locationCloseBtn);

  locationLink.addEventListener('click', locationModal.onModalLinkClick);
})();
