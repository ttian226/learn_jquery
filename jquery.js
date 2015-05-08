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

	jQuery.fn.init.prototype = jQuery.fn;

	//jQuery插件扩展
	jQuery.extend = jQuery.fn.extend = function () {
		var options, name, copy,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		//只有一个参数，就是对jQuery或jQuery原型对象的扩展
		if (i === length) {
			//调用的上下文对象jQuery或jQuery原型对象
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				//options不为空时开始遍历
				for (name in options) {
					copy = options[name];
					//扩展jQuery对象或原型对象
					target[name] = copy;
				}
			}
		}
		return target;
	};

	//静态方法
	jQuery.extend({
		each: function (obj, callback, args) {
			//...code...
		},
		//合并两个数组并返回一个新的数组
		merge: function (first, second) {
			var l = second.length,
				i = first.length,
				j = 0;

			for (; j < l; j++) {
				first[i++] = second[j];
			}

			first.length = i;
			return first;
		}
	});

	window.jQuery = window.$ = jQuery;
}(window));