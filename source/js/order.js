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
