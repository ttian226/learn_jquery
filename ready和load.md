#### ready与load那一个先执行
ready先执行，load后执行

#### Dom文档加载步骤
1. 解析HTML结构
2. 加载外部脚本和样式表文件
3. 解析并执行脚本代码
4. 构造HTML DOM模型。//ready
5. 加载图片等外部文件
6. 页面加载完毕。//load

#### jQuery ready
```javascript
$(document).ready(function () {
	//...
});

//ready的简写
$(function () {
	//...
});
```

#### 例子
```javascript
console.log('1');

$(function () {
	console.log('2');
});

console.log('3');

//由于解析执行js代码是在ready前，所以输出顺序1 3 2
```

#### DOMContentLoaded和load事件

The DOMContentLoaded event is fired when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading. A very different event - load - should be used only to detect a fully-loaded page.
> DOMContentLoaded事件是在Dom文档加载完成后触发，而不用等待样式文件，图片和子frame加载。而load事件是所有文件加载完成后触发。

对于支持DOMContentLoaded的高级浏览器，jQuery的dom ready事件使用DOMContentLoaded来触发。