(function (window, undefined) {
	var
		arr = [],
		push = arr.push,
		indexOf = arr.indexOf,
		class2type = {},
		toString = class2type.toString,
		version = "1.0.0";

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
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

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

		makeArray: function (arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArraylike(Object(arr))) {
					//把HTMLCollection对象转化为Dom数组
					jQuery.merge(ret, 
						typeof arr === "string" ?
						[arr] : arr
					);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},

		// 如果elem在arr中返回在数组中的索引，如果找不到返回-1
		inArray: function(elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},

		//合并两个数组并返回一个新的数组，同时改变第一个数组
		//second可以是一个isArraylike对象(HTMLCollection对象)
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

		// 判断对象是否为空
		isEmptyObject: function (obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},

		type: function (obj) {
			if (obj == null) {
				//null或undefined 
				return obj + "";
			}

			return typeof obj === "object" || typeof obj === "function" ?
				//对象类型
				class2type[toString.call(obj)] || "object" :
				//boolean number string
				typeof obj;
		}
	});

	//初始化class2type对象，class到type的映射
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	function isArraylike(obj) {
		//如果是数组返回长度
		//如果对象包含length属性(例如HTMLCollection对象)，返回length
		//其它返回false
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
			//HTMLCollection对象
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}

	var rnotwhite = (/\S+/g);
	// 用来存储options缓存数据
	var optionsCache = {};

	// 创建参数缓存
	function createOptions(options) {
		// 例如options = "once"
		// object = optionsCache["once"] = {}
		var object = optionsCache[options] = {};

		// 通过正则用空白符分割参数
		jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
			// 由于object指向optionsCache["once"]的引用
			// 可以通过修改object来改变对象optionsCache["once"]
			// 现在object["once"] = true 即 optionsCache["once"] = {once: true}
			object[flag] = true;
		});

		// 返回object 即 {once: true}
		return object;
	}

	jQuery.Callbacks = function (options) {

		options = typeof options === "string" ?
			// 如果optionsCache中存在缓存数据直接取，否则通过createOptions创建缓存并返回数据
			(optionsCache[options] || createOptions(options)) :
			// 不传任何参数时返回空对象{}
			jQuery.extend({}, options);

		var // 用来存储上一次调用fire的参数
			memory,
			// list当前索引
			firingIndex,
			// 第一个回调的起始索引
			firingStart,
			// list中回调函数个数
			firingLength,
			// 回调函数数组
			list = [],

			fire = function (data) {
				// 当options为memory时，memory=data，否则memory=undefined
				memory = options.memory && data;
				// 当memory模式时，firingStart被设置为新增函数在list中的起始索引
				firingIndex = firingStart || 0;
				// 每次调用fire时重置firingStart
				firingStart = 0;
				firingLength = list.length;
				
				// 遍历list数组依次执行回调函数
				for (; firingIndex < firingLength; firingIndex++) {
					// data[0]上下文，data[1]参数列表
					// 当stopOnFalse模式时，当某个回调函数返回false时，中断后续回调函数被调用
					if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
						memory = false;
						break;
					}
				}

				// options为once
				if (options.once === true) {
					self.disable();
				}
			},

			self = {
				add: function () {
					// list数组为空也返回true
					// 只有调用了disable()使list = undefined才返回false
					if (list) {
						var start = list.length;

						// 这是一个函数名为add的闭包函数
						(function add(args) {
							jQuery.each(args, function (_, arg) {
								var type = jQuery.type(arg);
								if (type === "function") {
									// callback.add(fn1) 或 callback.add(fn1, fn2)
									// 这里arg是一个function
									 
									// 1. 当不是unique模式时，options.unique为undefined，!options.unique为true，直接push
									// 2. 如果是unique模式时，!options.unique为false，需要判断下一个表达式
									// 3. 如果arg不在list中，self.has(arg)为false，!self.has(arg)为true，进入push
									// 4. 如果arg已经存在list中，self.has(arg)为true，!self.has(arg)为false，不会push
									if (!options.unique || !self.has(arg)) {
										list.push(arg);
									}
								} else {
									// callback.add([fn1]) 或 callback.add([fn1, fn2])
									// 这里arg是一个函数数组 [function, function, ...]
									// 调用闭包add函数
									add(arg);
								}
							});
						}(arguments));

						if (memory) {
							// 设置新的起始索引值，只调用新增的回调函数
							// 避免memory模式时，调用全部的回调函数
							firingStart = start;
							// 调用fire立即执行回调,memory为之前fire时保存的参数
							fire(memory);
						}
						
					}
				},

				fireWith: function (context, args) {
					if (list) {
						args = args || [];
						// args数组第一个元素保存上下文，第二个元素保存一个参数数组
						args = [context, args.slice ? args.slice() : args];
						// 调用内部函数fire
						fire(args);
					}
					return this;
				},

				fire: function () {
					// this是当前jQuery.Callbacks()对象
					self.fireWith(this, arguments);
					return this;
				},

				disable: function () {
					// list = undefined 不能被add和fire
					list = memory = undefined;
					return this;
				},

				has: function (fn) {
					return fn ?
						// fn在list中inArray返回索引值(>-1) 结果返回true
						// 如果fn不在list中inArray返回-1 结果返回false
						jQuery.inArray( fn, list ) > -1 :

						// list && list.length 这个表达式如果list为true时返回的是后面的值list.length
						// 通过给表达式加!!可以把整数(list.length)转换为true。
						!!(list && list.length);
				}
			};

		return self;
	};

	function Data() {
		// 利用Object.defineProperty给this.cache创建属性0
		// Object.defineProperty创建的属性默认是不可枚举不可写的
		Object.defineProperty(this.cache = {}, 0, {
			get: function () {
				return {};
			}
		});

		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.accepts = function (owner) {
		// 1. Node.ELEMENT_NODE
		// 2. Node.DOCUMENT_NODE
		// 3. 任何类型
		return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
	}

	Data.prototype = {
		key: function (owner) {
			// 判断owner类型
			if (!Data.accepts(owner)) {
				return 0;
			}

			// descriptor一个辅助变量只是给owner赋值用
			var descriptor = {},
				// 获取owner对象的this.expando属性值
				// 当owner对象第一次set数据时，unlock是undefined（即this.expando属性是不存在的）
				// 当owner对象已经被缓存过数据时，返回unlock值
				// **对于同一个dom节点，有且只有一个this.expando属性
				// **对于所有的dom节点this.expando值是相同的，因为都是同一个Data对象实例
				unlock = owner[this.expando];

			if (!unlock) {
				// 给unlock赋值一个全局唯一的整数
				unlock = Data.uid++;

				// 给owner对象属性this.expando赋值unlock
				try {
					// 即owner[this.expando] = unlock，且该属性不可枚举不可写。
					descriptor[this.expando] = {value: unlock};
					Object.defineProperties(owner, descriptor);
				} catch (e) {
					descriptor[this.expando] = unlock;
					jQuery.extend(owner, descriptor);
				}
				
			}

			// this.cache真正用来存储缓存数据，它是全局的
			// 而dom的this.expando只是起到一个索引的作用（unlock可以理解索引值）
			// 根据unlock值在cache取对应的缓存数据
			
			// 如果this.cache[unlock]未定义，则新建一个空对象，以后用来保存数据
			if (!this.cache[unlock]) {
				this.cache[unlock] = {};
			}

			// 返回这个unlock（缓存索引）
			return unlock;
		},
		get: function (owner, key) {
			var cache = this.cache[this.key(owner)];
			return key === undefined ? 
				// 如果key为空返回owner所有缓存数据
				// 否则返回指定key的缓存数据
				cache : cache[key];
		},
		set: function (owner, data, value) {
			var prop,
				// 返回owner对于的unlock值，
				// 如果第一次set返回刚刚建立的，不是第一次返回保存在owner对象属性上（this.expando）的值。
				unlock = this.key(owner),
				// 局部变量cache指向this.cache[unlock]的引用，目的为了通过修改cache而修改缓存数据
				cache = this.cache[unlock];

			if (typeof data === "string") {
				// 添加或修改cache对象，缓存为this.cache[unlock][data] = value
				cache[data] = value;

			// data为对象,例如$.data(elem, {key: "value"})
			} else {
				// dom中的缓存cache为空（是一个空对象Object{}）
				if (jQuery.isEmptyObject(cache)) {
					jQuery.extend(this.cache[unlock], data);
				// 缓存对象不为空，之前已经存储过数据
				} else {
					for (prop in data) {
						cache[prop] = data[prop];
					}
				}
			}

			return cache;
		},
		access: function (owner, key, value) {
			var stored;

			// key未undefined时即只传一个参数，这时获取所有数据
			if (key === undefined ||
				// key存在并且value不存在，根据key取数据
				(key && typeof key === 'string' && value === undefined)) {
				// 调用get()方法获取缓存数据
				stored = this.get(owner, key);
				// 返回数据
				return stored;
			}

			// 调用set存储数据
			this.set(owner, key, value);

			// set时，会返回value
			// 这里value不会有undefined的情况，如果是undefined应该走get()了
			return value !== undefined ? value : key;
		},
		remove: function (owner, key) {
			var i, 
				name,	//存储缓存key的一个数组[key1, key2...]
				unlock = this.key(owner),
				cache = this.cache[unlock];

			// 不指定key，清空这个dom所有缓存
			if (key === undefined) {
				this.cache[unlock] = {};
			} else {
				if (jQuery.isArray(key)) {
					name = key;
				} else {
					// key是缓存对象的一个属性
					if (key in cache) {
						// 数组中只有一个元素
						name = [key];
					// key是用空格分隔的的，例如"key1 key2 key3"
					} else {
						name = key;
						name = name in cache ?
							// 字符串正好是cache的一个属性
							[name] : 
							// 用空格分隔字符串返回的数组
							(name.match(rnotwhite) || []);
					}
				}

				i = name.length;
				while (i--) {
					delete cache[name[i]];
				}
			}
		},
		hasData: function (owner) {

		}
	}

	var data_user = new Data();
	
	// 数据缓存相关静态函数
	jQuery.extend({
		hasData: function (elem) {
			return data_user.hasData(elem);
		},

		data: function (elem, name, data) {
			return data_user.access(elem, name, data);
		},

		removeData: function (elem, name) {
			return data_user.remove(elem, name);
		}
	});

	window.jQuery = window.$ = jQuery;

}(window));

