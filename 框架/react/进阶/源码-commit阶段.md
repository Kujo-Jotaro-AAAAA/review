## Commit阶段

> `commitRoot` 方法是该阶段的起点。
>
> 会执行`effectList`链表上关于dom增改删的相关操作, 以及一些生命周期和hooks也会在这里执行。如: `componentDidxxx` `useEffect` 等

### before mutation之前

将root上的effect连接到effectList的尾部, 当状态为[PerformedWork或者NoEffect](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js#L14)则跳过直接赋值给finishedWork。 [源码](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2085-L2101)


```js
// Get the list of effects.
let firstEffect;
if (finishedWork.effectTag > PerformedWork) {
  // A fiber's effect list consists only of its children, not itself. So if
  // the root has an effect, we need to add it to the end of the list. The
  // resulting list is the set that would belong to the root's parent, if it
  // had one; that is, all the effects in the tree including the root.
  if (finishedWork.lastEffect !== null) {
    finishedWork.lastEffect.nextEffect = finishedWork;
    firstEffect = finishedWork.firstEffect;
  } else {
    firstEffect = finishedWork;
  }
} else {
  // There is no effect on the root.
  firstEffect = finishedWork.firstEffect;
}
```
### before mutation-dom操作之前

遍历`effectList`,**执行`commitBeforeMutationEffects`**,  然后执行下列操作:

**处理DOM节点渲染**/删除后的 autoFocus、blur 逻辑。

**调用getSnapshotBeforeUpdate生命周期钩子**。

> 从Reactv16开始，componentWillXXX钩子前增加了UNSAFE_前缀。
>
> 究其原因，是因为重构为异步可中断架构后，render阶段的任务可能中断`or`重新开始，对应的组件在render阶段的生命周期钩子（即componentWillXXX）可能触发多次。
>
> 这种行为和Reactv15不一致，所以标记为UNSAFE_。

为此，React提供了替代的生命周期钩子getSnapshotBeforeUpdate。由于该函数是同步的, 避免了多次调用的问题。

**异步调度useEffect**。

- 问啥要异步调用`useEffect`?

为了防止同步执行时阻塞浏览器渲染

- 如何异步调度的? TODO -> (没看懂)
### mutation-执行dom操作

同样的遍历`effectList`, 执行`commitMutationEffects`

**判断是否需要重置文字节点**

根据effectTag是否需更新和[ContentReset](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js#L21)来判断执行重置文字节点操作

**更新ref**

#### **根据effectTag分别处理**

**placement effect 插入操作**

1. 获取父节点
2. 调用`getHostSibling`获取兄弟节点, 如有则进行`insert`操作, 否则执行`append`

其中`getHostSibling`操作是很耗性能的, 因为Fiber树和渲染的DOM树节点并不是一一对应的, 要从当前fiber节点找到dom节点, 很可能跨层级遍历.

比如
```jsx

function Item() {
  return <li><li>;
}

function App() {
  return (
    <div>
      <Item/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

对应的fiber树和dom树大致如下:

```
// Fiber树
          child      child      child       child
rootFiber -----> App -----> div -----> Item -----> li

// DOM树
#root ---> div ---> li
```
此时给Item前面新增一个兄弟节点`<p>`

```jsx

function Item() {
  return <li><li>;
}

function App() {
  return (
    <div>
      <p>我是新增的</p>
      <Item/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```
对应的fiber树和dom树变成了

```
// Fiber树
          child      child      child
rootFiber -----> App -----> div -----> p 
                                       | sibling       child
                                       | -------> Item -----> li 
// DOM树
#root ---> div ---> p
             |
               ---> li
```

dom树的`p`兄弟节点是`li`, 符合预期。**但`fiber`树的`p`的兄弟就变成了`p.sibling.child`**

**Update effect**

将根据`fiber.tag`执行不同的逻辑, 着重关注 `FunctionComponent` & `HostComponent`。

- `FunctionComponent`

该方法会遍历effectList，执行所有useLayoutEffect hook的销毁函数。

- `HostComponent`

最终会在updateDOMProperties,将render阶段 completeWork时为Fiber节点赋值的updateQueue对应的内容渲染在页面上。

```js
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // 处理 style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
  // 处理 DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
  // 处理 children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
  // 处理剩余 props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```

**Deletion effect**

1. 递归调用该fiber自身及所有子节点的`componentWillUnMount`生命周期,销毁对应dom
2. 解绑ref
3. 调度`useEffect` 的销毁函数

### layout-dom操作后

