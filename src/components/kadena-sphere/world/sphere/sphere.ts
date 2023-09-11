import * as THREE from "three"
import { engine } from "../../engine"
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js"
import fragmentShader from "./_fragment.glsl"
import vertexShader from "./_vertex.glsl"
import gsap from "gsap"
import { GUI } from "dat.gui"

export class SphereModel {
  material: THREE.ShaderMaterial
  geometry: THREE.IcosahedronGeometry
  loader: GLTFLoader
  mesh: THREE.Mesh | null = null
  scene: THREE.Group | null = null
  mouseMoveProgressX = 0
  mouseMoveProgressY = 0
  uniforms: { [uniform: string]: THREE.IUniform }
  uniformsTwo: { [uniform: string]: THREE.IUniform } | null = null
  gui: GUI
  guiOptions: {
    [key: string]: number
  }

  constructor() {
    this.gui = new GUI()
    this.loader = new GLTFLoader()

    this.geometry = new THREE.IcosahedronGeometry(1, 64)

    this.uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 3 },
      uNoiseDensity: { value: 1.5 },
      uNoiseStrength: { value: 0.3 },
      uFreq: { value: 3 },
      uAmp: { value: 6 },
      uHue: { value: 0.5 },
      uOffset: { value: Math.PI * 0 },
      red: { value: 0 },
      green: { value: 0 },
      blue: { value: 0 },
      uAlpha: { value: 1.0 },
      uOutline: { value: false },
    }

    this.uniformsTwo

    this.guiOptions = {
      progress: 0,
    }

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      wireframe: false,
      transparent: true,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this._bindEvents()
  }

  _bindEvents() {
    window.addEventListener("mousemove", (event) => {
      this.mouseMoveProgressX = event.clientX / engine.width
      this.mouseMoveProgressY = event.clientY / engine.height
    })
  }

  _tick({ elapsedTime, deltaTime }: tickHandler) {
    this.uniforms.uTime.value = elapsedTime

    if (this.uniformsTwo) {
      this.uniformsTwo.uTime.value = elapsedTime
    }
  }

  // Public
  setModel() {
    if (!engine.scene || !this.mesh) return

    this.uniformsTwo = {
      uTime: { value: 0 },
      uSpeed: { value: 3 },
      uNoiseDensity: { value: 0 },
      uNoiseStrength: { value: 0 },
      uFreq: { value: 3 },
      uAmp: { value: 6 },
      uHue: { value: 0.5 },
      uOffset: { value: Math.PI * 0 },
      red: { value: 0 },
      green: { value: 0 },
      blue: { value: 0 },
      uAlpha: { value: 1.0 },
      uOutline: { value: true },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniformsTwo,
      wireframe: false,
      transparent: true,
    })

    const mesh = new THREE.Mesh(this.geometry, material)

    mesh.position.set(0, 0, 0)
    mesh.material.side = THREE.BackSide
    mesh.scale.multiplyScalar(1.05)

    // console.log((newmesh.material.uniforms.uOutline.value = true))

    // newmesh.material.uniforms.uColor.value = 1.0

    engine.scene.add(this.mesh)
    engine.scene.add(mesh)

    const timeline = gsap.timeline({})

    timeline.from(
      this.mesh.scale,
      {
        duration: 1.3,
        ease: "elastic.out(1, 0.9)",
        x: 0,
        y: 0,
        z: 0,
      },
      "0.3"
    )

    engine.addTickHandler((args: tickHandler) => this._tick(args))
    this._addGui()
  }

  _createControls() {}

  _addGui() {
    const uniformsFolder = this.gui.addFolder("Uniforms")
    uniformsFolder.add(this.uniforms.uSpeed, "value", 0, 10).name("Speed")
    uniformsFolder
      .add(this.uniforms.uNoiseDensity, "value", 0, 10)
      .name("Noise Density")
    uniformsFolder
      .add(this.uniforms.uNoiseStrength, "value", 0, 1)
      .name("Noise Strength")
    uniformsFolder.add(this.uniforms.uFreq, "value", 0, 10).name("Frequency")
    uniformsFolder.add(this.uniforms.uAmp, "value", 0, 10).name("Amplitude")
    uniformsFolder.add(this.uniforms.uHue, "value", 0, 1).name("Hue")
    uniformsFolder
      .add(this.uniforms.uOffset, "value", 0, Math.PI * 2)
      .name("Offset")

    uniformsFolder.open()
  }
}
