let instance = null;

export default class UniRaf {
  constructor () {
    if (instance) return instance;
    this.callbacks = [];
    instance = this;
    this.now = performance.now();
    requestAnimationFrame(this.update.bind(this));
  }
  add(cb) {
    this.callbacks.push(cb);
    return () => { this.remove(cb); };
  }
  remove(cb) {
    this.callbacks = this.callbacks.filter(fn => fn !== cb);
  }
  update(now) {
    const delta = (now - this.now); // 0 on first render
    this.now = now;
    this.callbacks.forEach(cb => cb(delta, now)); // pass seconds not milliseconds
    requestAnimationFrame(this.update.bind(this));
  }
}