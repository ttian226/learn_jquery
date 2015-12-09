(function(window, undefined) {
    var
        arr = [],
        push = arr.push,
        indexOf = arr.indexOf,
        slice = arr.slice,
        concat = arr.concat,
        class2type = {},
        toString = class2type.toString,
        version = "1.0.0",
        document = window.document,
        rtrim = /^[\s]+|[\s]+$/g;

    var jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
    };

    //实例方法
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,

        selector: '',

        length: 0,

        each: function(callback, args) {
            return jQuery.each(this, callback, args);
        },

        map: function (callback) {
            var ret = jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            });
            return this.pushStack(ret);
        },

        get: function (num) {
            return num != null ?

                //当num>=0时，返回第num个element对象(num是当前jQuery实例的一个属性)
                //当num<0时，反向获取element对象。
                (num < 0 ? this[num + this.length] : this[num]) :

                //当不传任何参数时，仅仅把当前jQuery实例转换为数组并返回
                slice.call(this);
        },
        // 压栈
        pushStack: function (elems) {
            //elems dom数组
            //this.constructor 当前的jQuery对象
            //把elems合并到当前的jQuery对象上
            var ret = jQuery.merge(this.constructor(), elems);

            //这里把当前的实例this赋值给prevObject属性。
            //this是压栈前的对象
            ret.prevObject = this;
            ret.context = this.context;

            //返回这个新的jQuery对象
            return ret;
        },
        end: function () {
            //返回prevObject保存的jQuery对象
            //或返回当前jQuery对象，如果prevObject属性不存在。
            return this.prevObject || this.constructor(null);
        }
    };


    jQuery.extend = jQuery.fn.extend = function() {
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

        isFunction: function(obj) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray,

        //判断对象是否是window对象
        isWindow: function(obj) {
            return obj != null && obj === obj.window;
        },

        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        each: function(obj, callback, args) {
            var value,
                i = 0,
                length = obj.length,
                isArray = isArraylike(obj);

            if (isArray) {
                for (; i < length; i++) {
                    //callback(索引, 值)
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    //callback(属性, 值)
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }

            return obj;
        },

        trim: function (text) {
            return text == null ? '' : (text + '').replace(rtrim, '');
        },

        makeArray: function(arr, results) {
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
        merge: function(first, second) {
            var l = second.length,
                i = first.length,
                j = 0;

            for (; j < l; j++) {
                first[i++] = second[j];
            }

            first.length = i;
            return first;
        },

        // 可以理解为filter函数
        grep: function (elems, callback, invert) {
            // 只有当inver为true时,筛选callback结果为false的值
            // 默认情况下,筛选callback结果为true的值
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !invert;

            for (; i < length; i++) {
                callbackInverse = callback(elems[i], i);
                if (callbackInverse === callbackExpect) {
                    matches.push(elems[i]);
                }
            }

            return matches;
        },

        map: function (elems, callback) {
            var value,
                i = 0,
                length = elems.length,
                isArray = isArraylike(elems),
                ret = [];

            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i);

                    if (value != null) {
                        ret.push(value);
                    }
                }
            } else {
                for (i in elems) {
                    value = callback(elems[i], i);

                    if (value != null) {
                        ret.push(value);
                    }
                }
            }

            return concat.apply([], ret);
        },

        // 判断对象是否为空
        isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },

        type: function(obj) {
            if (obj == null) {
                //null或undefined
                return obj + "";
            }

            return typeof obj === "object" || typeof obj === "function" ?
                //对象类型
                class2type[toString.call(obj)] || "object" :
                //boolean number string
                typeof obj;
        },

        now: Date.now
    });

    //初始化class2type对象，class到type的映射
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    jQuery.fn.extend({
        find: function (selector) {
            var i = 0,
                len = this.length,
                ret = [],
                self = this;

            for (; i < len; i++) {
                jQuery.find(selector, self[i], ret);
            }

            ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
            ret.selector = this.selector ? this.selector + ' ' + selector : selector;

            return ret;
        }
    });

    var rootjQuery,

        // 匹配html标签或者匹配'#id'
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

        init = jQuery.fn.init = function (selector, context) {
            var match, elem;

            // $(""), $(null), $(undefined), $(false)
            if (!selector) {
                return this;
            }

            // 通过css选择器返回的jQuery对象
            if (typeof selector === 'string') {
                if (selector[0] === '<' && selector[selector.length - 1] === '>' && selector.length >= 3) {
                    // 假设字符串是匹配<>,则跳过正则检测
                    match = [null, selector, null];
                } else {
                    // 正则检查html
                    match = rquickExpr.exec(selector);
                }

                // 如果match为null则不是html字符串
                if (match && (match[1] || !context)) {

                    // 处理$(html)
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;

                        context = context && context.nodeType ? context.ownerDocument || context : document;
                        jQuery.merge(this, jQuery.parseHTML(match[1], context));
                        return this;
                    } else {
                        // 处理$(#id)
                        elem = document.getElementById(match[2]);

                        if (elem && elem.parentNode) {
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }
                } else if (!context || context.jQuery) {
                    // 目测除了$(#id),$(html)两种情况都走这里
                    return (context || rootjQuery).find(selector);
                } else {

                }
            } else if (selector.nodeType) {
                // 处理$(DOMElement)返回的jQuery对象
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            } else if (jQuery.isFunction(selector)) {
                // 处理document ready
            }

            // 处理$($(selector))
            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }

            return jQuery.makeArray(selector, this);
        };

    init.prototype = jQuery.fn;

    rootjQuery = jQuery(document);


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

    var Sizzle =
        /*!
         * Sizzle CSS Selector Engine v2.2.0-pre
         * http://sizzlejs.com/
         *
         * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
         * Released under the MIT license
         * http://jquery.org/license
         *
         * Date: 2014-12-16
         */
        (function( window ) {

            var i,
                support,
                Expr,
                getText,
                isXML,
                tokenize,
                compile,
                select,
                outermostContext,
                sortInput,
                hasDuplicate,

            // Local document vars
                setDocument,
                document,
                docElem,
                documentIsHTML,
                rbuggyQSA,
                rbuggyMatches,
                matches,
                contains,

            // Instance-specific data
                expando = "sizzle" + 1 * new Date(),
                preferredDoc = window.document,
                dirruns = 0,
                done = 0,
                classCache = createCache(),
                tokenCache = createCache(),
                compilerCache = createCache(),
                sortOrder = function( a, b ) {
                    if ( a === b ) {
                        hasDuplicate = true;
                    }
                    return 0;
                },

            // General-purpose constants
                MAX_NEGATIVE = 1 << 31,

            // Instance methods
                hasOwn = ({}).hasOwnProperty,
                arr = [],
                pop = arr.pop,
                push_native = arr.push,
                push = arr.push,
                slice = arr.slice,
            // Use a stripped-down indexOf as it's faster than native
            // http://jsperf.com/thor-indexof-vs-for/5
                indexOf = function( list, elem ) {
                    var i = 0,
                        len = list.length;
                    for ( ; i < len; i++ ) {
                        if ( list[i] === elem ) {
                            return i;
                        }
                    }
                    return -1;
                },

                booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

            // Regular expressions

            // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
                whitespace = "[\\x20\\t\\r\\n\\f]",
            // http://www.w3.org/TR/css3-syntax/#characters
                characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

            // Loosely modeled on CSS identifier characters
            // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
            // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
                identifier = characterEncoding.replace( "w", "w#" ),

            // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
                attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
                        // Operator (capture 2)
                    "*([*^$|!~]?=)" + whitespace +
                        // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
                    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
                    "*\\]",

                pseudos = ":(" + characterEncoding + ")(?:\\((" +
                        // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                        // 1. quoted (capture 3; capture 4 or capture 5)
                    "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                        // 2. simple (capture 6)
                    "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
                        // 3. anything else (capture 2)
                    ".*" +
                    ")\\)|)",

            // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
                rwhitespace = new RegExp( whitespace + "+", "g" ),
                rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

                rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
                rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

                rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

                rpseudo = new RegExp( pseudos ),
                ridentifier = new RegExp( "^" + identifier + "$" ),

                matchExpr = {
                    "ID": new RegExp( "^#(" + characterEncoding + ")" ),
                    "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
                    "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
                    "ATTR": new RegExp( "^" + attributes ),
                    "PSEUDO": new RegExp( "^" + pseudos ),
                    "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                        "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                        "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
                    "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
                    // For use in libraries implementing .is()
                    // We use this for POS matching in `select`
                    "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                        whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
                },

                rinputs = /^(?:input|select|textarea|button)$/i,
                rheader = /^h\d$/i,

                rnative = /^[^{]+\{\s*\[native \w/,

            // Easily-parseable/retrievable ID or TAG or CLASS selectors
                rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

                rsibling = /[+~]/,
                rescape = /'|\\/g,

            // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
                runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
                funescape = function( _, escaped, escapedWhitespace ) {
                    var high = "0x" + escaped - 0x10000;
                    // NaN means non-codepoint
                    // Support: Firefox<24
                    // Workaround erroneous numeric interpretation of +"0x"
                    return high !== high || escapedWhitespace ?
                        escaped :
                        high < 0 ?
                            // BMP codepoint
                            String.fromCharCode( high + 0x10000 ) :
                            // Supplemental Plane codepoint (surrogate pair)
                            String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
                },

            // Used for iframes
            // See setDocument()
            // Removing the function wrapper causes a "Permission Denied"
            // error in IE
                unloadHandler = function() {
                    setDocument();
                };

// Optimize for push.apply( _, NodeList )
            try {
                push.apply(
                    (arr = slice.call( preferredDoc.childNodes )),
                    preferredDoc.childNodes
                );
                // Support: Android<4.0
                // Detect silently failing push.apply
                arr[ preferredDoc.childNodes.length ].nodeType;
            } catch ( e ) {
                push = { apply: arr.length ?

                    // Leverage slice if possible
                    function( target, els ) {
                        push_native.apply( target, slice.call(els) );
                    } :

                    // Support: IE<9
                    // Otherwise append directly
                    function( target, els ) {
                        var j = target.length,
                            i = 0;
                        // Can't trust NodeList.length
                        while ( (target[j++] = els[i++]) ) {}
                        target.length = j - 1;
                    }
                };
            }

            function Sizzle( selector, context, results, seed ) {
                var match, elem, m, nodeType,
                // QSA vars
                    i, groups, old, nid, newContext, newSelector;

                if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
                    setDocument( context );
                }

                context = context || document;
                results = results || [];
                nodeType = context.nodeType;

                if ( typeof selector !== "string" || !selector ||
                    nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

                    return results;
                }

                if ( !seed && documentIsHTML ) {

                    // Try to shortcut find operations when possible (e.g., not under DocumentFragment)
                    if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
                        // Speed-up: Sizzle("#ID")
                        if ( (m = match[1]) ) {
                            if ( nodeType === 9 ) {
                                elem = context.getElementById( m );
                                // Check parentNode to catch when Blackberry 4.6 returns
                                // nodes that are no longer in the document (jQuery #6963)
                                if ( elem && elem.parentNode ) {
                                    // Handle the case where IE, Opera, and Webkit return items
                                    // by name instead of ID
                                    if ( elem.id === m ) {
                                        results.push( elem );
                                        return results;
                                    }
                                } else {
                                    return results;
                                }
                            } else {
                                // Context is not a document
                                if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                                    contains( context, elem ) && elem.id === m ) {
                                    results.push( elem );
                                    return results;
                                }
                            }

                            // Speed-up: Sizzle("TAG")
                        } else if ( match[2] ) {
                            push.apply( results, context.getElementsByTagName( selector ) );
                            return results;

                            // Speed-up: Sizzle(".CLASS")
                        } else if ( (m = match[3]) && support.getElementsByClassName ) {
                            push.apply( results, context.getElementsByClassName( m ) );
                            return results;
                        }
                    }

                    // QSA path
                    if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
                        nid = old = expando;
                        newContext = context;
                        newSelector = nodeType !== 1 && selector;

                        // qSA works strangely on Element-rooted queries
                        // We can work around this by specifying an extra ID on the root
                        // and working up from there (Thanks to Andrew Dupont for the technique)
                        // IE 8 doesn't work on object elements
                        if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                            groups = tokenize( selector );

                            if ( (old = context.getAttribute("id")) ) {
                                nid = old.replace( rescape, "\\$&" );
                            } else {
                                context.setAttribute( "id", nid );
                            }
                            nid = "[id='" + nid + "'] ";

                            i = groups.length;
                            while ( i-- ) {
                                groups[i] = nid + toSelector( groups[i] );
                            }
                            newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
                            newSelector = groups.join(",");
                        }

                        if ( newSelector ) {
                            try {
                                push.apply( results,
                                    newContext.querySelectorAll( newSelector )
                                );
                                return results;
                            } catch(qsaError) {
                            } finally {
                                if ( !old ) {
                                    context.removeAttribute("id");
                                }
                            }
                        }
                    }
                }

                // All others
                return select( selector.replace( rtrim, "$1" ), context, results, seed );
            }

            /**
             * Create key-value caches of limited size
             * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
             *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
             *  deleting the oldest entry
             */
            function createCache() {
                var keys = [];

                function cache( key, value ) {
                    // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                    if ( keys.push( key + " " ) > Expr.cacheLength ) {
                        // Only keep the most recent entries
                        delete cache[ keys.shift() ];
                    }
                    return (cache[ key + " " ] = value);
                }
                return cache;
            }

            /**
             * Mark a function for special use by Sizzle
             * @param {Function} fn The function to mark
             */
            function markFunction( fn ) {
                fn[ expando ] = true;
                return fn;
            }

            /**
             * Support testing using an element
             * @param {Function} fn Passed the created div and expects a boolean result
             */
            function assert( fn ) {
                var div = document.createElement("div");

                try {
                    return !!fn( div );
                } catch (e) {
                    return false;
                } finally {
                    // Remove from its parent by default
                    if ( div.parentNode ) {
                        div.parentNode.removeChild( div );
                    }
                    // release memory in IE
                    div = null;
                }
            }

            /**
             * Adds the same handler for all of the specified attrs
             * @param {String} attrs Pipe-separated list of attributes
             * @param {Function} handler The method that will be applied
             */
            function addHandle( attrs, handler ) {
                var arr = attrs.split("|"),
                    i = attrs.length;

                while ( i-- ) {
                    Expr.attrHandle[ arr[i] ] = handler;
                }
            }

            /**
             * Checks document order of two siblings
             * @param {Element} a
             * @param {Element} b
             * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
             */
            function siblingCheck( a, b ) {
                var cur = b && a,
                    diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                        ( ~b.sourceIndex || MAX_NEGATIVE ) -
                        ( ~a.sourceIndex || MAX_NEGATIVE );

                // Use IE sourceIndex if available on both nodes
                if ( diff ) {
                    return diff;
                }

                // Check if b follows a
                if ( cur ) {
                    while ( (cur = cur.nextSibling) ) {
                        if ( cur === b ) {
                            return -1;
                        }
                    }
                }

                return a ? 1 : -1;
            }

            /**
             * Returns a function to use in pseudos for input types
             * @param {String} type
             */
            function createInputPseudo( type ) {
                return function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === type;
                };
            }

            /**
             * Returns a function to use in pseudos for buttons
             * @param {String} type
             */
            function createButtonPseudo( type ) {
                return function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && elem.type === type;
                };
            }

            /**
             * Returns a function to use in pseudos for positionals
             * @param {Function} fn
             */
            function createPositionalPseudo( fn ) {
                return markFunction(function( argument ) {
                    argument = +argument;
                    return markFunction(function( seed, matches ) {
                        var j,
                            matchIndexes = fn( [], seed.length, argument ),
                            i = matchIndexes.length;

                        // Match elements found at the specified indexes
                        while ( i-- ) {
                            if ( seed[ (j = matchIndexes[i]) ] ) {
                                seed[j] = !(matches[j] = seed[j]);
                            }
                        }
                    });
                });
            }

            /**
             * Checks a node for validity as a Sizzle context
             * @param {Element|Object=} context
             * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
             */
            function testContext( context ) {
                return context && typeof context.getElementsByTagName !== "undefined" && context;
            }

// Expose support vars for convenience
            support = Sizzle.support = {};

            /**
             * Detects XML nodes
             * @param {Element|Object} elem An element or a document
             * @returns {Boolean} True iff elem is a non-HTML XML node
             */
            isXML = Sizzle.isXML = function( elem ) {
                // documentElement is verified for cases where it doesn't yet exist
                // (such as loading iframes in IE - #4833)
                var documentElement = elem && (elem.ownerDocument || elem).documentElement;
                return documentElement ? documentElement.nodeName !== "HTML" : false;
            };

            /**
             * Sets document-related variables once based on the current document
             * @param {Element|Object} [doc] An element or document object to use to set the document
             * @returns {Object} Returns the current document
             */
            setDocument = Sizzle.setDocument = function( node ) {
                var hasCompare, parent,
                    doc = node ? node.ownerDocument || node : preferredDoc;

                // If no document and documentElement is available, return
                if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
                    return document;
                }

                // Set our document
                document = doc;
                docElem = doc.documentElement;
                parent = doc.defaultView;

                // Support: IE>8
                // If iframe document is assigned to "document" variable and if iframe has been reloaded,
                // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
                // IE6-8 do not support the defaultView property so parent will be undefined
                if ( parent && parent !== parent.top ) {
                    // IE11 does not have attachEvent, so all must suffer
                    if ( parent.addEventListener ) {
                        parent.addEventListener( "unload", unloadHandler, false );
                    } else if ( parent.attachEvent ) {
                        parent.attachEvent( "onunload", unloadHandler );
                    }
                }

                /* Support tests
                 ---------------------------------------------------------------------- */
                documentIsHTML = !isXML( doc );

                /* Attributes
                 ---------------------------------------------------------------------- */

                // Support: IE<8
                // Verify that getAttribute really returns attributes and not properties
                // (excepting IE8 booleans)
                support.attributes = assert(function( div ) {
                    div.className = "i";
                    return !div.getAttribute("className");
                });

                /* getElement(s)By*
                 ---------------------------------------------------------------------- */

                // Check if getElementsByTagName("*") returns only elements
                support.getElementsByTagName = assert(function( div ) {
                    div.appendChild( doc.createComment("") );
                    return !div.getElementsByTagName("*").length;
                });

                // Support: IE<9
                support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

                // Support: IE<10
                // Check if getElementById returns elements by name
                // The broken getElementById methods don't pick up programatically-set names,
                // so use a roundabout getElementsByName test
                support.getById = assert(function( div ) {
                    docElem.appendChild( div ).id = expando;
                    return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
                });

                // ID find and filter
                if ( support.getById ) {
                    Expr.find["ID"] = function( id, context ) {
                        if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
                            var m = context.getElementById( id );
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            return m && m.parentNode ? [ m ] : [];
                        }
                    };
                    Expr.filter["ID"] = function( id ) {
                        var attrId = id.replace( runescape, funescape );
                        return function( elem ) {
                            return elem.getAttribute("id") === attrId;
                        };
                    };
                } else {
                    // Support: IE6/7
                    // getElementById is not reliable as a find shortcut
                    delete Expr.find["ID"];

                    Expr.filter["ID"] =  function( id ) {
                        var attrId = id.replace( runescape, funescape );
                        return function( elem ) {
                            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                            return node && node.value === attrId;
                        };
                    };
                }

                // Tag
                Expr.find["TAG"] = support.getElementsByTagName ?
                    function( tag, context ) {
                        if ( typeof context.getElementsByTagName !== "undefined" ) {
                            return context.getElementsByTagName( tag );

                            // DocumentFragment nodes don't have gEBTN
                        } else if ( support.qsa ) {
                            return context.querySelectorAll( tag );
                        }
                    } :

                    function( tag, context ) {
                        var elem,
                            tmp = [],
                            i = 0,
                        // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                            results = context.getElementsByTagName( tag );

                        // Filter out possible comments
                        if ( tag === "*" ) {
                            while ( (elem = results[i++]) ) {
                                if ( elem.nodeType === 1 ) {
                                    tmp.push( elem );
                                }
                            }

                            return tmp;
                        }
                        return results;
                    };

                // Class
                Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
                        if ( documentIsHTML ) {
                            return context.getElementsByClassName( className );
                        }
                    };

                /* QSA/matchesSelector
                 ---------------------------------------------------------------------- */

                // QSA and matchesSelector support

                // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
                rbuggyMatches = [];

                // qSa(:focus) reports false when true (Chrome 21)
                // We allow this because of a bug in IE8/9 that throws an error
                // whenever `document.activeElement` is accessed on an iframe
                // So, we allow :focus to pass through QSA all the time to avoid the IE error
                // See http://bugs.jquery.com/ticket/13378
                rbuggyQSA = [];

                if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
                    // Build QSA regex
                    // Regex strategy adopted from Diego Perini
                    assert(function( div ) {
                        // Select is set to empty string on purpose
                        // This is to test IE's treatment of not explicitly
                        // setting a boolean content attribute,
                        // since its presence should be enough
                        // http://bugs.jquery.com/ticket/12359
                        docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
                            "<select id='" + expando + "-\f]' msallowcapture=''>" +
                            "<option selected=''></option></select>";

                        // Support: IE8, Opera 11-12.16
                        // Nothing should be selected when empty strings follow ^= or $= or *=
                        // The test attribute must be unknown in Opera but "safe" for WinRT
                        // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                        if ( div.querySelectorAll("[msallowcapture^='']").length ) {
                            rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
                        }

                        // Support: IE8
                        // Boolean attributes and "value" are not treated correctly
                        if ( !div.querySelectorAll("[selected]").length ) {
                            rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
                        }

                        // Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
                        if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
                            rbuggyQSA.push("~=");
                        }

                        // Webkit/Opera - :checked should return selected option elements
                        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                        // IE8 throws error here and will not see later tests
                        if ( !div.querySelectorAll(":checked").length ) {
                            rbuggyQSA.push(":checked");
                        }

                        // Support: Safari 8+, iOS 8+
                        // https://bugs.webkit.org/show_bug.cgi?id=136851
                        // In-page `selector#id sibing-combinator selector` fails
                        if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
                            rbuggyQSA.push(".#.+[+~]");
                        }
                    });

                    assert(function( div ) {
                        // Support: Windows 8 Native Apps
                        // The type and name attributes are restricted during .innerHTML assignment
                        var input = doc.createElement("input");
                        input.setAttribute( "type", "hidden" );
                        div.appendChild( input ).setAttribute( "name", "D" );

                        // Support: IE8
                        // Enforce case-sensitivity of name attribute
                        if ( div.querySelectorAll("[name=d]").length ) {
                            rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
                        }

                        // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                        // IE8 throws error here and will not see later tests
                        if ( !div.querySelectorAll(":enabled").length ) {
                            rbuggyQSA.push( ":enabled", ":disabled" );
                        }

                        // Opera 10-11 does not throw on post-comma invalid pseudos
                        div.querySelectorAll("*,:x");
                        rbuggyQSA.push(",.*:");
                    });
                }

                if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
                        docElem.webkitMatchesSelector ||
                        docElem.mozMatchesSelector ||
                        docElem.oMatchesSelector ||
                        docElem.msMatchesSelector) )) ) {

                    assert(function( div ) {
                        // Check to see if it's possible to do matchesSelector
                        // on a disconnected node (IE 9)
                        support.disconnectedMatch = matches.call( div, "div" );

                        // This should fail with an exception
                        // Gecko does not error, returns false instead
                        matches.call( div, "[s!='']:x" );
                        rbuggyMatches.push( "!=", pseudos );
                    });
                }

                rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
                rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

                /* Contains
                 ---------------------------------------------------------------------- */
                hasCompare = rnative.test( docElem.compareDocumentPosition );

                // Element contains another
                // Purposefully does not implement inclusive descendent
                // As in, an element does not contain itself
                contains = hasCompare || rnative.test( docElem.contains ) ?
                    function( a, b ) {
                        var adown = a.nodeType === 9 ? a.documentElement : a,
                            bup = b && b.parentNode;
                        return a === bup || !!( bup && bup.nodeType === 1 && (
                                adown.contains ?
                                    adown.contains( bup ) :
                                a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
                            ));
                    } :
                    function( a, b ) {
                        if ( b ) {
                            while ( (b = b.parentNode) ) {
                                if ( b === a ) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                /* Sorting
                 ---------------------------------------------------------------------- */

                // Document order sorting
                sortOrder = hasCompare ?
                    function( a, b ) {

                        // Flag for duplicate removal
                        if ( a === b ) {
                            hasDuplicate = true;
                            return 0;
                        }

                        // Sort on method existence if only one input has compareDocumentPosition
                        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                        if ( compare ) {
                            return compare;
                        }

                        // Calculate position if both inputs belong to the same document
                        compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
                            a.compareDocumentPosition( b ) :

                            // Otherwise we know they are disconnected
                            1;

                        // Disconnected nodes
                        if ( compare & 1 ||
                            (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

                            // Choose the first element that is related to our preferred document
                            if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
                                return -1;
                            }
                            if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
                                return 1;
                            }

                            // Maintain original order
                            return sortInput ?
                                ( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
                                0;
                        }

                        return compare & 4 ? -1 : 1;
                    } :
                    function( a, b ) {
                        // Exit early if the nodes are identical
                        if ( a === b ) {
                            hasDuplicate = true;
                            return 0;
                        }

                        var cur,
                            i = 0,
                            aup = a.parentNode,
                            bup = b.parentNode,
                            ap = [ a ],
                            bp = [ b ];

                        // Parentless nodes are either documents or disconnected
                        if ( !aup || !bup ) {
                            return a === doc ? -1 :
                                b === doc ? 1 :
                                    aup ? -1 :
                                        bup ? 1 :
                                            sortInput ?
                                                ( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
                                                0;

                            // If the nodes are siblings, we can do a quick check
                        } else if ( aup === bup ) {
                            return siblingCheck( a, b );
                        }

                        // Otherwise we need full lists of their ancestors for comparison
                        cur = a;
                        while ( (cur = cur.parentNode) ) {
                            ap.unshift( cur );
                        }
                        cur = b;
                        while ( (cur = cur.parentNode) ) {
                            bp.unshift( cur );
                        }

                        // Walk down the tree looking for a discrepancy
                        while ( ap[i] === bp[i] ) {
                            i++;
                        }

                        return i ?
                            // Do a sibling check if the nodes have a common ancestor
                            siblingCheck( ap[i], bp[i] ) :

                            // Otherwise nodes in our document sort first
                            ap[i] === preferredDoc ? -1 :
                                bp[i] === preferredDoc ? 1 :
                                    0;
                    };

                return doc;
            };

            Sizzle.matches = function( expr, elements ) {
                return Sizzle( expr, null, null, elements );
            };

            Sizzle.matchesSelector = function( elem, expr ) {
                // Set document vars if needed
                if ( ( elem.ownerDocument || elem ) !== document ) {
                    setDocument( elem );
                }

                // Make sure that attribute selectors are quoted
                expr = expr.replace( rattributeQuotes, "='$1']" );

                if ( support.matchesSelector && documentIsHTML &&
                    ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
                    ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

                    try {
                        var ret = matches.call( elem, expr );

                        // IE 9's matchesSelector returns false on disconnected nodes
                        if ( ret || support.disconnectedMatch ||
                                // As well, disconnected nodes are said to be in a document
                                // fragment in IE 9
                            elem.document && elem.document.nodeType !== 11 ) {
                            return ret;
                        }
                    } catch (e) {}
                }

                return Sizzle( expr, document, null, [ elem ] ).length > 0;
            };

            Sizzle.contains = function( context, elem ) {
                // Set document vars if needed
                if ( ( context.ownerDocument || context ) !== document ) {
                    setDocument( context );
                }
                return contains( context, elem );
            };

            Sizzle.attr = function( elem, name ) {
                // Set document vars if needed
                if ( ( elem.ownerDocument || elem ) !== document ) {
                    setDocument( elem );
                }

                var fn = Expr.attrHandle[ name.toLowerCase() ],
                // Don't get fooled by Object.prototype properties (jQuery #13807)
                    val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
                        fn( elem, name, !documentIsHTML ) :
                        undefined;

                return val !== undefined ?
                    val :
                    support.attributes || !documentIsHTML ?
                        elem.getAttribute( name ) :
                        (val = elem.getAttributeNode(name)) && val.specified ?
                            val.value :
                            null;
            };

            Sizzle.error = function( msg ) {
                throw new Error( "Syntax error, unrecognized expression: " + msg );
            };

            /**
             * Document sorting and removing duplicates
             * @param {ArrayLike} results
             */
            Sizzle.uniqueSort = function( results ) {
                var elem,
                    duplicates = [],
                    j = 0,
                    i = 0;

                // Unless we *know* we can detect duplicates, assume their presence
                hasDuplicate = !support.detectDuplicates;
                sortInput = !support.sortStable && results.slice( 0 );
                results.sort( sortOrder );

                if ( hasDuplicate ) {
                    while ( (elem = results[i++]) ) {
                        if ( elem === results[ i ] ) {
                            j = duplicates.push( i );
                        }
                    }
                    while ( j-- ) {
                        results.splice( duplicates[ j ], 1 );
                    }
                }

                // Clear input after sorting to release objects
                // See https://github.com/jquery/sizzle/pull/225
                sortInput = null;

                return results;
            };

            /**
             * Utility function for retrieving the text value of an array of DOM nodes
             * @param {Array|Element} elem
             */
            getText = Sizzle.getText = function( elem ) {
                var node,
                    ret = "",
                    i = 0,
                    nodeType = elem.nodeType;

                if ( !nodeType ) {
                    // If no nodeType, this is expected to be an array
                    while ( (node = elem[i++]) ) {
                        // Do not traverse comment nodes
                        ret += getText( node );
                    }
                } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (jQuery #11153)
                    if ( typeof elem.textContent === "string" ) {
                        return elem.textContent;
                    } else {
                        // Traverse its children
                        for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                            ret += getText( elem );
                        }
                    }
                } else if ( nodeType === 3 || nodeType === 4 ) {
                    return elem.nodeValue;
                }
                // Do not include comment or processing instruction nodes

                return ret;
            };

            Expr = Sizzle.selectors = {

                // Can be adjusted by the user
                cacheLength: 50,

                createPseudo: markFunction,

                match: matchExpr,

                attrHandle: {},

                find: {},

                relative: {
                    ">": { dir: "parentNode", first: true },
                    " ": { dir: "parentNode" },
                    "+": { dir: "previousSibling", first: true },
                    "~": { dir: "previousSibling" }
                },

                preFilter: {
                    "ATTR": function( match ) {
                        match[1] = match[1].replace( runescape, funescape );

                        // Move the given value to match[3] whether quoted or unquoted
                        match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

                        if ( match[2] === "~=" ) {
                            match[3] = " " + match[3] + " ";
                        }

                        return match.slice( 0, 4 );
                    },

                    "CHILD": function( match ) {
                        /* matches from matchExpr["CHILD"]
                         1 type (only|nth|...)
                         2 what (child|of-type)
                         3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                         4 xn-component of xn+y argument ([+-]?\d*n|)
                         5 sign of xn-component
                         6 x of xn-component
                         7 sign of y-component
                         8 y of y-component
                         */
                        match[1] = match[1].toLowerCase();

                        if ( match[1].slice( 0, 3 ) === "nth" ) {
                            // nth-* requires argument
                            if ( !match[3] ) {
                                Sizzle.error( match[0] );
                            }

                            // numeric x and y parameters for Expr.filter.CHILD
                            // remember that false/true cast respectively to 0/1
                            match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                            match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

                            // other types prohibit arguments
                        } else if ( match[3] ) {
                            Sizzle.error( match[0] );
                        }

                        return match;
                    },

                    "PSEUDO": function( match ) {
                        var excess,
                            unquoted = !match[6] && match[2];

                        if ( matchExpr["CHILD"].test( match[0] ) ) {
                            return null;
                        }

                        // Accept quoted arguments as-is
                        if ( match[3] ) {
                            match[2] = match[4] || match[5] || "";

                            // Strip excess characters from unquoted arguments
                        } else if ( unquoted && rpseudo.test( unquoted ) &&
                                // Get excess from tokenize (recursively)
                            (excess = tokenize( unquoted, true )) &&
                                // advance to the next closing parenthesis
                            (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                            // excess is a negative index
                            match[0] = match[0].slice( 0, excess );
                            match[2] = unquoted.slice( 0, excess );
                        }

                        // Return only captures needed by the pseudo filter method (type and argument)
                        return match.slice( 0, 3 );
                    }
                },

                filter: {

                    "TAG": function( nodeNameSelector ) {
                        var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
                        return nodeNameSelector === "*" ?
                            function() { return true; } :
                            function( elem ) {
                                return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                            };
                    },

                    "CLASS": function( className ) {
                        var pattern = classCache[ className + " " ];

                        return pattern ||
                            (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                            classCache( className, function( elem ) {
                                return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
                            });
                    },

                    "ATTR": function( name, operator, check ) {
                        return function( elem ) {
                            var result = Sizzle.attr( elem, name );

                            if ( result == null ) {
                                return operator === "!=";
                            }
                            if ( !operator ) {
                                return true;
                            }

                            result += "";

                            return operator === "=" ? result === check :
                                operator === "!=" ? result !== check :
                                    operator === "^=" ? check && result.indexOf( check ) === 0 :
                                        operator === "*=" ? check && result.indexOf( check ) > -1 :
                                            operator === "$=" ? check && result.slice( -check.length ) === check :
                                                operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
                                                    operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                                                        false;
                        };
                    },

                    "CHILD": function( type, what, argument, first, last ) {
                        var simple = type.slice( 0, 3 ) !== "nth",
                            forward = type.slice( -4 ) !== "last",
                            ofType = what === "of-type";

                        return first === 1 && last === 0 ?

                            // Shortcut for :nth-*(n)
                            function( elem ) {
                                return !!elem.parentNode;
                            } :

                            function( elem, context, xml ) {
                                var cache, outerCache, node, diff, nodeIndex, start,
                                    dir = simple !== forward ? "nextSibling" : "previousSibling",
                                    parent = elem.parentNode,
                                    name = ofType && elem.nodeName.toLowerCase(),
                                    useCache = !xml && !ofType;

                                if ( parent ) {

                                    // :(first|last|only)-(child|of-type)
                                    if ( simple ) {
                                        while ( dir ) {
                                            node = elem;
                                            while ( (node = node[ dir ]) ) {
                                                if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                                                    return false;
                                                }
                                            }
                                            // Reverse direction for :only-* (if we haven't yet done so)
                                            start = dir = type === "only" && !start && "nextSibling";
                                        }
                                        return true;
                                    }

                                    start = [ forward ? parent.firstChild : parent.lastChild ];

                                    // non-xml :nth-child(...) stores cache data on `parent`
                                    if ( forward && useCache ) {
                                        // Seek `elem` from a previously-cached index
                                        outerCache = parent[ expando ] || (parent[ expando ] = {});
                                        cache = outerCache[ type ] || [];
                                        nodeIndex = cache[0] === dirruns && cache[1];
                                        diff = cache[0] === dirruns && cache[2];
                                        node = nodeIndex && parent.childNodes[ nodeIndex ];

                                        while ( (node = ++nodeIndex && node && node[ dir ] ||

                                                // Fallback to seeking `elem` from the start
                                            (diff = nodeIndex = 0) || start.pop()) ) {

                                            // When found, cache indexes on `parent` and break
                                            if ( node.nodeType === 1 && ++diff && node === elem ) {
                                                outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                                                break;
                                            }
                                        }

                                        // Use previously-cached element index if available
                                    } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
                                        diff = cache[1];

                                        // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                    } else {
                                        // Use the same loop as above to seek `elem` from the start
                                        while ( (node = ++nodeIndex && node && node[ dir ] ||
                                            (diff = nodeIndex = 0) || start.pop()) ) {

                                            if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                                                // Cache the index of each encountered element
                                                if ( useCache ) {
                                                    (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                                                }

                                                if ( node === elem ) {
                                                    break;
                                                }
                                            }
                                        }
                                    }

                                    // Incorporate the offset, then check against cycle size
                                    diff -= last;
                                    return diff === first || ( diff % first === 0 && diff / first >= 0 );
                                }
                            };
                    },

                    "PSEUDO": function( pseudo, argument ) {
                        // pseudo-class names are case-insensitive
                        // http://www.w3.org/TR/selectors/#pseudo-classes
                        // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                        // Remember that setFilters inherits from pseudos
                        var args,
                            fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                                Sizzle.error( "unsupported pseudo: " + pseudo );

                        // The user may use createPseudo to indicate that
                        // arguments are needed to create the filter function
                        // just as Sizzle does
                        if ( fn[ expando ] ) {
                            return fn( argument );
                        }

                        // But maintain support for old signatures
                        if ( fn.length > 1 ) {
                            args = [ pseudo, pseudo, "", argument ];
                            return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                                markFunction(function( seed, matches ) {
                                    var idx,
                                        matched = fn( seed, argument ),
                                        i = matched.length;
                                    while ( i-- ) {
                                        idx = indexOf( seed, matched[i] );
                                        seed[ idx ] = !( matches[ idx ] = matched[i] );
                                    }
                                }) :
                                function( elem ) {
                                    return fn( elem, 0, args );
                                };
                        }

                        return fn;
                    }
                },

                pseudos: {
                    // Potentially complex pseudos
                    "not": markFunction(function( selector ) {
                        // Trim the selector passed to compile
                        // to avoid treating leading and trailing
                        // spaces as combinators
                        var input = [],
                            results = [],
                            matcher = compile( selector.replace( rtrim, "$1" ) );

                        return matcher[ expando ] ?
                            markFunction(function( seed, matches, context, xml ) {
                                var elem,
                                    unmatched = matcher( seed, null, xml, [] ),
                                    i = seed.length;

                                // Match elements unmatched by `matcher`
                                while ( i-- ) {
                                    if ( (elem = unmatched[i]) ) {
                                        seed[i] = !(matches[i] = elem);
                                    }
                                }
                            }) :
                            function( elem, context, xml ) {
                                input[0] = elem;
                                matcher( input, null, xml, results );
                                // Don't keep the element (issue #299)
                                input[0] = null;
                                return !results.pop();
                            };
                    }),

                    "has": markFunction(function( selector ) {
                        return function( elem ) {
                            return Sizzle( selector, elem ).length > 0;
                        };
                    }),

                    "contains": markFunction(function( text ) {
                        text = text.replace( runescape, funescape );
                        return function( elem ) {
                            return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
                        };
                    }),

                    // "Whether an element is represented by a :lang() selector
                    // is based solely on the element's language value
                    // being equal to the identifier C,
                    // or beginning with the identifier C immediately followed by "-".
                    // The matching of C against the element's language value is performed case-insensitively.
                    // The identifier C does not have to be a valid language name."
                    // http://www.w3.org/TR/selectors/#lang-pseudo
                    "lang": markFunction( function( lang ) {
                        // lang value must be a valid identifier
                        if ( !ridentifier.test(lang || "") ) {
                            Sizzle.error( "unsupported lang: " + lang );
                        }
                        lang = lang.replace( runescape, funescape ).toLowerCase();
                        return function( elem ) {
                            var elemLang;
                            do {
                                if ( (elemLang = documentIsHTML ?
                                        elem.lang :
                                    elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

                                    elemLang = elemLang.toLowerCase();
                                    return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                                }
                            } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                            return false;
                        };
                    }),

                    // Miscellaneous
                    "target": function( elem ) {
                        var hash = window.location && window.location.hash;
                        return hash && hash.slice( 1 ) === elem.id;
                    },

                    "root": function( elem ) {
                        return elem === docElem;
                    },

                    "focus": function( elem ) {
                        return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                    },

                    // Boolean properties
                    "enabled": function( elem ) {
                        return elem.disabled === false;
                    },

                    "disabled": function( elem ) {
                        return elem.disabled === true;
                    },

                    "checked": function( elem ) {
                        // In CSS3, :checked should return both checked and selected elements
                        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                        var nodeName = elem.nodeName.toLowerCase();
                        return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                    },

                    "selected": function( elem ) {
                        // Accessing this property makes selected-by-default
                        // options in Safari work properly
                        if ( elem.parentNode ) {
                            elem.parentNode.selectedIndex;
                        }

                        return elem.selected === true;
                    },

                    // Contents
                    "empty": function( elem ) {
                        // http://www.w3.org/TR/selectors/#empty-pseudo
                        // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                        //   but not by others (comment: 8; processing instruction: 7; etc.)
                        // nodeType < 6 works because attributes (2) do not appear as children
                        for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                            if ( elem.nodeType < 6 ) {
                                return false;
                            }
                        }
                        return true;
                    },

                    "parent": function( elem ) {
                        return !Expr.pseudos["empty"]( elem );
                    },

                    // Element/input types
                    "header": function( elem ) {
                        return rheader.test( elem.nodeName );
                    },

                    "input": function( elem ) {
                        return rinputs.test( elem.nodeName );
                    },

                    "button": function( elem ) {
                        var name = elem.nodeName.toLowerCase();
                        return name === "input" && elem.type === "button" || name === "button";
                    },

                    "text": function( elem ) {
                        var attr;
                        return elem.nodeName.toLowerCase() === "input" &&
                            elem.type === "text" &&

                                // Support: IE<8
                                // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                            ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
                    },

                    // Position-in-collection
                    "first": createPositionalPseudo(function() {
                        return [ 0 ];
                    }),

                    "last": createPositionalPseudo(function( matchIndexes, length ) {
                        return [ length - 1 ];
                    }),

                    "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        return [ argument < 0 ? argument + length : argument ];
                    }),

                    "even": createPositionalPseudo(function( matchIndexes, length ) {
                        var i = 0;
                        for ( ; i < length; i += 2 ) {
                            matchIndexes.push( i );
                        }
                        return matchIndexes;
                    }),

                    "odd": createPositionalPseudo(function( matchIndexes, length ) {
                        var i = 1;
                        for ( ; i < length; i += 2 ) {
                            matchIndexes.push( i );
                        }
                        return matchIndexes;
                    }),

                    "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        var i = argument < 0 ? argument + length : argument;
                        for ( ; --i >= 0; ) {
                            matchIndexes.push( i );
                        }
                        return matchIndexes;
                    }),

                    "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        var i = argument < 0 ? argument + length : argument;
                        for ( ; ++i < length; ) {
                            matchIndexes.push( i );
                        }
                        return matchIndexes;
                    })
                }
            };

            Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
            for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
                Expr.pseudos[ i ] = createInputPseudo( i );
            }
            for ( i in { submit: true, reset: true } ) {
                Expr.pseudos[ i ] = createButtonPseudo( i );
            }

// Easy API for creating new setFilters
            function setFilters() {}
            setFilters.prototype = Expr.filters = Expr.pseudos;
            Expr.setFilters = new setFilters();

            tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
                var matched, match, tokens, type,
                    soFar, groups, preFilters,
                    cached = tokenCache[ selector + " " ];

                if ( cached ) {
                    return parseOnly ? 0 : cached.slice( 0 );
                }

                soFar = selector;
                groups = [];
                preFilters = Expr.preFilter;

                while ( soFar ) {

                    // Comma and first run
                    if ( !matched || (match = rcomma.exec( soFar )) ) {
                        if ( match ) {
                            // Don't consume trailing commas as valid
                            soFar = soFar.slice( match[0].length ) || soFar;
                        }
                        groups.push( (tokens = []) );
                    }

                    matched = false;

                    // Combinators
                    if ( (match = rcombinators.exec( soFar )) ) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            // Cast descendant combinators to space
                            type: match[0].replace( rtrim, " " )
                        });
                        soFar = soFar.slice( matched.length );
                    }

                    // Filters
                    for ( type in Expr.filter ) {
                        if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                            (match = preFilters[ type ]( match ))) ) {
                            matched = match.shift();
                            tokens.push({
                                value: matched,
                                type: type,
                                matches: match
                            });
                            soFar = soFar.slice( matched.length );
                        }
                    }

                    if ( !matched ) {
                        break;
                    }
                }

                // Return the length of the invalid excess
                // if we're just parsing
                // Otherwise, throw an error or return tokens
                return parseOnly ?
                    soFar.length :
                    soFar ?
                        Sizzle.error( selector ) :
                        // Cache the tokens
                        tokenCache( selector, groups ).slice( 0 );
            };

            function toSelector( tokens ) {
                var i = 0,
                    len = tokens.length,
                    selector = "";
                for ( ; i < len; i++ ) {
                    selector += tokens[i].value;
                }
                return selector;
            }

            function addCombinator( matcher, combinator, base ) {
                var dir = combinator.dir,
                    checkNonElements = base && dir === "parentNode",
                    doneName = done++;

                return combinator.first ?
                    // Check against closest ancestor/preceding element
                    function( elem, context, xml ) {
                        while ( (elem = elem[ dir ]) ) {
                            if ( elem.nodeType === 1 || checkNonElements ) {
                                return matcher( elem, context, xml );
                            }
                        }
                    } :

                    // Check against all ancestor/preceding elements
                    function( elem, context, xml ) {
                        var oldCache, outerCache,
                            newCache = [ dirruns, doneName ];

                        // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                        if ( xml ) {
                            while ( (elem = elem[ dir ]) ) {
                                if ( elem.nodeType === 1 || checkNonElements ) {
                                    if ( matcher( elem, context, xml ) ) {
                                        return true;
                                    }
                                }
                            }
                        } else {
                            while ( (elem = elem[ dir ]) ) {
                                if ( elem.nodeType === 1 || checkNonElements ) {
                                    outerCache = elem[ expando ] || (elem[ expando ] = {});
                                    if ( (oldCache = outerCache[ dir ]) &&
                                        oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

                                        // Assign to newCache so results back-propagate to previous elements
                                        return (newCache[ 2 ] = oldCache[ 2 ]);
                                    } else {
                                        // Reuse newcache so results back-propagate to previous elements
                                        outerCache[ dir ] = newCache;

                                        // A match means we're done; a fail means we have to keep checking
                                        if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    };
            }

            function elementMatcher( matchers ) {
                return matchers.length > 1 ?
                    function( elem, context, xml ) {
                        var i = matchers.length;
                        while ( i-- ) {
                            if ( !matchers[i]( elem, context, xml ) ) {
                                return false;
                            }
                        }
                        return true;
                    } :
                    matchers[0];
            }

            function multipleContexts( selector, contexts, results ) {
                var i = 0,
                    len = contexts.length;
                for ( ; i < len; i++ ) {
                    Sizzle( selector, contexts[i], results );
                }
                return results;
            }

            function condense( unmatched, map, filter, context, xml ) {
                var elem,
                    newUnmatched = [],
                    i = 0,
                    len = unmatched.length,
                    mapped = map != null;

                for ( ; i < len; i++ ) {
                    if ( (elem = unmatched[i]) ) {
                        if ( !filter || filter( elem, context, xml ) ) {
                            newUnmatched.push( elem );
                            if ( mapped ) {
                                map.push( i );
                            }
                        }
                    }
                }

                return newUnmatched;
            }

            function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
                if ( postFilter && !postFilter[ expando ] ) {
                    postFilter = setMatcher( postFilter );
                }
                if ( postFinder && !postFinder[ expando ] ) {
                    postFinder = setMatcher( postFinder, postSelector );
                }
                return markFunction(function( seed, results, context, xml ) {
                    var temp, i, elem,
                        preMap = [],
                        postMap = [],
                        preexisting = results.length,

                    // Get initial elements from seed or context
                        elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

                    // Prefilter to get matcher input, preserving a map for seed-results synchronization
                        matcherIn = preFilter && ( seed || !selector ) ?
                            condense( elems, preMap, preFilter, context, xml ) :
                            elems,

                        matcherOut = matcher ?
                            // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                            postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                                // ...intermediate processing is necessary
                                [] :

                                // ...otherwise use results directly
                                results :
                            matcherIn;

                    // Find primary matches
                    if ( matcher ) {
                        matcher( matcherIn, matcherOut, context, xml );
                    }

                    // Apply postFilter
                    if ( postFilter ) {
                        temp = condense( matcherOut, postMap );
                        postFilter( temp, [], context, xml );

                        // Un-match failing elements by moving them back to matcherIn
                        i = temp.length;
                        while ( i-- ) {
                            if ( (elem = temp[i]) ) {
                                matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                            }
                        }
                    }

                    if ( seed ) {
                        if ( postFinder || preFilter ) {
                            if ( postFinder ) {
                                // Get the final matcherOut by condensing this intermediate into postFinder contexts
                                temp = [];
                                i = matcherOut.length;
                                while ( i-- ) {
                                    if ( (elem = matcherOut[i]) ) {
                                        // Restore matcherIn since elem is not yet a final match
                                        temp.push( (matcherIn[i] = elem) );
                                    }
                                }
                                postFinder( null, (matcherOut = []), temp, xml );
                            }

                            // Move matched elements from seed to results to keep them synchronized
                            i = matcherOut.length;
                            while ( i-- ) {
                                if ( (elem = matcherOut[i]) &&
                                    (temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

                                    seed[temp] = !(results[temp] = elem);
                                }
                            }
                        }

                        // Add elements to results, through postFinder if defined
                    } else {
                        matcherOut = condense(
                            matcherOut === results ?
                                matcherOut.splice( preexisting, matcherOut.length ) :
                                matcherOut
                        );
                        if ( postFinder ) {
                            postFinder( null, results, matcherOut, xml );
                        } else {
                            push.apply( results, matcherOut );
                        }
                    }
                });
            }

            function matcherFromTokens( tokens ) {
                var checkContext, matcher, j,
                    len = tokens.length,
                    leadingRelative = Expr.relative[ tokens[0].type ],
                    implicitRelative = leadingRelative || Expr.relative[" "],
                    i = leadingRelative ? 1 : 0,

                // The foundational matcher ensures that elements are reachable from top-level context(s)
                    matchContext = addCombinator( function( elem ) {
                        return elem === checkContext;
                    }, implicitRelative, true ),
                    matchAnyContext = addCombinator( function( elem ) {
                        return indexOf( checkContext, elem ) > -1;
                    }, implicitRelative, true ),
                    matchers = [ function( elem, context, xml ) {
                        var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                                (checkContext = context).nodeType ?
                                    matchContext( elem, context, xml ) :
                                    matchAnyContext( elem, context, xml ) );
                        // Avoid hanging onto element (issue #299)
                        checkContext = null;
                        return ret;
                    } ];

                for ( ; i < len; i++ ) {
                    if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                        matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
                    } else {
                        matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

                        // Return special upon seeing a positional matcher
                        if ( matcher[ expando ] ) {
                            // Find the next relative operator (if any) for proper handling
                            j = ++i;
                            for ( ; j < len; j++ ) {
                                if ( Expr.relative[ tokens[j].type ] ) {
                                    break;
                                }
                            }
                            return setMatcher(
                                i > 1 && elementMatcher( matchers ),
                                i > 1 && toSelector(
                                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                                    tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
                                ).replace( rtrim, "$1" ),
                                matcher,
                                i < j && matcherFromTokens( tokens.slice( i, j ) ),
                                j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                                j < len && toSelector( tokens )
                            );
                        }
                        matchers.push( matcher );
                    }
                }

                return elementMatcher( matchers );
            }

            function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
                var bySet = setMatchers.length > 0,
                    byElement = elementMatchers.length > 0,
                    superMatcher = function( seed, context, xml, results, outermost ) {
                        var elem, j, matcher,
                            matchedCount = 0,
                            i = "0",
                            unmatched = seed && [],
                            setMatched = [],
                            contextBackup = outermostContext,
                        // We must always have either seed elements or outermost context
                            elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
                        // Use integer dirruns iff this is the outermost matcher
                            dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                            len = elems.length;

                        if ( outermost ) {
                            outermostContext = context !== document && context;
                        }

                        // Add elements passing elementMatchers directly to results
                        // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                        // Support: IE<9, Safari
                        // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                        for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
                            if ( byElement && elem ) {
                                j = 0;
                                while ( (matcher = elementMatchers[j++]) ) {
                                    if ( matcher( elem, context, xml ) ) {
                                        results.push( elem );
                                        break;
                                    }
                                }
                                if ( outermost ) {
                                    dirruns = dirrunsUnique;
                                }
                            }

                            // Track unmatched elements for set filters
                            if ( bySet ) {
                                // They will have gone through all possible matchers
                                if ( (elem = !matcher && elem) ) {
                                    matchedCount--;
                                }

                                // Lengthen the array for every element, matched or not
                                if ( seed ) {
                                    unmatched.push( elem );
                                }
                            }
                        }

                        // Apply set filters to unmatched elements
                        matchedCount += i;
                        if ( bySet && i !== matchedCount ) {
                            j = 0;
                            while ( (matcher = setMatchers[j++]) ) {
                                matcher( unmatched, setMatched, context, xml );
                            }

                            if ( seed ) {
                                // Reintegrate element matches to eliminate the need for sorting
                                if ( matchedCount > 0 ) {
                                    while ( i-- ) {
                                        if ( !(unmatched[i] || setMatched[i]) ) {
                                            setMatched[i] = pop.call( results );
                                        }
                                    }
                                }

                                // Discard index placeholder values to get only actual matches
                                setMatched = condense( setMatched );
                            }

                            // Add matches to results
                            push.apply( results, setMatched );

                            // Seedless set matches succeeding multiple successful matchers stipulate sorting
                            if ( outermost && !seed && setMatched.length > 0 &&
                                ( matchedCount + setMatchers.length ) > 1 ) {

                                Sizzle.uniqueSort( results );
                            }
                        }

                        // Override manipulation of globals by nested matchers
                        if ( outermost ) {
                            dirruns = dirrunsUnique;
                            outermostContext = contextBackup;
                        }

                        return unmatched;
                    };

                return bySet ?
                    markFunction( superMatcher ) :
                    superMatcher;
            }

            compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
                var i,
                    setMatchers = [],
                    elementMatchers = [],
                    cached = compilerCache[ selector + " " ];

                if ( !cached ) {
                    // Generate a function of recursive functions that can be used to check each element
                    if ( !match ) {
                        match = tokenize( selector );
                    }
                    i = match.length;
                    while ( i-- ) {
                        cached = matcherFromTokens( match[i] );
                        if ( cached[ expando ] ) {
                            setMatchers.push( cached );
                        } else {
                            elementMatchers.push( cached );
                        }
                    }

                    // Cache the compiled function
                    cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

                    // Save selector and tokenization
                    cached.selector = selector;
                }
                return cached;
            };

            /**
             * A low-level selection function that works with Sizzle's compiled
             *  selector functions
             * @param {String|Function} selector A selector or a pre-compiled
             *  selector function built with Sizzle.compile
             * @param {Element} context
             * @param {Array} [results]
             * @param {Array} [seed] A set of elements to match against
             */
            select = Sizzle.select = function( selector, context, results, seed ) {
                var i, tokens, token, type, find,
                    compiled = typeof selector === "function" && selector,
                    match = !seed && tokenize( (selector = compiled.selector || selector) );

                results = results || [];

                // Try to minimize operations if there is no seed and only one group
                if ( match.length === 1 ) {

                    // Take a shortcut and set the context if the root selector is an ID
                    tokens = match[0] = match[0].slice( 0 );
                    if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        support.getById && context.nodeType === 9 && documentIsHTML &&
                        Expr.relative[ tokens[1].type ] ) {

                        context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
                        if ( !context ) {
                            return results;

                            // Precompiled matchers will still verify ancestry, so step up a level
                        } else if ( compiled ) {
                            context = context.parentNode;
                        }

                        selector = selector.slice( tokens.shift().value.length );
                    }

                    // Fetch a seed set for right-to-left matching
                    i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
                    while ( i-- ) {
                        token = tokens[i];

                        // Abort if we hit a combinator
                        if ( Expr.relative[ (type = token.type) ] ) {
                            break;
                        }
                        if ( (find = Expr.find[ type ]) ) {
                            // Search, expanding context for leading sibling combinators
                            if ( (seed = find(
                                    token.matches[0].replace( runescape, funescape ),
                                    rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
                                )) ) {

                                // If seed is empty or no tokens remain, we can return early
                                tokens.splice( i, 1 );
                                selector = seed.length && toSelector( tokens );
                                if ( !selector ) {
                                    push.apply( results, seed );
                                    return results;
                                }

                                break;
                            }
                        }
                    }
                }

                // Compile and execute a filtering function if one is not provided
                // Provide `match` to avoid retokenization if we modified the selector above
                ( compiled || compile( selector, match ) )(
                    seed,
                    context,
                    !documentIsHTML,
                    results,
                    rsibling.test( selector ) && testContext( context.parentNode ) || context
                );
                return results;
            };

// One-time assignments

// Sort stability
            support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
            support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
            setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
            support.sortDetached = assert(function( div1 ) {
                // Should return 1, but returns 4 (following)
                return div1.compareDocumentPosition( document.createElement("div") ) & 1;
            });

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
            if ( !assert(function( div ) {
                    div.innerHTML = "<a href='#'></a>";
                    return div.firstChild.getAttribute("href") === "#" ;
                }) ) {
                addHandle( "type|href|height|width", function( elem, name, isXML ) {
                    if ( !isXML ) {
                        return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
                    }
                });
            }

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
            if ( !support.attributes || !assert(function( div ) {
                    div.innerHTML = "<input/>";
                    div.firstChild.setAttribute( "value", "" );
                    return div.firstChild.getAttribute( "value" ) === "";
                }) ) {
                addHandle( "value", function( elem, name, isXML ) {
                    if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
                        return elem.defaultValue;
                    }
                });
            }

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
            if ( !assert(function( div ) {
                    return div.getAttribute("disabled") == null;
                }) ) {
                addHandle( booleans, function( elem, name, isXML ) {
                    var val;
                    if ( !isXML ) {
                        return elem[ name ] === true ? name.toLowerCase() :
                            (val = elem.getAttributeNode( name )) && val.specified ?
                                val.value :
                                null;
                    }
                });
            }

            return Sizzle;

        })( window );



    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;

    var rnotwhite = (/\S+/g);
    // 用来存储options缓存数据
    var optionsCache = {};

    // 创建参数缓存
    function createOptions(options) {
        // 例如options = "once"
        // object = optionsCache["once"] = {}
        var object = optionsCache[options] = {};

        // 通过正则用空白符分割参数
        jQuery.each(options.match(rnotwhite) || [], function(_, flag) {
            // 由于object指向optionsCache["once"]的引用
            // 可以通过修改object来改变对象optionsCache["once"]
            // 现在object["once"] = true 即 optionsCache["once"] = {once: true}
            object[flag] = true;
        });

        // 返回object 即 {once: true}
        return object;
    }

    jQuery.Callbacks = function(options) {
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
            // 只有options包含once时才返回false，否则返回[]
            stack = !options.once && [],

            fire = function(data) {
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

                if (list) {
                    if (stack) {
                        // 不包含once
                    } else if (memory) {
                        // 包含memory时（同时可能包含once）
                        list = [];
                    } else {
                        // 包含once 但不包含memory
                        self.disable();
                    }
                }
            },

            self = {
                add: function() {
                    // list数组为空也返回true
                    // 只有调用了disable()使list = undefined才返回false
                    if (list) {
                        var start = list.length;

                        // 这是一个函数名为add的闭包函数
                        (function add(args) {
                            jQuery.each(args, function(_, arg) {
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
                    return this;
                },

                fireWith: function(context, args) {
                    if (list) {
                        args = args || [];
                        // args数组第一个元素保存上下文，第二个元素保存一个参数数组
                        args = [context, args.slice ? args.slice() : args];
                        // 调用内部函数fire
                        fire(args);
                    }
                    return this;
                },

                fire: function() {
                    // this是当前jQuery.Callbacks()对象
                    self.fireWith(this, arguments);
                    return this;
                },

                disable: function() {
                    // list = undefined 不能被add和fire
                    list = memory = undefined;
                    return this;
                },

                has: function(fn) {
                    return fn ?
                        // fn在list中inArray返回索引值(>-1) 结果返回true
                        // 如果fn不在list中inArray返回-1 结果返回false
                        jQuery.inArray(fn, list) > -1 :

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
            get: function() {
                return {};
            }
        });

        this.expando = jQuery.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.accepts = function(owner) {
        // 1. Node.ELEMENT_NODE
        // 2. Node.DOCUMENT_NODE
        // 3. 任何类型
        return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
    };

    Data.prototype = {
        key: function(owner) {
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
                    descriptor[this.expando] = {
                        value: unlock
                    };
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
        get: function(owner, key) {
            var cache = this.cache[this.key(owner)];
            return key === undefined ?
                // 如果key为空返回owner所有缓存数据
                // 否则返回指定key的缓存数据
                cache : cache[key];
        },
        set: function(owner, data, value) {
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
        access: function(owner, key, value) {
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
        remove: function(owner, key) {
            var i,
                name, //存储缓存key的一个数组[key1, key2...]
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
        hasData: function(owner) {
            // 通过判断缓存对象是否为空来判断
            return !jQuery.isEmptyObject(
                this.cache[owner[this.expando]] || {}
            );
        }
    };

    var data_user = new Data();

    // 数据缓存相关静态函数
    jQuery.extend({
        hasData: function(elem) {
            return data_user.hasData(elem);
        },

        data: function(elem, name, data) {
            return data_user.access(elem, name, data);
        },

        removeData: function(elem, name) {
            data_user.remove(elem, name);
        }
    });

    // 数据缓存相关实例方法
    jQuery.fn.extend({
        data: function(key, value) {
            var data,
                elem = this[0];

            // 获取所有的值
            if (key === undefined) {
                if (this.length) {
                    data = data_user.get(elem);
                }
                return data;
            }

            // key = {key1: val1, key2: val2, ...}设置多个值
            if (typeof key === "object") {
                // 遍历当前jQuery对象的dom数组，给每个dom对象设置缓存数据
                // 使用return遍历后直接返回。不会进入access.
                return this.each(function() {
                    // 这里this为每个匹配的dom对象
                    data_user.set(this, key);
                });
            }

            // 根据参数的不同进行set或get
            return access(this, function(value) {
                var data;

                // get, fn返回get的值，并通过access返回。
                if (elem && value === undefined) {
                    // 这里仅需取得第一个dom对象中的缓存内容即可
                    data = data_user.get(elem, key);
                    if (data !== undefined) {
                        return data;
                    }
                    return;
                }

                // set，通过each方法给每个dom对象设置缓存，缓存内容完全相同。
                this.each(function() {
                    data_user.set(this, key, value);
                });
            }, null, value, arguments.length > 1, null, true);
        },

        removeData: function(key) {
            return this.each(function() {
                data_user.remove(this, key);
            });
        }
    });

    var access = jQuery.access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var len = elems.length,
            bulk = key == null;

        // 设置多个值
        if (jQuery.type(key) === "object") {

            // value存在(或者为空值)，只设置一个值
        } else if (value !== undefined) {
            chainable = true;

            if (!jQuery.isFunction(value)) {
                raw = true;
            }

            if (bulk) {
                if (raw) {
                    // set时，fn只接受一个参数
                    fn.call(elems, value);
                    fn = null;
                }
            }
        }

        // set时chainable为true
        return chainable ?
            // set 返回jQuery对象
            elems :

            // get
            bulk ?
            // 通过fn返回get的值
            fn.call(elems) :
            len ? fn(elems[0], key) : emptyGet;

    };

    jQuery.extend({
        Deferred: function(func) {
            var tuples = [
                    ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", jQuery.Callbacks("memory")]
                ],
                // 局部变量state标识状态，默认为pending
                state = "pending",
                promise = {
                    state: function() {
                        return state;
                    },
                    always: function() {
                        deferred.done(arguments).fail(arguments);
                        return this;
                    },
                    then: function( /* fnDone, fnFail, fnProgress */ ) {
                        // fns = [fnDone, fnFail, fnProgress]
                        var fns = arguments;
                        // 通过jQuery.Deferred()返回一个新的promise对象，参数newDefer为这个新的deferred对象
                        return jQuery.Deferred(function(newDefer) {
                            // this === newDefer
                            jQuery.each(tuples, function(i, tuple) {
                                // fn = fnDone | fnFail | fnProgress
                                var fn = jQuery.isFunction(fns[i]) && fns[i];

                                // deferred.done(fnDone) | deferred.fail(fnFail) | deferred.progress(fnProgress)
                                deferred[tuple[1]](function() {
                                    // this === promise
                                    var returned = fn && fn.apply(this, arguments);
                                    if (returned && jQuery.isFunction(returned.promise)) {

                                    } else {
                                        // 上下文为新deferred对象的promise对象
                                        var context = this === promise ? newDefer.promise() : this,
                                            // apply参数为returned数组
                                            args = fn ? [returned] : arguments;
                                        // newDefer[ resolve | reject | notify ]
                                        newDefer[tuple[0] + "With"](context, args);
                                    }
                                });
                            });
                        }).promise();
                    },
                    // 如果参数为空返回promise对象
                    // 如果obj不为空会把obj合并到deferred对象，并返回这个新的对象
                    promise: function(obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                },
                deferred = {};

            jQuery.each(tuples, function(i, tuple) {
                // list = jQuery.Callbacks()
                var list = tuple[2],
                    // resolved | rejected | undefined
                    stateString = tuple[3];

                // promise[ done | fail | progress ] = jQuery.Callbacks.add
                promise[tuple[1]] = list.add;

                // 当resolved,rejected两种状态时，往jQuery.Callbacks对象添加回调函数
                if (stateString) {
                    // 当resolve，reject触发时，会调用回调函数改变状态
                    list.add(function() {
                        state = stateString;
                    });
                }

                // deferred[ resolve | reject | notify ]
                deferred[tuple[0]] = function() {
                    // 通过调用fireWith来间接调用fire
                    // 当调用对象为deferred对象时，回调函数内的上下文对象设置为promise对象
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                    return this;
                };

                // deferred[ resolveWith | rejectWith | notifyWith ] = jQuery.Callbacks.fireWith
                deferred[tuple[0] + "With"] = list.fireWith;
            });

            // 把promise对象的属性合并到deferred对象上
            promise.promise(deferred);

            if (func) {
                // 如果func存在会调用函数，并且把deferred作为参数传给func
                func.call(deferred, deferred);
            }

            return deferred;
        },

        when: function(subordinate) {
            var i = 0,
                resolveValues = slice.call(arguments),
                length = resolveValues.length,

                // 如果参数个数不为1直接返回length
                remaining = length !== 1 ||
                    // 参数个数为一个时，如果参数对象为deferred对象时返回1，否则返回0
                    subordinate && jQuery.isFunction(subordinate.promise) ? length : 0,

                // the master Deferred 如果仅有一个deferred对象指向这个deferred对象，否则创建一个新的deferred对象
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

                updateFunc = function(i, values) {
                    return function(value) {
                        values[i] = arguments.length > 1 ? slice.call(arguments) : value;
                        if (!(--remaining)) {
                            deferred.resolveWith(null, values);
                        }
                    };
                },

                resolveContexts;

            // 多个参数时
            if (length > 1) {
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    // 检查每个对象是否是Deferred对象
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {

                        resolveValues[i].promise()
                            .done(updateFunc(i, resolveValues))
                            .fail(deferred.reject);

                    } else {
                        --remaining;
                    }
                }
            }

            // 参数不为Deferred对象时，由于不是deferred对象，不需要等待被触发。
            if (!remaining) {
                // 这个deferred为内部新创建的master deferred
                // resolve the master，resolve的参数为$.when的参数
                deferred.resolveWith(resolveContexts, resolveValues);
            }

            return deferred.promise();
        }
    });

    jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }

        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented;
        } else {
            this.type = src;
        }

        if (props) {
            jQuery.extend(this, props);
        }

        this.timeStamp = src && src.timeStamp || jQuery.now();
        this[jQuery.expando] = true;
    };

    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,

        preventDefault: function() {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;

            if (e && e.preventDefault) {
                e.preventDefault();
            }
        },

        stopPropagation: function() {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;

            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
        },

        stopImmediatePropagation: function() {
            var e = this.originalEvent;

            this.isImmediatePropagationStopped = returnTrue;

            if (e && e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }

            e.stopPropagation();
        }
    };

    var eventCache = {};

    jQuery.event = {
        add: function(elem, types, handler) {
            var eventHandle = function(e) {
                return jQuery.event.dispatch.apply(elem, arguments);
            };

            eventCache['handler'] = handler;

            if (elem.addEventListener) {
                elem.addEventListener(types, eventHandle, false);
            }
        },
        dispatch: function(event) {
            // 返回jQuery.Event对象
            event = jQuery.event.fix(event);

            // 给缓存的回调函数传入jQuery.Event对象
            eventCache['handler'].call(this, event);
        },
        handlers: function() {

        },
        fix: function(event) {
            if (event[jQuery.expando]) {
                return event;
            }
            var props = "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" ");

            // 原始事件引用
            var originalEvent = event;

            // 创建事件对象
            event = new jQuery.Event(originalEvent);

            var i = props.length,
                prop;

            // 给event添加鼠标事件属性
            while (i--) {
                prop = props[i];
                event[prop] = originalEvent[prop];
            }

            return event;
        }
    };

    jQuery.fn.extend({
        on: function(types, fn) {
            jQuery.event.add(this[0], types, fn);
        }
    });

    var rclass = /[\t\r\n\f]/g;

    jQuery.fn.extend({
        addClass: function (value) {
            var classes, elem, cur, j, clazz, finalValue,
                proceed = typeof value === 'string' && value,
                i = 0;
                len = this.length;

            if (proceed) {
                // 要添加的className数组
                classes = (value || '').match(rnotwhite) || [];

                // 遍历每个节点
                for (; i < len; i++) {
                    elem = this[i];

                    // 获取当前节点的className
                    var cn = elem.className ? (' ' + elem.className + ' ').replace(rclass, '') : ' ';
                    cur = elem.nodeType === 1 && cn;

                    // 如果className不存在,cur也返回true(长度为1的空串)
                    // 只有elem.nodeType不等于1时cur才返回false
                    if (cur) {
                        j = 0;
                        // 遍历每个className
                        while ((clazz = classes[j++])) {
                            // 如果不存在则添加
                            if (cur.indexOf(' ' + clazz + ' ') < 0) {
                                cur += clazz + ' ';
                            }
                        }

                        // 去除两边空格
                        finalValue = jQuery.trim(cur);
                        // 给节点添加类名
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function (value) {
            var classes, elem, cur, j, clazz, finalValue,
                proceed = typeof value === 'string' && value,
                i = 0;
            len = this.length;

            if (proceed) {
                classes = (value || '').match(rnotwhite) || [];

                for (; i < len; i++) {
                    elem = this[i];

                    var cn = elem.className ? (' ' + elem.className + ' ').replace(rclass, '') : ' ';
                    cur = elem.nodeType === 1 && cn;

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            // 如果要删除的className已存在则去除
                            if (cur.indexOf(' ' + clazz + ' ') >= 0) {
                                cur = cur.replace(' ' + clazz + ' ', ' ');
                            }
                        }

                        finalValue = value ? jQuery.trim(cur) : '';
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function (value, stateVal) {
            var type = typeof value;

            // 设置第二个参数时,内部调用addClass或removeClass
            if (typeof stateVal === 'boolean' && type === 'string') {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }

            // 遍历元素
            return this.each(function () {
                if (type === 'string') {
                    var className,
                        i = 0,
                        self = jQuery(this),    // 取得当前元素的jquery对象
                        classNames = value.match(rnotwhite) || [];

                    while (className = classNames[i++]) {
                        // 当指定的class存在时删除,否则添加
                        if (self.hasClass(className)) {
                            self.removeClass(className);
                        } else {
                            self.addClass(className);
                        }
                    }
                }
            });
        },

        hasClass: function (selector) {
            var className = ' ' + selector + ' ',
                i = 0,
                l = this.length;

            for (; i < l; i++) {
                if (this[i].nodeType === 1 && (' ' + this[i].className + ' ').replace(rclass, ' ').indexOf(className) >= 0) {
                    return true;
                }
            }

            return false;
        }
    });

    jQuery.filter = function (expr, elems, not) {
        var elem = elems[0];

        if (not) {
            expr = ':not(' + expr + ')';
        }

        if (elems.length === 1 && elem.nodeType === 1) {
            return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
        } else {
            // 多个节点时取匹配expr的一个节点
            var list = jQuery.grep(elems, function (elem) {
                return elem.nodeType === 1;
            });
            return jQuery.find.matches(expr, list);
        }
    };

    var rhtml = /<|&#?\w+;/,
        rtagName = /<([\w:]+)/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rnoInnerhtml = /<(?:script|style|link)/i,

        // 对添加的如下标签做特殊处理,例如tr标签添加到div后会变成文本节点
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            thead: [ 1, "<table>", "</table>" ],
            col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            _default: [ 0, "", "" ]
        };

    jQuery.extend({
        clone: function (elem) {
            var clone = elem.cloneNode(true);
            return clone;
        },
        buildFragment: function (elems, context, scripts, selection) {
            var elem, tmp, tag, wrap, j,
                fragment = context.createDocumentFragment(),
                nodes = [],
                i = 0,
                l = elems.length;

            for (; i < l; i++) {
                elem = elems[i];

                if (elem || elem === 0) {
                    if (jQuery.type(elem) === 'object') {
                        // jQuery对象或Dom
                        jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
                    } else if (!rhtml.test(elem)) {
                        // 把非html文本转换为文本节点
                        nodes.push(context.createTextNode(elem));
                    } else {
                        // 把html文本转换为Dom
                        tmp = tmp || fragment.appendChild(context.createElement('div'));
                        // 获取标签名
                        tag = (rtagName.exec(elem) || ['', ''])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;
                        // 把类似<div/>这样的节点替换为<div></div>,并把html文本加入到临时节点中
                        tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, '<$1></$2>') + wrap[2];

                        j = wrap[0];
                        while (j--) {
                            tmp = tmp.lastChild;
                        }

                        // 把新的节点添加到nodes中
                        jQuery.merge(nodes, tmp.childNodes);
                        tmp = fragment.firstChild;
                        tmp.textContent = '';
                    }
                }
            }

            // 移除fragment最外层的包裹节点<div>
            fragment.textContent = '';

            i = 0;
            // 遍历nodes保存的节点,加入fragment中去
            while (elem = nodes[i++]) {
                fragment.appendChild(elem);
            }

            return fragment;
        }
    });

    function manipulationTarget(elem, content) {
        // 当节点为table并且要添加的子节点是tr时
        // content有可能是DocumentFragment类型,如果是取第一个子节点作为参照
        if (jQuery.nodeName(elem, 'table') && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, 'tr')) {
            // 如果table节点下有tbody则返回这个tbody节点,如果没有则创建一个tbody节点并返回
            return elem.getElementsByTagName('tbody')[0] || elem.appendChild(elem.ownerDocument.createElement('tbody'));
        } else {
            return elem;
        }
    }

    jQuery.fn.extend({
        text: function (value) {
            var func = function (value) {
                // 无参数获取textContent
                if (value === undefined) {
                    return jQuery.text(this);
                } else {
                    // 设置textContent
                    this.empty().each(function () {
                        if (this.nodeType === 1 || this.nodeType === 9 || this.nodeType === 11) {
                            this.textContent = value;
                        }
                    });
                }
            };
            return access(this, func, null, value, arguments.length);
        },

        append: function () {
            return this.domManip(arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        },

        prepend: function () {
            return this.domManip(arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },

        before: function () {
            return this.domManip(arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        },

        after: function () {
            return this.domManip(arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },

        remove: function (selector) {
            var elem,
                elems = selector ? jQuery.filter(selector, this) : this,
                i = 0;

            for (; (elem = elems[i]) != null; i++) {
                if (elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
            }

            return this;
        },

        empty: function () {
            var elem,
                i = 0;

            for (; (elem = this[i]) != null; i++) {
                if (elem.nodeType === 1) {

                    // 通过设置Node.textContent为空删除内部元素
                    elem.textContent = '';
                }
            }

            return this;
        },

        clone: function () {
            return this.map(function () {
                return jQuery.clone(this);
            });
        },

        html: function (value) {
            var func = function (value) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                // 获取html内容
                if (value === undefined && elem.nodeType === 1) {
                    return elem.innerHTML;
                }

                // 设置html内容,不允许是style,link,script标签,不允许是wrapMap里的标签tr,td等
                if (typeof value === 'string' && !rnoInnerhtml.test(value) &&
                    !wrapMap[(rtagName.exec(value) || ['', ''])[1].toLowerCase()]) {

                    // 把类似<div/>这样的节点替换为<div></div>
                    value = value.replace(rxhtmlTag, '<$1></$2>');

                    try {
                        for (; i < l; i++) {
                            elem = this[i] || {};

                            if (elem.nodeType === 1) {
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;
                    } catch (e) {}
                }

                // 如果innerHTML抛出异常执行
                if (elem) {
                    this.empty().append(value);
                }
            };
            return access(this, func, null, value, arguments.length);
        },

        replaceWith: function () {
            var arg = arguments[0];

            this.domManip(arguments, function (elem) {
                arg = this.parentNode;
                if (arg) {
                    arg.replaceChild(elem, this);
                }
            });

            // 如果参数为空,强制删除这个元素
            return arg && (arg.length || arg.nodeType) ? this : this.remove();
        },

        domManip: function (args, callback) {
            // 抹平嵌套的数组,这里args可以是[item1, item2]或[[item1, item2]]
            args = concat.apply([], args);

            var fragment, first, node,
                i = 0,
                l = this.length,
                iNoClone = l - 1;

            if (l) {
                // 返回生成的文档片段
                fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
                // 获取文档片段的第一个子元素
                first = fragment.firstChild;

                // args只有一个元素时fragment为dom元素,有多个元素时是文档片段(DocumentFragment类型)
                if (fragment.childNodes.length === 1) {
                    fragment = first;
                }

                if (first) {
                    for (; i < l; i++) {
                        node = fragment;

                        // 当有多个匹配的元素时,只有最后的一个元素不会被clone
                        if (i !== iNoClone) {
                            // 返回被clone的元素
                            node = jQuery.clone(node);
                        }
                        callback.call(this[i], node, i);
                    }
                }
            }

            return this;
        }
    });

    jQuery.each({
        appendTo: 'append',
        prependTo: 'prepend',
        insertBefore: 'before',
        insertAfter: 'after',
        replaceAll: 'replaceWith'
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var elems,
                ret = [],
                insert = jQuery(selector),  //目标元素
                last = insert.length - 1,
                i = 0;

            // 遍历目标元素
            for (; i <= last; i++) {
                // elems是要操作的对象
                // 如果是最后一个元素取this,如果不是最后一个元素取它的clone对象
                elems = i === last ? this : this.clone();

                // insert[i]为目标元素的DOM对象
                // jQuery(insert[i])为当前目标元素的jQuery对象
                jQuery(insert[i])[original](elems);

                push.apply(ret, elems.get());
            }

            // 返回操作元素的jQuery对象
            return this.pushStack(ret);
        };
    });

    jQuery.extend({
       attr: function (elem, name, value) {
           var ret,
               nType = elem.nodeType;

           if (!elem || nType === 3 || nType === 8 || nType === 2) {
               return;
           }

           if (value != undefined) {
               // 设置attr
               if (value === null) {

               } else {
                   elem.setAttribute(name, value + '');
                   return value;
               }
           } else {
               // 获取attr
               ret = jQuery.find.attr(elem, name);
               return ret == null ? undefined : ret;
           }
       }
    });

    var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);

    jQuery.parseHTML = function (data, context) {
        if (!data || typeof data !== 'string') {
            return null;
        }

        context = context || document;

        var parsed = rsingleTag.exec(data);

        // 如果是一个单独的空标签如'<div></div>','<br/>'等
        if (parsed) {
            return [context.createElement(parsed[1])];
        }

        // 创建文档片段
        parsed = jQuery.buildFragment([data], context);

        return jQuery.merge([], parsed.childNodes);
    };

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    var _jQuery = window.jQuery,
        _$ = window.$;

    jQuery.noConflict = function (deep) {
        if (window.$ === jQuery) {
            window.$ = _$;
        }

        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    };

    window.jQuery = window.$ = jQuery;

}(window));
