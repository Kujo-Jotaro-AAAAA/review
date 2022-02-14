const MyPromise = require("./MyPromise");
// const promise = new MyPromise((resolve, reject) => {
//   // 目前这里只处理同步的问题
//   resolve("success");
// });

// function other() {
//   return new MyPromise((resolve, reject) => {
//     resolve("other");
//   });
// }
// promise
//   .then((value) => {
//     console.log(1);
//     console.log("resolve", value);
//     return other();
//   })
//   .then((value) => {
//     console.log(2);
//     console.log("resolve", value);
//     return 3;
//   });

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

// 测试错误处理
// 执行器错误
// const promise6 = new MyPromise((resolve, reject) => {
//   // 目前这里只处理同步的问题
//   throw new Error("执行器 error");
// });
// promise6.then(console.log, console.log);

// const promise6 = new MyPromise((resolve, reject) => {
//   // 目前这里只处理同步的问题
//   resolve(1);
// });
// promise6
//   .then((value) => {
//     console.log(1);
//     console.log("resolve", value);
//     throw new Error("then error");
//   })
//   .then(
//     (value) => {
//       console.log(3);
//       console.log(value);
//     },
//     (reason) => {
//       // * 报错
//       console.log(4);
//       console.log(reason.message);
//     }
//   );

// const promise8 = new MyPromise((resolve, reject) => {
//   reject("err");
// });

// promise8
//   .then()
//   .then()
//   .then(
//     (value) => console.log(value),
//     (reason) => console.log(reason)
//   );

MyPromise.resolve().then((val) => {
  console.log(val);
});
