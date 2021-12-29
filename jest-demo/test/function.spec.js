import functions from '../src/functions.js';
// 不能写 _ 代替 (), 只要有一个参数 test 就会异步调用
test('测试',() => {
  // .not 修饰 当值不等于某值
  expect(functions.sum(2, 2)).not.toBe(10);
  // expect(functions.backObj([1], [2])).toBe({a:[1],b:[2]}); // 只能判断简单类型
  expect(functions.backObj([1], [2])).toEqual({a:[1],b:[2]}); // toEqual 会递归判断值是否相等
  expect(functions.getArr([1,2,3])).toHaveLength(3); // toHaveLength 判断数组或字符串的长度
  expect(functions.getArr('123')).toHaveLength(3); // toHaveLength 判断数组或字符串的长度
})
