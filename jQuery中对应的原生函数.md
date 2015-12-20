#### addClass() removeClass()

`Element.className`获取或设置元素的class属性

`当前节点.className = 'classname1 classname2'`

removeClass也是重新获取所有的classname再通过`Element.className`设置

#### hasClass()

Node.nodeType === 1 并且 Element.className中能找到指定的classname

#### append() appendTo()

`Node.appendChild()`添加一个子节点到指定元素内的尾部
nodeType = 9 (DOCUMENT_NODE)
nodeType = 11 (DOCUMENT_FRAGMENT_NODE)

```javascript
if (当前节点.nodeType === 1 || 当前节点.nodeType === 11 || 当前节点.nodeType === 9) {
    当前节点.appendChild(新节点);
}
```

#### prepend() prependTo()

`Node.insertBefore()`在父节点内部的一个子节点前插入一个子节点
`Node.firstChild`返回指定元素的第一个子节点

```javascript
if (当前节点.nodeType === 1 || 当前节点.nodeType === 11 || 当前节点.nodeType === 9) {
    当前节点.insertBefore(新节点, 当前节点.firstChild);
}
```

#### before() insertBefore()

`Node.parentNode`获取父节点

```javascript
if (当前节点.parentNode) {
    当前节点.parentNode.insertBefore(新节点, 当前节点);
}
```

#### after() insertAfter()

`Node.nextSibling`返回指定节点的下一个同级节点

```javascript
if (当前节点.parentNode) {
    当前节点.parentNode.insertBefore(新节点, 当前节点.nextSibling);
}
```

#### text()

`Node.textContent`设置或读取节点的文本内容
`Node.nodeValue`返回或设置当前节点的值，对于document自身返回null,对于Element类型也返回null，对于Text和Comment类型返回节点内容

设置时：`当前节点.textContent = 新值`
读取时：
```javascript
if (当前节点.nodeType === 1 || 当前节点.nodeType === 11 || 当前节点.nodeType === 9) {
    return 当前节点.textContent;
} else if (当前节点.nodeType === 3) {//Text类型
    return 当前节点.nodeValue;
}
```

#### empty()

设置textContent为空来实现：`Node.textContent = ''`

#### html()

`Element.innerHTML`设置或读取指定元素内的html

读取时：`return 当前节点.innerHTML`
设置时：`当前节点.innerHTML = 新值`

#### clone()

`Node.cloneNode()`返回一个新的元素，它是指定元素的一个拷贝

`return 当前节点.cloneNode(true)` 参数为true时为深拷贝

#### replaceWith() replaceAll()

`Node.replaceChild()`在指定的节点上用一个新的子节点替换另一个子节点

```javascript
if (当前节点.parentNode) {
    当前节点.parentNode.replaceChild(新节点, 当前节点);
}
```

#### remove()

`Node.removeChild()`在指定的节点上删除一个子节点

```javascript
if (当前节点.parentNode) {
    当前节点.parentNode.removeChild(要删除的子节点);
}
```

#### attr()

读取：`Element.getAttribute()`返回元素指定属性的值
设置：`Element.setAttribute()`给指定元素添加新的属性或改变原有的属性值

#### removeAttr()

`Element.removeAttribute()`删除指定元素的属性

#### css()

设置样式

`HTMLElement.style`属性返回一个`CSSStyleDeclaration`对象。它只会获取元素节点style属性内的css样式，不会获取样式表中存在的样式

```javascript
var elem = document.getElementById(元素id);
var style = elem.style; //返回一个CSSStyleDeclaration对象
style[属性名] = 属性值;//给指定的属性赋值
```

获取样式

`window.getComputedStyle`返回一个`CSSStyleDeclaration`对象，包括所有的样式（style属性的样式和样式表中样式）
`CSSStyleDeclaration.getComputedStyle(name)`获取指定的样式

```javascript
var elem = document.getElementById(元素id);
var styles = window.getComputedStyle(elem, null);//获取样式集合,是CSSStyleDeclaration类型
var style = styles.getPropertyValue(属性名); //获取样式
```

#### height()

`$(window).height()`获取窗口的高度:`document.documentElement['clientHeight']`
其中`document.documentElement`是获取文档对应的html元素。`Element.clientHeight`是获取元素的高度（包括padding+height）

`$(document).height()`获取文档的高度：取下面5个值的最大的值
1. body元素.scrollHeight
2. body元素.offsetHeight
3. html元素.scrollHeight
4. html元素.offsetHeight
5. html元素.clientHeight

`Element.clientHeight`返回元素的高度（包括padding）
`Element.scrollHeight`返回元素内容的高度
`HTMLElement.offsetHeight`返回元素的高度（包括padding + border）

元素的height() = 元素offsetHeight高度 - 元素上下padding高度 - 元素上下border高度

设置高度时：

1.如果元素是border-content时：
例如`$('#id).height(100)`实际上给元素的style属性添加一个样式

```javascript
var elem = document.getElementById(元素id);
var style = elem.style; //返回一个CSSStyleDeclaration对象
style['height'] = '100px';//给指定的属性赋值
```

2.如果元素是border-box时：
`style['height'] = 100 + 元素上下padding的高度 + 元素上下border的高度`

#### innerHeight()

返回元素内容的高度 + 上下padding的高度(实际上就是HTMLElement.clientHeight的高度)

元素的innerHeight() = 元素offsetHeight高度 - 元素上下border高度

设置高度时：

1.如果元素是border-content时：
例如`$('#id).innerHeight(100)`
`style['height'] = 100 - 上下padding的高度`

2.如果元素是border-box时：
例如`$('#id).innerHeight(100)`
`style['height'] = 100 + 上下border的高度`

#### outerHeight()

`outerHeight()`返回元素内容的高度 + 上下padding的高度 + 上下border的高度（等于HTMLElement.offsetHeight）
`outerHeight(true)`返回元素内容的高度 + 上下padding的高度 + 上下border的高度 + 上下margin的高度（等于HTMLElement.offsetHeight+上下margin的高度）

1.如果元素是border-content时：
例如`$('#id).outerHeight(100)`
`style['height'] = 100 - 上下padding的高度 - 上下border的高度`

2.如果元素是border-box时：
例如`$('#id).outerHeight(100)`
`style['height'] = 100`

#### offset()

1. 获取相对于document的top,left

`Node.ownerDocument`返回Node所属文档节点
`Element.getBoundingClientRect()`返回元素相对于视窗的位置，一个DOMRect对象
`Document.defaultView`获取文档对应的window对象
`window.pageYOffset`是`Window.scrollY`的别名，返回文档垂直滚动的像素

```javascript
var docElem = 当前元素.ownerDocument;
var win = docElem.defaultView;
var box = 当前元素.getBoundingClientRect();
return {
    top: box.top + win.pageYOffset + docElem.clientTop
    left: box.left + win.pageXOffset + docElem.clientLeft
};
```

拿top来说，`top = 元素相对窗口的top值 + 文档垂直滚动的距离 + 文档的上边框高度`

2. 设置offset:

如果要设置的元素没有定位(static)

```javascript
var elem = 当前元素;

// 设置当前元素定位为相对定位
elem.style.position = 'relative';

// 获取当前元素的offset
var curOffset = $(elem).offset();

var props = {};

// 设置新的top值
props.top = 要设置的top值 - curOffset.top;

// 设置新的left值
props.left = 要设置的left值 - curOffset.left;

return props;
```

如果要设置的元素是相对定位或绝对定位，不改变其定位属性，只是改变top和left值

```javascript
// 设置新的top值
props.top = 要设置的top值 - curOffset.top + 当前元素的top值（定位使用的top）

// 设置新的left值
props.left = 要设置的left值 - curOffset.left + 当前元素的left值（定位使用的left）
```

#### position()

获取相对于父节点的相对位置

`HTMLElement.offsetParent`返回一个包含这个元素并且离它最近的一个带有定位的元素

```javascript
// 获取当前元素的offsetParent节点
var parent = 当前元素.offsetParent;

// 获取当前元素的相对document的偏移
var offset = $(当前元素).offset();

// 获取parent元素相对文档的偏移
var poffset = $(parent).offset();

poffset.top += parent元素的上边框宽度
poffset.left += parent元素的左边框宽度

return {
    top: offset.top - poffset.top - 当前元素marginTop宽度
    left: offset.left - poffset.left - 当前元素marginLeft宽度
}
```

#### scrollTop(),scrollLeft()

`Element.scrollTop`读取或设置元素向上垂直滚动的像素
`Element.scrollLeft`读取或设置元素水平向左滚动的像素
`Window.scrollTo`滚动到文档的指定坐标

读取元素的scrollTop:`return 当前元素.scrollTop`
读取document的scrollTop:`return window.pageYOffset`

设置元素的scrollTop:`当前元素.scrollTop = 要设置的值`
设置document的scrollTop:`window.scrollTo(window.pageXOffset, 要设置的值)`
设置document的scrollLeft:`window.scrollTo(要设置的值, window.pageYOffset)`

#### parent()

`Node.parentNode`

#### parents()

从当前节点循环查找parentNode,一直终止到document,返回所有的父节点。
如果parents(selector)带参数，会根据selector对结果集筛选出匹配的父节点。

#### parentsUntil(selector)

查找过程同parents()，不是终止到document而是终止到selector（结果集并不包含selector匹配的父节点）
如果带有第二个参数，会对结果集进行筛选

#### next()

`Node.nextSibling`通常会返回非nodeType=1的节点（如Text节点）
next()只会返回nodeType=1的节点

#### prev()

`Node.previousSibling`，同next()，只会返回nodeType=1的节点

#### children(),siblings()

两个接口实现一致：通过父元素找到第一个子元素，通过`nextSibling`遍历，把遍历到的元素保存到集合中，siblings()只是排除了当前元素

#### contents()

`Element.childNodes`，获取的是包括comment,text等节点
如果是元素是iframe，获取的是`HTMLIFrameElement.contentDocument`


