'use strict';

(function () {
  var HTML = document.querySelector('html');

  var openModal = function (modal) {
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
    'openModal': openModal,
    'closeModal': closeModal,
  };
})();

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwiYnVyZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuXG4gIHZhciBvcGVuTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZID0gc2VsZi5wYWdlWU9mZnNldDtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkgKiAtMSArICdweCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG4gICAgfVxuXG4gICAgaWYgKG1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwnKSkge1xuICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnbW9kYWwtLW9wZW5lZCcpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChtb2RhbCkge1xuICAgIGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsJykpIHtcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLS1vcGVuZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gMDtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnYXV0byc7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkpO1xuICAgICAgSFRNTC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9ICdzbW9vdGgnO1xuICAgIH1cbiAgfTtcblxuICB3aW5kb3cudXRpbHMgPSB7XG4gICAgJ29wZW5Nb2RhbCc6IG9wZW5Nb2RhbCxcbiAgICAnY2xvc2VNb2RhbCc6IGNsb3NlTW9kYWwsXG4gIH07XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgc2l0ZU5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW5hdicpO1xuICB2YXIgbWVudUJ0biA9IHNpdGVOYXYucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2X19tZW51LWJ0bicpO1xuXG4gIHZhciBvbk1lbnVCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnY2xpY2shJyk7XG4gICAgaWYgKHNpdGVOYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaXRlLW5hdi0tb3BlbmVkJykpIHtcbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuICAgICAgd2luZG93LnV0aWxzLmNsb3NlTW9kYWwoc2l0ZU5hdik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpdGVOYXYuY2xhc3NMaXN0LmFkZCgnc2l0ZS1uYXYtLW9wZW5lZCcpO1xuICAgICAgd2luZG93LnV0aWxzLm9wZW5Nb2RhbChzaXRlTmF2KTtcbiAgICB9XG4gIH07XG5cbiAgbWVudUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uTWVudUJ0bkNsaWNrKTtcbn0pKCk7XG4iXX0=
