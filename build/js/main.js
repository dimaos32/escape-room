'use strict';

(function () {
  var HTML = document.querySelector('html');

  var openModal = function (modal) {
    if (document.body.offsetHeight > window.innerHeight) {
      document.body.dataset.scrollY = self.pageYOffset;
      document.body.style.top = document.body.dataset.scrollY * -1 + 'px';

      document.body.classList.add('page--block-scroll');
    }

    modal.classList.remove('modal--closed');
    modal.classList.add('modal--opened');
  };

  var closeModal = function (modal) {
    modal.classList.add('modal--closed');
    modal.classList.remove('modal--opened');

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuXG4gIHZhciBvcGVuTW9kYWwgPSBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuZGF0YXNldC5zY3JvbGxZID0gc2VsZi5wYWdlWU9mZnNldDtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkgKiAtMSArICdweCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG4gICAgfVxuXG4gICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtLWNsb3NlZCcpO1xuICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ21vZGFsLS1vcGVuZWQnKTtcbiAgfTtcblxuICB2YXIgY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChtb2RhbCkge1xuICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ21vZGFsLS1jbG9zZWQnKTtcbiAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC0tb3BlbmVkJyk7XG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS0tYmxvY2stc2Nyb2xsJyk7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gMDtcbiAgICAgIEhUTUwuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnYXV0byc7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnNjcm9sbFkpO1xuICAgICAgSFRNTC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9ICdzbW9vdGgnO1xuICAgIH1cbiAgfTtcblxuICB3aW5kb3cudXRpbHMgPSB7XG4gICAgJ29wZW5Nb2RhbCc6IG9wZW5Nb2RhbCxcbiAgICAnY2xvc2VNb2RhbCc6IGNsb3NlTW9kYWwsXG4gIH07XG59KSgpO1xuIl19
