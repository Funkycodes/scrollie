import { clamp, lerp } from "../lib/utils/maths.js";
import UniRaf from "../classes/Uniraf.js";
export default class {
  #scroll;
  #element;
  #pointer;
  #trigger;
  #wrapper;
  #blockers;
  #disabled;
  #callbacks;
  /**
   * @param {Object} props
   * @param {HTMLElement} props.element
   * @param {Array<string>} [props.blockers=["no-scroll"]]
   * @param {number} [props.speed=1]
   * @param {number} [props.easing=0.1]
   * @param {HTMLElement} [props.trigger=window]
   */
  constructor ({
    element,
    blockers = [ "no-scroll" ],
    speed = 1,
    easing = 0.1,
    trigger = window
  }) {
    this.#blockers = blockers;
    this.#trigger = trigger;
    this.#element = element;

    this.#wrapper = this.#element.children[ 0 ];
    this.#callbacks = [];
    this.#scroll = {
      current: 0,
      target: 0,
      easing,
      limit: 0,
      speed
    };
    this.#pointer = {
      isDown: false,
      y: 0,
      position: 0
    };
    this.#disabled = false;

    this.nav = this.#wrapper.querySelector("nav");


    this.#addObserver();
    this.#addEventListeners();
    new UniRaf().add(this.update.bind(this));
  }

  /***  Getters  ***/
  get scroll() {
    return this.#scroll.current;
  }
  get limit() {
    return this.#scroll.limit;
  }
  get progress() {
    return this.#scroll.current / this.#scroll.limit;
  }
  get disabled() {
    return this.#disabled;
  }

  /**
   * 
   * @param {({scroll, limit, progress}) => {}} fn 
   */
  onScroll(fn) {
    this.#callbacks.push(fn);
  }

  /**
   * 
   * @param {WheelEvent} e
   */
  #onWheel({ deltaY }) {
    if (this.#blockers.some(b => document.documentElement.classList.contains(b)) || this.#disabled) return;

    this.#scroll.target += deltaY * this.#scroll.speed;
  }

  /**
   * @param {TouchEvent} e 
   */
  #onTouchStart(e) {
    if (this.#blockers.some(b => document.documentElement.classList.contains(b)) || this.#disabled) return;
    this.#pointer.isDown = true;
    this.#pointer.y = e.touches ? e.touches[ 0 ].clientY : e.clientY;
    this.#pointer.position = this.#scroll.current;
  }

  /**
   * @param {TouchEvent} e 
   * @returns 
   */
  #onTouchMove(e) {
    if (!this.#pointer.isDown) return;
    const y = e.touches ? e.touches[ 0 ].clientY : e.clientY;
    const dist = this.#pointer.y - y;

    this.#scroll.target = this.#pointer.position + (dist * 3);
  }

  #onTouchEnd() {
    this.#pointer.isDown = false;
  }

  #onResize() {
    this.#scroll.limit = this.#wrapper.clientHeight - this.#element.clientHeight;
  }

  #addEventListeners() {
    this.#trigger.addEventListener('wheel', this.#onWheel.bind(this));

    this.#trigger.addEventListener('touchstart', this.#onTouchStart.bind(this));
    this.#trigger.addEventListener('touchmove', this.#onTouchMove.bind(this));
    this.#trigger.addEventListener('touchend', this.#onTouchEnd.bind(this));

    this.#trigger.addEventListener('mousedown', this.#onTouchStart.bind(this));
    this.#trigger.addEventListener('mousemove', this.#onTouchMove.bind(this));
    this.#trigger.addEventListener('mouseup', this.#onTouchEnd.bind(this));
  }

  #addObserver() {
    this.observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.#onResize();
      }
    });
    this.observer.observe(this.#wrapper);
  }

  start() {
    this.#disabled = false;
  }
  stop() {
    this.#disabled = true;
  }


  update() {
    // calculate values
    this.#scroll.target = clamp(0, this.#scroll.limit, this.#scroll.target);
    if (Math.abs(this.#scroll.current - this.#scroll.target) <= 0.1)
      this.#scroll.current = this.#scroll.target;
    this.#scroll.current = lerp(this.#scroll.current, this.#scroll.target, this.#scroll.easing);

    //callbacks
    this.#callbacks.forEach(fn => fn({ scroll: this.scroll, limit: this.limit, progress: this.progress }));

    // scroll
    this.#wrapper.style.transform = `translate3d(0, -${this.#scroll.current}px, 0)`;
    this.nav.style.transform = `translate3d(0, ${this.#scroll.current}px, 0)`;
  }
}