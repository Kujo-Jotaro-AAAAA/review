class EventEmitter {
  constructor() {
    this.cache = {};
  }
  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn);
    } else {
      this.cache[name] = [fn];
    }
  }
  off(name, fn) {
    if (!this.cache[name]) return;
    const idx = this.cache[name].findIndex((f) => f === fn);
    this.cache[name].splice(idx, 1);
  }
  emit(name, once = false, ...args) {
    if (this.cache[name]) {
      // 取出副本, 执行所有函数
      const task = this.cache[name].slice();
      task.forEack((f) => f(...args));
      if (once) {
        Reflect.deleteProperty(this.cache, name);
      }
    }
  }
}
