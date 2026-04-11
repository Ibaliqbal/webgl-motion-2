import Canvas from "./module/canvas";
import Preloader from "./module/preloader";

class App {
  constructor() {
    this.init();
  }

  init() {
    this.createCanvas();
    this.createPreloader();
    this.onResize();
    this.addEventListeners();
    this.render();
  }

  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.once("done", () => {
      this.onPreloadDone();
    });
  }

  createCanvas() {
    this.canvas = new Canvas();
  }

  render() {
    this.canvas.render();

    requestAnimationFrame(this.render.bind(this));
  }

  onPreloadDone() {
    this.canvas.load();
    this.onResize();
  }

  onWheel(event) {
    this.canvas?.onWheel(event);
  }

  onResize() {
    this.canvas?.onResize();
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
