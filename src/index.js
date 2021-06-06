import "./theme/styles.scss";
import "./theme/reset.scss";
import Application from "./canvas";
// import Welcome from "./pages/Welcome";

class Main {
  constructor() {
    this.application = new Application({
      $canvas: document.querySelector(".webgl"),
      useComposer: true,
    });

    // Listen to mousewheel event
  }
}

new Main();
