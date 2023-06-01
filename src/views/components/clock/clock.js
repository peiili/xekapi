(function (window) {
	'use strict';

	var Digit = (function () {
		var Digit = function (container) {
			this.container = container;
		};
		Digit.prototype.setDigit = function (digit) {
			digit = digit + '';
			if (this.digit === digit) {
				return;
			}
			this.digit = digit;
			this.container.className = 'digit digit_' + digit;
		};
		return Digit;
	})();

	var template = (function () {
		function clockTemplate () {
			return ['<div class="pixel">',
				'<div class="hand hand_hour"></div>',
				'<div class="hand hand_minute"></div>',
				'</div>'
			].join('');
		}
		function digitTemplate () {
			var result = ['<div class="digit">'];
			for (var i = 0; i < 24; i++) {
				result.push(clockTemplate());
			}
			result.push('</div>');
			return result.join('');
		}
		function numberTemplate () {
			return [
				'<div class="number">',
				digitTemplate(),
				digitTemplate(),
				'</div>'
			].join('');
		}
		return function () {
			return [
				numberTemplate(),
				numberTemplate(),
				numberTemplate()
			].join('');
		};
	})();

	var start = (function () {
		var _digits, prevSeconds;
		function getDigits (num) {
			return ((num > 9 ? '' : '0') + num).split('');
		}
		function update (date, seconds) {
			var digitsList = [];
			digitsList = digitsList.concat(getDigits(date.getHours()));
			digitsList = digitsList.concat(getDigits(date.getMinutes()));
			digitsList = digitsList.concat(getDigits(seconds));
			digitsList.forEach(function (digit, index) {
				_digits[index].setDigit(digit);
			});
		}
		function tick () {
			var now = new Date();
			var seconds = now.getSeconds();
			if (seconds !== prevSeconds) {
				prevSeconds = seconds;
				update(now, seconds);
			}
			setTimeout(tick, 100);
		}
		return function (digits) {
			_digits = digits;
			tick();
		};
	})();

	// entry point
	function init () {
		var cont = document.querySelector('#clock');
		cont.innerHTML = template();

		var digits = Array.prototype.slice.call(cont.querySelectorAll('.digit'))
			.map(function (cont) {
				return new Digit(cont);
			});

		// A fancy timeout
		setTimeout(start.bind(null, digits), 1000);
	}

	window.addEventListener('load', init);
})(window);
