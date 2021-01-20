'use strict';

(function () {
  var siteNav = document.querySelector('.site-nav');
  var menuBtn = siteNav.querySelector('.site-nav__menu-btn');

  var onMenuBtnClick = function () {
    console.log('click!');
    if (siteNav.classList.contains('site-nav--opened')) {
      siteNav.classList.remove('site-nav--opened');
      window.utils.closeModal(siteNav);
    } else {
      siteNav.classList.add('site-nav--opened');
      window.utils.openModal(siteNav);
    }
  };

  menuBtn.addEventListener('click', onMenuBtnClick);
})();
