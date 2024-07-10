import Uniraf from "./Uniraf.js";
import { clamp } from "../lib/utils/maths.js";

export default class Delay {
  constructor (t, cb) {
    this.cb = cb;
    this.d = {
      e: 0,
      t
    };
    this.raf = new Uniraf();
    this.run();
  }
  run() {
    this.stop = this.raf.add(this.update.bind(this));
  }
  update(t) {
    this.d.e += t;
    this.d.e = clamp(0, this.d.t, this.d.e);
    console.log(this.d.e, t);
    1 === clamp(0, 1, this.d.e / this.d.t) && (this.cb(), this.stop());
  }
}