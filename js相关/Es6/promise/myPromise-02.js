/**
 * 处理异步存callback
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
  // ! 用于缓存成功与失败的回调
  onFulfilledCallback = null;
  onRejectedCallback = null;
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      // ! 处理成功回调
      this.onFulfilledCallback && this.onFulfilledCallback(this.value);
    }
  };
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      // ! 处理失败回调
      this.onRejectedCallback && this.onRejectedCallback(this.reason);
    }
  };
  then = (onFulfilled, onRejected) => {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      onRejected(this.reason);
    } else {
      // ! 处理pending状态
      this.onFulfilledCallback = onFulfilled;
      this.onRejectedCallback = onRejected;
    }
  };
}
module.exports = MyPromise;
