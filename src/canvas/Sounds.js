import { Howl, Howler } from "howler";
import helloSound from "../../static/assets/sounds/voice_male_en_04.114614b6.mp3";

export default class Sounds {
  constructor(_options) {
    // Options
    this.time = _options.time;
    this.debug = _options.debug;

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder("sounds");
      // this.debugFolder.open()
    }

    // Set up
    this.items = [];

    // this.setSettings();
    this.setMasterVolume();
    this.setMute();
    // this.setEngine();
  }

  setMasterVolume() {
    // Set up
    this.masterVolume = 0.5;
    Howler.volume(this.masterVolume);

    window.requestAnimationFrame(() => {
      Howler.volume(this.masterVolume);
    });

    // Debug
    if (this.debug) {
      this.debugFolder
        .add(this, "masterVolume")
        .step(0.001)
        .min(0)
        .max(1)
        .onChange(() => {
          Howler.volume(this.masterVolume);
        });
    }
  }

  setMute() {
    // Set up
    this.muted = typeof this.debug !== "undefined";
    Howler.mute(this.muted);

    // M Key
    window.addEventListener("keydown", (_event) => {
      if (_event.key === "m") {
        this.muted = !this.muted;
        Howler.mute(this.muted);
      }
    });

    // Tab focus / blur
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        Howler.mute(true);
      } else {
        Howler.mute(this.muted);
      }
    });

    // Debug
    if (this.debug) {
      this.debugFolder
        .add(this, "muted")
        .listen()
        .onChange(() => {
          Howler.mute(this.muted);
        });
    }
  }

  play(_name) {
    var sound = new Howl({
      src: [helloSound],
    });

    sound.play();
  }
}
