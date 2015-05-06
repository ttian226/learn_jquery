(function (window, undefined) {
	var jQuery = function (selector) {
		if (!(this instanceof jQuery)) {
			return new jQuery(selector);
		}
		this.selector = selector;
	};
	window.jQuery = window.$ = jQuery;
}(window));