import * as THREE from "three";

import Loader from "../util/Loader.js";
import EventEmitter from "../util/EventEmitter.js";
import ModelSource from "../../static/assets/models/career_desk_busstation_jogger_remotefence_kitchen_sofa_remote-draco.glb";
import cubeSource from "../../static/assets/models/cube.glb";
import coneSource from "../../static/assets/models/cone.glb";
import sphereSource from "../../static/assets/models/sphere.glb";
import bakedSource from "../../static/assets/models/cube.png";
export default class Resources extends EventEmitter {
  constructor() {
    super();

    this.loader = new Loader();
    this.items = {};

    this.loader.load([
      { name: "cube", source: cubeSource },
      { name: "cone", source: coneSource },
      { name: "sphere", source: sphereSource },
      { name: "bake", source: bakedSource, type: "texture" },
    ]);

    this.loader.on("fileEnd", (_resource, _data) => {
      this.items[_resource.name] = _data;

      // Texture
      if (_resource.type === "texture") {
        const texture = new THREE.Texture(_data);
        texture.needsUpdate = true;

        this.items[`${_resource.name}Texture`] = texture;
      }

      // Trigger progress
      this.trigger("progress", [this.loader.loaded / this.loader.toLoad]);
    });

    this.loader.on("end", () => {
      // Trigger ready
      this.trigger("ready");
    });
  }
}
