/**
 * 实现promise相关实例的方法
 */
const MyPromise = require("./myPromise");
MyPromise.prototype.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises))
      throw new TypeError("promises must be an array");
    const result = [];
    let count = 0;
    promises.forEach((p, i) => {
      p.then(
        (res) => {
          result[i] = res;
          count++;
          if (count === promises.length) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
};
MyPromise.prototype.finally = function (cb) {
  return this.then(
    (val) => {
      cb();
      return val;
    },
    (err) => {
      cb();
      throw err;
    }
  );
};
MyPromise.prototype.allSettled = function () {
  if (promises.length === 0) return MyPromise.resolve([]);
  // 均转换成promise对象
  const _promises = promises.map((item) =>
    item instanceof MyPromise ? item : MyPromise.resolve(item)
  );

  return new MyPromise((resolve, reject) => {
    const result = [];
    let unSettledPromiseCount = _promises.length;

    _promises.forEach((promise, index) => {
      promise.then(
        (value) => {
          result[index] = {
            status: "fulfilled",
            value,
          };
          // 无论成功失败都记一笔
          unSettledPromiseCount -= 1;
          // resolve after all are settled
          if (unSettledPromiseCount === 0) {
            resolve(result);
          }
        },
        (reason) => {
          result[index] = {
            status: "rejected",
            reason,
          };
          // 无论成功失败都记一笔
          unSettledPromiseCount -= 1;
          // resolve after all are settled
          if (unSettledPromiseCount === 0) {
            resolve(result);
          }
        }
      );
    });
  });
};
MyPromise.prototype.race = function (promises) {
  if (!Array.isArray(promises)) throw new Error("promises must Array!!");
  return new MyPromise((resolve, reject) => {
    promises.forEach((p) => {
      MyPromise.resolve(p).then(
        (val) => {
          resolve(val);
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
};
