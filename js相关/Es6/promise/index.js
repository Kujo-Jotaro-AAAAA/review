const MyPromise = require("./MyPromise");
const promise = new MyPromise((resolve, reject) => {
  // 目前这里只处理同步的问题
  resolve("success");
});

function other() {
  return new MyPromise((resolve, reject) => {
    resolve("other");
  });
}
promise
  .then((value) => {
    console.log(1);
    console.log("resolve", value);
    return other();
  })
  .then((value) => {
    console.log(2);
    console.log("resolve", value);
    return 3;
  });

// 循环引用测试
// const p1 = promise.then((val) => {
//   console.log(val);
//   return p1;
// });
// // 运行的时候会走reject
// p1.then(
//   (value) => {
//     console.log(2);
//     console.log("resolve", value);
//   },
//   (reason) => {
//     console.log("报错了", reason.message);
//   }
// );
