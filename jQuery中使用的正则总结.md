#### 用空格分隔字符串

```javascript
var rnotwhite = /\S+/g;     //匹配一个或多个非空白符
var somestr = 'abc 123 456';
var list = somestr.match(rnotwhite);    //找到3个匹配，结果为["abc", "123", "456"]
```
