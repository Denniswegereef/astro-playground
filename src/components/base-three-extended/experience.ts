import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ExperienceArguments {
  domElement: HTMLElement;
}

export class Experience {
  scene: THREE.Scene;
  container: HTMLElement;
  width: number;
  height: number;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  isPlaying: boolean;

  delta?: number;
  material?: THREE.ShaderMaterial;

  settings?: {
    progress: number;
  };

  gui?: dat.GUI;

  constructor(options: ExperienceArguments) {
    this.scene = new THREE.Scene();

    this.container = options.domElement;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.clock = new THREE.Clock();

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // const frustumSize = 10;
    // this.aspectRatio = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera(
    //   (frustumSize * this.aspectRatio) / -2,
    //   (frustumSize * this.aspectRatio) / 2,
    //   frustumSize / 2,
    //   frustumSize / -2,
    //   -1000,
    //   1000
    // );

    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.isPlaying = true;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.createSettings();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      // extensions: "#extension GL_OES_standard_derivatives : enable",
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector4() },
        uProgress: { value: 0 },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    // this.geometry = new THREE.PlaneGeometry(
    //   this.width / ((2 - this.aspectRatio) * 100),
    //   this.height / ((2 - this.aspectRatio) * 100),
    //   1,
    //   1
    // );

    const geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
    const plane = new THREE.Mesh(geometry, this.material);

    this.scene.add(plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying || !this.material) return;
    this.delta = this.clock.getElapsedTime();

    this.material.uniforms.uTime.value = this.delta;

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  createSettings() {
    if (!this.material) return;

    this.settings = {
      progress: 0,
    };

    this.gui = new dat.GUI();

    this.gui
      .add(
        {
          add: () => {
            this._emitEvent();
          },
        },
        "add"
      )
      .name("Trigger event");
    this.gui.add(this.material.uniforms.uProgress, "value", 0, 1, 0.01);
  }

  _emitEvent() {
    console.log("emit");
  }
}
