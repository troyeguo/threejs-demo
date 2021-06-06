import * as THREE from "three";
import { gsap } from "gsap";
import Sizes from "../util/Sizes";
import Time from "../util/Time";
import World from "./World";
import Camera from "./Camera";
import Resources from "./Resource";
export default class Application {
  /**
   * Constructor
   */
  constructor(_option) {
    // Options
    this.$canvas = _option.$canvas;
    // Set up
    this.time = new Time();
    this.sizes = new Sizes();
    this.resources = new Resources();
    this.resources.on("ready", () => {
      this.setConfig();
      this.setDebug();
      this.setRenderer();
      this.setCamera();
      // this.setModel();
      this.setWorld();
    });
  }

  /**
   * Set config
   */
  setConfig() {
    this.config = {};
    this.config.debug = window.location.hash === "#debug";
    this.config.cyberTruck = window.location.hash === "#cybertruck";
    this.config.touch = false;
    this.config.count = 200000;
    this.config.size = 0.005;
    this.config.radius = 5;
    this.config.branches = 3;
    this.config.spin = 1;
    this.config.randomness = 0.2;
    this.config.randomnessPower = 3;
    this.config.insideColor = "#ff6030";
    this.config.outsideColor = "#1b3984";
  }

  /**
   * Set debug
   */
  setDebug() {
    if (this.config.debug) {
      this.debug = new dat.GUI();
    }
  }

  /**
   * Set renderer
   */
  setRenderer() {
    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    this.renderer.setSize(
      this.sizes.viewport.width,
      this.sizes.viewport.height
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Resize event
    this.sizes.on("resize", () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      );
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    this.time.on("tick", () => {
      this.renderer.render(this.scene, this.camera.instance);
    });
  }

  /**
   * Set camera
   */
  setCamera() {
    this.camera = new Camera({
      time: this.time,
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
      config: this.config,
    });

    this.scene.add(this.camera.container);
  }
  /**
   * Set world
   */
  setWorld() {
    this.world = new World({
      config: this.config,
      debug: this.debug,
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
      renderer: this.renderer,
      resources: this.resources,
    });
    this.scene.add(this.world.container);
  }
}
