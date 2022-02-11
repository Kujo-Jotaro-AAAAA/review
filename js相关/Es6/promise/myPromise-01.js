/**
 * 初始状态成与败
 */
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }
  status = PENDING;
  value = null; // 成功后的值
  reason = undefined; // 失败后的原因
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
    }
  };
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
    }
  };
  then = (onFulfilled, onRejected) => {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  };
}
module.exports = MyPromise;
