/**
 * 实现一个数组的proxy, 能够用负数进行对数组的倒序访问
 * arr = [1,2,3]
 * arr[-1] = 3
 */
const proxyArr = (arr) => {
  const len = arr.length;
  return new Proxy(arr, {
    get(target, key) {
      key = +key;
      while (key < 0) {
        key += len;
      }
      return target[key];
    },
  });
};
const pa = proxyArr([1, 2, 3]);
console.log(pa[-2]);
