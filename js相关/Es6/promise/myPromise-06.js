/**
 * 错误捕获
 */
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  constructor(executor) {
    // ! 处理执行器错误情况
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  status = PENDING;
  value = null;
  reason = undefined;
  // onFulfilledCallback = null;
  onFulfilledCallbacks = [];
  // onRejectedCallback = null;
  onRejectedCallbacks = [];
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
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
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.reason);
      }
      // this.onRejectedCallback && this.onRejectedCallback(this.reason);
    }
  };
  then = (onFulfilled, onRejected) => {
    const p2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          // ! .then的错误处理
          try {
            const x = onFulfilled(this.value);
            resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    });
    return p2;
  };
}
/**
 * 统一处理成功的回调
 * @param {MyPromise} x 上个promise的返回值
 * @param {*} resolve
 * @param {*} reject
 */
function resolvePromise(p2, x, resolve, reject) {
  if (p2 === x) {
    return reject(new TypeError("循环引用"));
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}
module.exports = MyPromise;
