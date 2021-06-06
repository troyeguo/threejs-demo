import * as THREE from "three";
import Sounds from "./Sounds";
import { TweenLite } from "gsap";
export default class {
  constructor(_options) {
    // Options
    this.config = _options.config;
    this.debug = _options.debug;
    this.resources = _options.resources;
    this.time = _options.time;
    this.sizes = _options.sizes;
    this.camera = _options.camera;
    this.renderer = _options.renderer;
    this.currentModel = 0;
    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder("world");
      this.debugFolder.open();
    }
    document.addEventListener(
      "mousewheel",
      (_event) => {
        console.log("object", this.currentModel);
        if (_event.deltaY > 0) {
          this.currentModel += 1;
        } else {
          this.currentModel -= 1;
        }
        this.setTarget();
      },
      { passive: true }
    );
    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;
    this.init();
    this.setShape();

    this.setAxes();
    this.setSounds();

    // this.setControls();
  }
  init() {
    this.situations = [
      { name: "cube", position: new THREE.Vector3(0, 0, 0) },
      { name: "cone", position: new THREE.Vector3(15, 15, 15) },
      { name: "sphere", position: new THREE.Vector3(29, 10, 29) },
    ];
  }
  setTarget() {
    console.log(this.camera, this.situations[this.currentModel].position);
    TweenLite.to(this.camera.instance.position, 2, {
      x: this.situations[this.currentModel].position.x + 10,
      y: this.situations[this.currentModel].position.y + 10,
      z: this.situations[this.currentModel].position.z + 10,
    });
    // this.camera.instance.position.set(
    //   this.situations[this.currentModel].position.x + 10,
    //   this.situations[this.currentModel].position.y + 10,
    //   this.situations[this.currentModel].position.z + 10
    // );
  }
  setSounds() {
    this.sounds = new Sounds({
      debug: this.debugFolder,
      time: this.time,
    });
  }
  setModel() {
    this.container.clear();
    this.mixer = new THREE.AnimationMixer(
      this.resources.items.model.scenes[this.currentModel]
    );

    this.idleAction = this.mixer.clipAction(
      this.resources.items.model.animations[this.currentModel]
    );
    this.container.add(this.resources.items.model.scenes[this.currentModel]);

    this.idleAction.play();
    console.log(this.time.delta);

    this.time.on("tick", () => {
      this.mixer.update(this.time.delta);
    });
    let muteButton = document.querySelector(".mute-button");
    muteButton.setAttribute("style", "position:absolute");
    muteButton.addEventListener("click", () => {
      console.log("test");
      this.sounds.play("helloSound");
    });
  }
  setShape() {
    /**
     * Textures
     */
    const bakedTexture = this.resources.items.bakeTexture;
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;

    /**
     * Materials
     */
    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

    this.situations.forEach((situation) => {
      const mixer = new THREE.AnimationMixer(
        this.resources.items[situation.name].scenes[0]
      );
      this.resources.items[situation.name].scene.children.forEach((mesh) => {
        mesh.material = bakedMaterial;
      });
      this.resources.items[situation.name].scenes[0].position.copy(
        situation.position
      );
      const idleAction = mixer.clipAction(
        this.resources.items[situation.name].animations[0]
      );
      this.container.add(this.resources.items[situation.name].scenes[0]);
      idleAction.play();

      this.time.on("tick", () => {
        mixer.update(this.time.delta);
      });
    });
    // this.container.clear();
    console.log(this.resources.items);
    let muteButton = document.querySelector(".mute-button");
    muteButton.setAttribute("style", "position:absolute");
    muteButton.addEventListener("click", () => {
      console.log("test");
      this.sounds.play("helloSound");
    });
  }
  setAxes() {
    this.axis = new THREE.AxesHelper();
    this.container.add(this.axis);
  }
}
