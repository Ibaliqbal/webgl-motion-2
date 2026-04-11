import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

class Mesh {
  constructor({
    item,
    geometry,
    scene,
    viewport,
    screen,
    index,
    length,
    texture,
    radius,
  }) {
    this.item = item;
    this.geometry = geometry;
    this.scene = scene;
    this.viewport = viewport;
    this.screen = screen;
    this.index = index;
    this.length = length;
    this.texture = texture;
    this.radius = radius;

    this.createProgram();
    this.createMesh();
  }

  createProgram() {
    this.material = new THREE.MeshBasicMaterial({
      color: "#cacaca",
      side: THREE.DoubleSide,
      transparent: true,
    });
    this.shader = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(1, 1),
        },
        uImageResolution: {
          value: new THREE.Vector2(
            this.texture.texture.source?.data.naturalWidth,
            this.texture.texture.source?.data.naturalHeight,
          ),
        },
        uTexture: {
          value: this.texture.texture,
        },
        uAlpha: {
          value: 1,
        },
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.shader);
    this.item || this.mesh.scale.set(1, 1, 1);
    this.scene.add(this.mesh);
  }

  createBounds() {
    const { width, height, top, left } = this.item.getBoundingClientRect();
    this.bounds = {
      width,
      height,
      top: top + window.pageYOffset,
      left,
    };
  }

  updateScale() {
    this.width = this.bounds.width / this.screen.width;
    this.height = this.bounds.height / this.screen.height;
    this.plane = {
      width: this.viewport.width * this.width,
      height: this.viewport.height * this.height,
    };
    this.mesh.scale.set(this.plane.width, this.plane.height);
    this.shader.uniforms.uResolution.value.set(
      this.plane.width,
      this.plane.height,
    );
  }

  onResize({ viewport, screen }) {
    this.viewport = viewport;
    this.screen = screen;
    if (this.item) {
      this.createBounds();
      this.updateScale();
    } else {
      this.mesh.scale.set(1, 1, 1);
    }
  }

  render(time) {}
}

export default Mesh;
