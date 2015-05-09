(function (window, undefined) {
	var
		class2type = {},
		toString = class2type.toString;

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
		isArray: Array.isArray,

		//判断对象是否是window对象
		isWindow: function (obj) {
			return obj != null && obj === obj.window;
		},

		each: function (obj, callback, args) {
			var i = 0,
				length = obj.length,
				isArray = jQuery.isArray(obj);

			if (isArray) {
				for (; i < length; i++) {
					//callback(索引, 值)
					callback.call(obj[i], i, obj[i]);
				}
			} else {
				for (i in obj) {
					//callback(属性, 值)
					callback.call(obj[i], i, obj[i]);
				}
			}

			return obj;
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
		},

		type: function (obj) {
			if (obj == null) {
				//null或undefined 
				return obj + "";
			}

			if (typeof obj === "object" || typeof obj === "function") {
				//对象类型
				return class2type[toString.call(obj)] || "object"
			} else {
				//boolean number string
				return typeof obj;
			}
		}
	});

	//初始化class2type对象，class到type的映射
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	function isArraylike(obj) {
		//如果是数组返回长度，非数组返回false
		var length = "length" in obj && obj.length,
			type = jQuery.type(obj);

		//functon和windows对象返回false
		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		//Node对象 类型是ELEMENT_NODE
		if (obj.nodeType === 1 && length) {
			return true;
		}

		return type === "array" || length === 0 ||
			//这种啥情况？
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}
	
	window.jQuery = window.$ = jQuery;
}(window));