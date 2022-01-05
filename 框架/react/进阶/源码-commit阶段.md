## Commit阶段

> `commitRoot` 方法是该阶段的起点。
>
> 会执行`effectList`链表上关于dom增改删的相关操作, 以及一些生命周期和hooks也会在这里执行。如: `componentDidxxx` `useEffect` 等

### before mutation之前

处理[effectList](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2085-L2101)

创建firstEffect, 当状态为[PerformedWork或者NoEffect](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js#L14)则跳过直接赋值给finishedWork。


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
### before mutation



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
### mutation
执行dom操作
### layout
执行dom操作后