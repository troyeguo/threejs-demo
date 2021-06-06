import EventEmitter from "./EventEmitter.js";
import * as THREE from "three";

export default class Time extends EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.delta = 16;
    this.clock = new THREE.Clock();
    this.tick = this.tick.bind(this);
    this.tick();
  }

  /**
   * Tick
   */
  tick() {
    this.ticker = window.requestAnimationFrame(this.tick);

    this.delta = this.clock.getDelta();

    if (this.delta > 60) {
      this.delta = 60;
    }

    this.trigger("tick");
  }

  /**
   * Stop
   */
  stop() {
    window.cancelAnimationFrame(this.ticker);
  }
}
