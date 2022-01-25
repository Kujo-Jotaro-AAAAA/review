## 实现一个new

[参考](https://juejin.cn/post/6991483397495324703)

1. 新建一个对象obj

2. 把obj的和构造函数通过原型链连接起来

3. 将构造函数的this指向obj

4. 如果该函数没有返回对象，则返回this


```js
function myNew (func, ...args) {
  const obj = Object.create(func.prototype) // Object.create() 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
  let result = func.apply(obj, args)
  return result instanceof Object ? result : obj
}
```