## Render阶段

`render`阶段是在内存中进行的，当工作完成后会通知`Renderer`执行对应的`dom`操作

- 分为同/异步情况: 

同步`performSyncWorkOnRoot`

异步`performConcurrentWorkOnRoot`

这两个函数内部的唯一区别,就是异步时通过`shouldYield()`判断是否可以执行js。

它们都执行了`performUnitOfWork`函数。

作用: 创建新的fiber节点并将其与已创建的其他fiber连接成fiber树

执行的过程可抽象理解为 **递 & 归**

- 「 递阶段 」

首先从`rootFiber`开始进行深度优先遍历, 为每一个遍历到的子节点执行`beginWork`方法，
`beginWork`根据传入的fiber生成新的子fiber，并将他们关联起来
直至叶子节点后开始执行“归”阶段



- 「 归阶段 」

归阶段调用`completeWork`，如果其存在兄弟节点，则继续执行兄弟节点的”递“过程
“递” 和 “归”交替执行，直到回到`rootFiber`节点。




### 递阶段函数`beginWork`

通过`currentFiber === null` , 判断是`mount`还是`update`阶段

两个阶段都会复用`reconcilerChildren`, 它分为`mount`和`update`阶段

- `mount` 阶段

根据组件类型`fiber.tag`的不同，创建对应的子`fiber`。

- `update`阶段

根据以下条件判断是否复用`fiber`节点: 

1. 当组件的类型及新旧`props`一致时
2. 当前fiber节点优先级不够时

无法复用则根据`diff`算法生成对比好的新`fiber`节点

以上两个阶段执行完后, 将得到的结果赋值给`workInProgress.child`

![](https://react.iamkasong.com/img/beginWork.png)

### 归阶段函数`CompleteWork`

与`beginWork`一样的，通过`currentFiber === null`, 判断是`mount` or `update`

- `mount` 阶段

1. 为`fiber`节点生成对应的`dom`节点
2. 将子孙的`dom`节点插入刚生成的`dom`节点中。**completeWork会判断是否有子节点，会先生成子的dom节点**
3. 通过`updateHostComponent`处理以下几个主要的事情:
   1) 注册`onClick`、`onChange`等回调函数
   2) 处理`style prop`
   3) 处理`DANGEROUSLY_SET_INNER_HTML`
   4) 处理`children prop`
   5) 处理`ref`

- `update` 阶段

根据当前节点是否在页面上有对应的节点`workInProgress.stateNode !== null`才会往下执行，否则仍旧执行mount

1. 执行mount阶段的第3点
2. 处理完成后赋值给`workInProgress.updateQueue`, 准备在commit阶段渲染到页面上

在以上两个阶段的结尾时，通过`updateHostComponent`函数，已构建好了一个离屏dom树。

![](https://react.iamkasong.com/img/completeWork.png)

### EffectTag

`render`阶段时，并不会对需要变更的dom元素进行真实的dom操作，而是会给每个fiber节点打上一个`effectTag`的标记，是fiber上的一个属性`fiber.effectTag`。

之后再通知`Renderer`去执行对应的dom操作。

```js
// EffectTag
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```

> 之所以用二进制标识，是为了方便位运算。

如果要通知Renderer将Fiber节点对应的DOM节点插入页面中，需要满足两个条件：

1. `fiber.stateNode`存在，它会在`completeWork`阶段创建

2. 该`fiber.effectTag`打上了`Placement`。当首屏渲染(即`mount`时)，为了避免大量节点的`Placement`操作，则只给`rootFiber`节点打上`Placement`标记。

### EffectList

执行完整个`render`阶段后，我们给每一个需要更新状态的fiber节点打上了标记。
为了不在`commit`阶段又重新遍历一遍整个fiber树寻找要更新的fiber节点，则会将需要更新的节点都储存在一个单向链表中。
每个执行完`completeWork`且存在`effectTag`的`Fiber`节点, 都会存到`EffectList`

> 借用React团队成员Dan Abramov的话：effectList相较于Fiber树，就像圣诞树上挂的那一串彩灯。





