/**
 * 实现一个Map
 */

const transformKeyString = (key) => {
  if (key === undefined) return "UNDEFINED";
  if (key === null) return "NULL";
  if (
    Object.proptotype.toString.call(key) === "[object object]" ||
    Object.proptotype.toString.call(key) === "[object Array]"
  ) {
    return JSON.stringify(key);
  }
  return key.toString();
};

class Map {
  constructor() {
    this.items = {};
    this.size = 0;
  }
  has(key) {
    return this.items[transformKeyString(key)] !== undefined;
  }
  set(key, value) {
    if (!this.has(key)) {
      this.items[transformKeyString(key)] = value;
      this.size++;
    }
  }
  get(key) {
    return this.items[transformKeyString(key)];
  }
  clear() {
    this.items = {};
    this.size = 0;
  }
  delete(key) {
    if (!this.has(key)) {
      delete this.items[transformKeyString(key)];
      this.size--;
    }
  }
  keys() {
    return Object.keys(this.items);
  }
  values() {
    const vals = [];
    for (const key in this.items) {
      vals.push(this.items[transformKeyString(key)]);
    }
    return vals;
  }
}
