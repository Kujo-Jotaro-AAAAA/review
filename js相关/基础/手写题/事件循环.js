function f() {
  setTimeout(() => {
    console.log(1);
  })(() => {
    console.log(8);
  })();
  console.log(2);
  new Promise((res) => {
    console.log(3);
    res(4);
  }).then((data) => {
    console.log(data);
    setTimeout(() => {
      console.log(5);
    });
    Promise.resolve().then(() => {
      console.log(6);
    });
  });
  console.log(7);
}
// output: 8 -> 2 -> 3 -> 7 -> 4 -> 6 -> 1 -> 5

const ajaxFn = () => {
  const n = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => (n > 0.5 ? resolve(n) : reject(n)), 1000);
  });
};
function retry(action, times) {
  let limit = times;

  return new Promise(async (resolve) => {
    async function runner() {
      if (!limit) return;
      limit--;
      try {
        const res = await action();
        resolve(res);
      } catch (e) {
        // 这里
        runner();
      }
    }
    runner();
  });
}
retry(ajaxFn, 5).then((res) => console.log(res));
