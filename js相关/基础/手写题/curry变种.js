const sum = (a, b, c, d, e, f, g, h) => {
  return [a, b, c, d, e, f, g, h].reduce((a, b) => a + b);
};
const curry = (fn, arr = []) => (...args) =>
  ((arg) => (arg.length === fn.length ? fn(...arg) : curry(fn, arg)))([
    ...arr,
    ...args,
  ]);

const curSum = curry(sum);
console.log(curSum(1, 2, 3)(3)(33, 232)(22, 32).valueOf());
