#### addClass removeClass

`Element.className = 'classname1 classname2'`

removeClass也是重新获取所有的classname再通过`Element.className`设置

#### hasClass

Node.nodeType === 1 并且 Element.className中能找到指定的classname

#### append appendTo

`Node.appendChild()`添加一个子节点到指定元素内的尾部
nodeType = 9 (DOCUMENT_NODE)
nodeType = 11 (DOCUMENT_FRAGMENT_NODE)

```javascript
if (当前节点.nodeType === 1 || 当前节点.nodeType === 11 || 当前节点.nodeType === 9) {
    当前节点.appendChild(新节点);
}
```

#### prepend prependTo

`Node.insertBefore()`在父节点内部的一个子节点前插入一个子节点
`Node.firstChild`返回指定元素的第一个子节点

```javascript
if (当前节点.nodeType === 1 || 当前节点.nodeType === 11 || 当前节点.nodeType === 9) {
    当前节点.insertBefore(新节点, 当前节点.firstChild);
}
```

#### before insertBefore

`Node.parentNode`获取父节点

```javascript
if (当前节点.parentNode) {
    当前节点.parentNode.insertBefore(新节点, 当前节点);
}
```

#### after insertAfter

`Node.nextSibling`返回指定节点的下一个同级节点

```javascript
if (当前节点.parentNode) {
    当前节点.parentNode.insertBefore(新节点, 当前节点.nextSibling);
}
```


