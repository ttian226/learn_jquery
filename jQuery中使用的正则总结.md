#### 用空格分隔字符串

```javascript
var rnotwhite = /\S+/g;     //匹配一个或多个非空白符
var somestr = 'abc 123 456';
var list = somestr.match(rnotwhite);    //找到3个匹配，结果为["abc", "123", "456"]
```

#### Event中用到的一个正则

```javascript
var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
var somestr = 'abcd';
var list = somestr.match(rtypenamespace);   //["abcd", "abcd", undefined]
```

*解释：*
* 第一个分组`([^.]*)`匹配0或多个不是`.`的字符，所以匹配到了`abcd`，结果为`['abcd', 'abcd']`数组中第二个值为捕获的分组
* 第二个分组为非捕获分组`(?:\.(.+)|)`内部包含一个分组`(.+)`。匹配`\.(.+)`或空字符串。由于之前`abcd`已经全部匹配，所以第二个分组匹配到了空串。
* `\.(.+)`由于未匹配到，`(.+)`捕获的分组则为`undefined`。所以最终结果为["abcd", "abcd", undefined]

```javascript
var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
var somestr = 'abcd.123';
var list = somestr.match(rtypenamespace);   //["abcd.123", "abcd", "123"]
```

*解释：*
* 第一个分组`([^.]*)`匹配到了`abcd`
* 第二个分组中的`\.`匹配到了接下来的`.`
* 第二个分组中的`(.+)`匹配到了余下的字符串`123`

#### trim函数

```javascript
var rtrim = /^[\s]+|[\s]+$/g;

var trim = function (text) {
    return text == null ? '' : (text + '').replace(rtrim, '');
};
```

#### 替换回车换行制表符

```javascript
var rclass = /[\t\r\n\f]/g;
// 替换回车换行制表符为空格
( " " + elem.className + " " ).replace( rclass, " " )
```

#### 匹配html文本

*解释：* 匹配包含一个`<`的字符串或包含以`&#`,`&`开头并且以`;`结尾的字符串

```javascript
/<|&#?\w+;/.test('<some text');   //true
/<|&#?\w+;/.test('some text &#123;');//true
/<|&#?\w+;/.test('&123; some text');//true
```

#### 匹配标签名

```javascript
var rtagName = /<([\w:]+)/;
rtagName.exec('<div>123</div>');    //["<div", "div"]
rtagName.exec('<abc:>123</abc:>');  //["<abc:", "abc:"]
```

#### 

* 匹配以`/>`结尾的字符串

```javascript
var reg = /(([\w:]+)[^>]*)\/>/gi;
reg.test('123&&/>');    //true 
```

* 匹配一个'<'，后面不能是area|br|col|embed|hr|img|input|link|meta|param

```javascript
var reg = /<(?!area|br|col|embed|hr|img|input|link|meta|param)/gi;
reg.exec('<div'); //匹配到一个'<'
reg.exec('<area'); //null
```

* 替换类似<div/>为<div></div>,对于以下类型节点不替换area|br|col|embed|hr|img|input|link|meta|param

```javascript
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
var html = '<br/>';

var r1 = rxhtmlTag.exec(html);
console.log(r1);
var r2 = html.replace(rxhtmlTag, "<$1></$2>");
console.log(r2);
```

#### 限制innerHTML的字符串

在innerHTML中是不允许使用以下标签的`<script><style><link>`

```javascript
var rnoInnerhtml = /<(?:script|style|link)/i;
rnoInnerhtml.test('<script>'); //true
rnoInnerhtml.test('<div>'); //false
```

#### 检查HTML字符串

```javascript
var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
rquickExpr.exec('<div>123</div>');  //["<div>123</div>", "<div>123</div>"]
```

#### 匹配单独的标签(空标签)

`<\/\1>`中的`\1`代表第一个括号里`(\w+)`匹配的分组。这里因为匹配的第一个分组是`div`，`<\/\1>`则匹配字符串`</div>`

```javascript
var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
rsingleTag.exec('<div></div>'); //["<div></div>", "div"]
rsingleTag.exec('<br/>');   //["<br/>", "br"]
rsingleTag.exec('<div>123</div>'); //null
```

#### 把字符串转换为驼峰形式

例如把'z-index'转换为'zIndex'

```javascript
var rdashAlpha = /-([\da-z])/gi;
var str = 'z-index';
str.replace(rdashAlpha, function (match, letter) {
    return letter.toUpperCase();
});
```


