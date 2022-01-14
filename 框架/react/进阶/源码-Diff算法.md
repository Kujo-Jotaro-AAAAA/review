
## Diff算法
一个dom节点在同一时刻，最多会有4个节点与他相关:
1. `currentFiber`
2. `workInProgressFiber`
3. `DOM`节点本身
4. `Jsx`

`diff`算法简单来说就是通过对比`1`和`4`去生成`2`


将两棵树前后比较的时间复杂度为` O(n 3 )`, 即使是市面上最优的算法同步处理1000个节点也是上亿级的, 因此react并不会进行整棵树的全量对比。

### 更新条件

1. 只对同层级元素`diff`,跨层级不对比
2. props变化了会更新, 但仍可以通过key来指定哪些子元素在不同的渲染下保持稳定
3. 元素的类型变化

### 比对过程


通过`reconcileChildFibers`函数执行比对, 会根据是否为单一节点进行不同的操作。

- 单节点

![](https://react.iamkasong.com/img/diff.png)

1. 当前节点之前是否存在
2. 当前节点是否达成复用的条件(前面的更新条件)

如果能复用, 则将上次的节点副本作为新fiber节点返回。

否则直接生成新的fiber节点返回

- 多节点



```js
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {
    children: [
      {$$typeof: Symbol(react.element), type: "li", key: "0", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "1", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "2", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "3", ref: null, props: {…}, …}
    ]
  },
  ref: null,
  type: "ul"
}
```

也就是多个同层节点的fiber, 会比对新老两个节点树,我们姑且称为`oldFiber`和`newFiber`。

在这里会执行两轮更新, 第一轮先判断当前节点是否属于更新, 然后再执行非更新的操作。

这是因为`React`团队发现，在日常开发中，相较于新增和删除，更新组件发生的频率更高。

根据上文所述的**更新条件**走完第一轮遍历，则会得到如下结果:


1. `oldFiber` === `newFiber`

新老节点都更新完了, 也就是性能最好的情况。只执行一次遍历就更新完了, 此时diff结束。

2. `oldFiber` < `newFiber`

老节点遍历完了, 新节点还有, 说明是新增操作, 给这些fiber打上新增的标记即可

3. `oldFiber` > `newFiber`

老节点还有, 新节点遍历完了。剩下的老节点都要删除，打上`deletion`标记

4. `oldFiber` 与 `newFiber`都还有剩余, 说明走的是更新操作(节点没有新增删除, 但是更新或移动了位置), 这是diff算法最难理解的部分, 也就是diff的移动更新。

### diff中的移动更新

1. 将`oldFiber`剩余的部分转换成一个`map`
2. 将最后一个可复用的`newFiber`的下标记录为`lastPlacedIndex`,这是移动更新的起点。
3. 然后从左往右继续遍历, 如果`newFiber`有在`oldFiber`匹配到的下标(称为`oldIndex`)。

- `oldIndex` >= `lastPlacedIndex`, 则此节点不用移动, 并将`oldIndex`赋值给`lastPlacedIndex`。

- 此`oldIndex` < `newFiber`当前的下标, 说明改节点要往右边移动。

以下为伪代码，用于理解。

```js

// 之前
abcd

// 之后
acdb

===第一轮遍历开始===
a（之后）vs a（之前）  
key不变，可复用
此时 a 对应的oldFiber（之前的a）在之前的数组（abcd）中索引为0
所以 lastPlacedIndex = 0;

继续第一轮遍历...

c（之后）vs b（之前）  
key改变，不能复用，跳出第一轮遍历
此时 lastPlacedIndex === 0;
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === cdb，没用完，不需要执行删除旧节点
oldFiber === bcd，没用完，不需要执行插入新节点

将剩余oldFiber（bcd）保存为map

// 当前oldFiber：bcd
// 当前newChildren：cdb

继续遍历剩余newChildren

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index;
此时 oldIndex === 2;  // 之前节点为 abcd，所以c.index === 2
比较 oldIndex 与 lastPlacedIndex;

如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
并将 lastPlacedIndex = oldIndex;
如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动

在例子中，oldIndex 2 > lastPlacedIndex 0，
则 lastPlacedIndex = 2;
c节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：bd
// 当前newChildren：db

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
oldIndex 3 > lastPlacedIndex 2 // 之前节点为 abcd，所以d.index === 3
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：b
// 当前newChildren：b

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index;
oldIndex 1 < lastPlacedIndex 3 // 之前节点为 abcd，所以b.index === 1
则 b节点需要向右移动
===第二轮遍历结束===

最终acd 3个节点都没有移动，b节点被标记为移动
```