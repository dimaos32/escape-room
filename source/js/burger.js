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
