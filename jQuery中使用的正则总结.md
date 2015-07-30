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
