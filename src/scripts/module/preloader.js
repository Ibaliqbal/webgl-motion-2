import * as THREE from "three";
import EventEmitter from "events";

const assetsImage = [
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

class Preloader extends EventEmitter {
  constructor() {
    super();

    this.loadTexture();
  }

  loadTexture() {
    window.GL_TEXTURES = [];
    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    this.loadingManager.onLoad = () => {
      this.emit("done");
    };

    assetsImage.forEach((asset) => {
      this.textureLoader.load(asset.url, (texture) => {
        const data = {
          id: asset.id,
          texture,
        };
        window.GL_TEXTURES.push(data);
      });
    });
  }
}

export default Preloader;
