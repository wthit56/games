var on = (function () {
	var on;

	if (window.addEventListener) {
		on = function (element, event, handler, capture) {
			return element.addEventListener(event, handler, capture);
		}
		on.remove = function (element, event, handler) {
			return element.removeEventListener(event, handler);
		};
	}
	else if (window.attachEvent) {
		on = function (element, event, handler, capture) {
			return element.attachEvent(event, handler, capture);
		};
		on.remove = function (element, event, handler) {
			return element.detachEvent(event, handler);
		};
	}

	return on;
})();