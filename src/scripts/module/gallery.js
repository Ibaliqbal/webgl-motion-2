import Mesh from "./mesh";
import * as THREE from "three";
import gsap from "gsap";
import { lerp } from "three/src/math/MathUtils.js";

function getTheta(index, length) {
  return (index / length) * Math.PI * 2;
}

const assets = [
  {
    id: "img__1",
    url: "/images/image-1.jpg",
  },
  {
    id: "img__2",
    url: "/images/image-2.jpg",
  },
  {
    id: "img__3",
    url: "/images/image-3.jpg",
  },
  {
    id: "img__4",
    url: "/images/image-4.jpg",
  },
  {
    id: "img__5",
    url: "/images/image-5.jpg",
  },
  {
    id: "img__6",
    url: "/images/image-6.jpg",
  },
  {
    id: "img__7",
    url: "/images/image-7.jpg",
  },
  {
    id: "img__8",
    url: "/images/image-8.jpg",
  },
  {
    id: "img__9",
    url: "/images/image-9.jpg",
  },
  {
    id: "img__10",
    url: "/images/image-10.jpg",
  },
  {
    id: "img__11",
    url: "/images/image-11.jpg",
  },
  {
    id: "img__12",
    url: "/images/image-12.jpg",
  },
  {
    id: "img__13",
    url: "/images/image-13.jpg",
  },
  {
    id: "img__14",
    url: "/images/image-14.jpg",
  },
  {
    id: "img__15",
    url: "/images/image-15.jpg",
  },
  {
    id: "img__16",
    url: "/images/image-16.jpg",
  },
];

class Gallery {
  constructor({ viewport, screen, renderer, scene }) {
    this.isMobile = "ontouchstart" in document.documentElement;
    this.placeholder = document.querySelector(".item__placeholder");
    this.objects = [];
    this.viewport = viewport;
    this.screen = screen;
    this.renderer = renderer;
    this.scene = scene;
    this.lastElipsedTime = 0;
    this.groupScale = 0.85;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.elapsed = 0;
    this.canScroll = false;
    this.state = {
      targetY: 0,
      currentY: 0,
      targetDragY: 0,
      currentDragY: 0,
    };
    this.isDragging = false;

    this.createGeometry();
    this.createObjects();
    // this.createGUI();
  }

  show() {
    const timeline = gsap.timeline({
      onComplete: () => {
        this.canScroll = true;
      },
    });

    timeline.fromTo(
      this.group.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: this.groupScale,
        y: this.groupScale,
        z: this.groupScale,
        duration: 1,
        ease: "expo.inOut",
      },
    );

    timeline.to(
      this.objects.map((obj) => obj.mesh.position),
      {
        x: (index) => {
          const theta = getTheta(index, this.objects.length);
          return Math.cos(theta) * this.viewport.width * 0.225;
        },
        y: (index) => {
          const theta = getTheta(index, this.objects.length);
          return Math.sin(theta) * this.viewport.width * 0.225;
        },
        z: 0,
        duration: 2,
        stagger: {
          from: "end",
          each: 0.05,
        },
        ease: "expo.inOut",
      },
    );

    timeline.to(
      this.objects.map((obj) => obj.mesh.position),
      {
        x: (index) => {
          const theta = getTheta(index, this.objects.length);
          return Math.cos(theta) * this.viewport.width * 0.225;
        },
        y: 0,
        z: (index) => {
          const theta = getTheta(index, this.objects.length);
          return Math.sin(theta) * this.viewport.width * 0.225;
        },
        duration: 1.35,
        stagger: {
          from: "start",
          each: 0.015,
        },
        ease: "power2.inOut",
      },
    );

    timeline.to(
      this.objects.map((obj) => obj.mesh.rotation),
      {
        y: (index) => {
          const theta = getTheta(index, this.objects.length);
          return Math.atan2(
            Math.cos(theta) * this.viewport.width * 0.225,
            Math.sin(theta) * this.viewport.width * 0.225,
          );
        },
        duration: 1.25,
        stagger: {
          from: "start",
          each: 0.015,
        },
        ease: "power2.inOut",
      },
      "<+=0.15",
    );

    timeline.to(
      this.group.scale,
      {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 1.5,
        ease: "power3.inOut",
      },
      "<+=0.15",
    );

    timeline
      .fromTo(
        this.group.rotation,
        {
          y: -Math.PI * 6,
        },
        {
          duration: 2,
          ease: "expo.inOut",
          y: 0,
        },
        "<",
      )
      .timeScale(0.75);

    return timeline;
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 16, 16);
  }

  createObjects() {
    const items = [...assets];
    items.forEach((asset, index) => {
      const texture = window.GL_TEXTURES.find((t) => t.id === asset.id);
      if (texture) {
        let mesh = new Mesh({
          geometry: this.geometry,
          scene: this.group,
          viewport: this.viewport,
          screen: this.screen,
          item: this.placeholder,
          index,
          length: items.length,
          texture,
          radius: this.viewport.width * 0.225,
        });
        this.objects.push(mesh);
      } else {
        console.warn(`Texture with id ${asset.id} not found.`);
      }
    });
  }

  // createGUI() {
  //   this.gui = new GUI();
  //   this.gui.add(this.params, "rotationYSpeed", 0.05, 0.75, 0.011);
  //   this.gui.add(this.params, "direction", ["Right", "Left"]);
  // }

  onResize({ viewport, screen }) {
    this.viewport = viewport;
    this.screen = screen;

    this.objects.forEach((object) => {
      object?.onResize({
        viewport: this.viewport,
        screen: this.screen,
      });
    });
  }

  onWheel(e) {
    if (!this.canScroll) return;
    this.state.targetY -= e.deltaY * 0.0015;
  }

  render(time) {
    let t = time - this.lastElipsedTime;
    this.lastElipsedTime = time;

    t = Math.min(t, 0.016);

    this.state.currentY = lerp(this.state.currentY, this.state.targetY, 0.07);

    gsap.set(this.group.rotation, { y: this.state.currentY });

    this.elapsed += t;

    this.objects.forEach((object) => object?.render(this.elapsed));
  }
}

export default Gallery;
