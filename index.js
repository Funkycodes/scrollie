import Scrollie from "./components/Scrollie.js";
import { mapRange } from "./lib/utils/maths.js";

class App {
  constructor () {
    this.addEventListeners();
    this.initScrollie();
    this.onResize();
  }
  initScrollie() {
    this.scrollie = new Scrollie({ element: document.querySelector(".app") });
  }
  onResize() {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight / 100}px`);
  }
  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}

new App();