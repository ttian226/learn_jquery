#### noConflict使用
出让jQuery的$控制权。防止jQuery中的$与之前定义过的$冲突。


```javascript
//other_lib.js
var $ = function (selector) {
	console.log(selector);
};
```
```html
<script src="other_lib.js"></script>
<script src="jquery.js"></script>
```
```javascript
//在不使用$.noConflict()时，由于jquery.js是最后加载的
//$ === jQuery

//在使用$.noConflict()时，全局作用域中的$为在jquery之前定义的（在other_lib.js中定义的）
$.noConflict();
jQuery(document).ready(function ($) {
	//可以在这里继续使用局部变量$
});

//全局作用域中
$('test') //test
```

#### jquery源码
```javascript
//先把之前定义的jQuery,$保存到临时变量_jQuery,_$中
var _jQuery = window.jQuery,
    _$ = window.$;

jQuery.noConflict = function (deep) {
	if (window.$ === jQuery) {
		//把$的控制权出让出来
        window.$ = _$;
    }

    if (deep && window.jQuery === jQuery) {
    	//如果deep === true 也会把jQuery的控制权也出让出来
        window.jQuery = _jQuery;
    }

    return jQuery;
};
```
