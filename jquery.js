(function (window, undefined) {
	var jQuery = function (selector) {
		return new jQuery.fn.init(selector);
	};

	jQuery.fn = jQuery.prototype = {
		constructor: jQuery,
		init: function (selector) {
			return this;
		},
		//实例方法
		each: function (callback, args) {
			return jQuery.each(this, callback, args);
		}
	};

	//静态方法
	jQuery.each = function (obj, callback, args) {

	};

	jQuery.fn.init.prototype = jQuery.fn;

	window.jQuery = window.$ = jQuery;
}(window));