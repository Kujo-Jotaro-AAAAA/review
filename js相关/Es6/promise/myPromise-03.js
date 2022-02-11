/**
 * 封装.then多回调
 */
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }
  status = PENDING;
  value = null;
  reason = undefined;
  // ! 1. 用于缓存成功与失败的回调, 变成数组
  // onFulfilledCallback = null;
  onFulfilledCallbacks = [];
  // onRejectedCallback = null;
  onRejectedCallbacks = [];
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      // ! 3.1清空成功缓存的回调
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(this.value);
      }
      // this.onFulfilledCallback && this.onFulfilledCallback(this.value);
    }
  };
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      // ! 3.2清空失败缓存的回调
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.reason);
      }
      // this.onRejectedCallback && this.onRejectedCallback(this.reason);
    }
  };
  then = (onFulfilled, onRejected) => {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      onRejected(this.reason);
    } else {
      // ! 2. 将回调状态push进回调缓存数组中
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  };
}
module.exports = MyPromise;
