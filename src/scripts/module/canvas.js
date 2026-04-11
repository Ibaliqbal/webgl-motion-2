import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Gallery from "./gallery";

class Canvas {
  constructor() {
    this.canvas = document.querySelector("#webgl");

    this.cameraZ = 20;

    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      aspect: window.innerWidth / window.innerHeight,
    };

    this.clock = new THREE.Clock();

    this.createScene();
    this.createCamera();
    this.createRenderer();

    // this.setupControls();
    this.setupGridHelper();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.scene.add(this.camera);

    this.camera.position.z = this.cameraZ;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.canvas,
    });

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.render(this.scene, this.camera);

    this.renderer.setPixelRatio(this.screen.pixelRatio);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
  }

  setupGridHelper() {
    const size = 100;
    const division = 100;

    this.gridHelper = new THREE.GridHelper(size, division);
    // this.scene.add(this.gridHelper);
  }

  createGallery() {
    this.gallery = new Gallery({
      viewport: this.viewport,
      screen: this.screen,
      renderer: this.renderer,
      scene: this.scene,
    });
    this.gallery.show();
  }

  load() {
    this.createGallery();
  }

  onResize() {
    this.screen.width = window.innerWidth;
    this.screen.height = window.innerHeight;
    this.screen.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.screen.aspect = window.innerWidth / window.innerHeight;

    // Resize renderer
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(this.screen.pixelRatio);

    // Resize camera
    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();
    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      width,
      height,
    };

    this.gallery?.onResize({ viewport: this.viewport, screen: this.screen });
  }

  onWheel(event) {
    this.gallery?.onWheel(event);
  }

  render() {
    const t = this.clock.getElapsedTime();

    this.renderer.render(this.scene, this.camera);

    this.gallery?.render(t);

    // this.controls.update();
  }
}

export default Canvas;
