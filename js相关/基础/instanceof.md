## 实现instanceof

1. 判断对象的原型链上是否存在构造函数的原型, 只能判断引用类型。
2. `instanceof`常用来判断A是否为B的实例

```js

function myInstanceof(case, Con) {
  if (typeof(case) != 'object' || typeof(case) != 'function' || case != 'null') return false

  let caseProto = Object.getPrototypeOf(case)
  while (true) {
    if (caseProto === null) return false
    if (caseProto === Con.prototype) return true
    caseProto = Object.getPrototypeOf(case)
  }
}

```