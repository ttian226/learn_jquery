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



