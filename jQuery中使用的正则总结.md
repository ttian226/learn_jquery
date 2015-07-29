#### 用空格分隔字符串

```javascript
var rnotwhite = /\S+/g;
var somestr = 'abc 123 456';
var list = somestr.match(rnotwhite);    //["abc", "123", "456"]
```
