import * as THREE from "three"
import { engine } from "../../engine"
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js"

const ANIMATION_NAME = "animation_0"

export class ConeModel {
  material: THREE.MeshBasicMaterial
  loader: GLTFLoader
  mesh: THREE.Mesh | null = null
  scene: THREE.Group | null = null
  textureLoader: THREE.TextureLoader
  scrollProgress: number = 0
  increasing: boolean = true
  groups: THREE.Group[] | null = null
  mixer: THREE.AnimationMixer | null = null
  totalDuration = 0
  mouseMoveProgressX = 0
  mouseMoveProgressY = 0
  directionalLight: THREE.DirectionalLight | null = null
  ambientLight: THREE.AmbientLight | null = null
  mousedown = false
  mouseDownTime = 0

  constructor() {
    this.loader = new GLTFLoader()

    this.material = new THREE.MeshBasicMaterial({
      color: "blue",
      wireframe: true,
    })
    this.textureLoader = new THREE.TextureLoader()

    this._bindEvents()

    Promise.all([
      new Promise<GLTF>((resolve, reject) => {
        this.loader.load(
          "./models/cone-bricks.gltf",
          (model) => resolve(model),
          undefined,
          (error) => reject(error)
        )
      }),
    ])
      .then(([model]) => {
        this._addModel(model)
        this._createLights()

        // Start the tick handler
        engine.addTickHandler((args: tickHandler) => this._tick(args))
      })
      .catch((error) => {
        console.log("Error loading assets:", error)
      })
  }

  _bindEvents() {
    window.addEventListener("mousemove", (event) => {
      this.mouseMoveProgressX = event.clientX / engine.width
      this.mouseMoveProgressY = event.clientY / engine.height
    })

    window.addEventListener("mousedown", () => {
      console.log("mousedown")
      this.mousedown = true
    })

    window.addEventListener("mouseup", () => {
      console.log("mouseup")
      this.mousedown = false
    })
  }

  _createLights() {
    if (!engine.scene) return

    this.directionalLight = new THREE.DirectionalLight(0xffffff)
    this.ambientLight = new THREE.AmbientLight(0x404040)

    this.directionalLight.position.set(3, 3, 0)
    engine.scene.add(this.directionalLight)
    engine.scene.add(this.ambientLight)
  }

  _addModel(mesh: GLTF) {
    if (!engine.scene) return

    const material = new THREE.MeshStandardMaterial({
      color: "#ed098f",
      roughness: 0.5,
    })

    // Animation mixer things
    this.mixer = new THREE.AnimationMixer(mesh.scene)
    const clips = mesh.animations
    const clip = THREE.AnimationClip.findByName(clips, ANIMATION_NAME)
    const action = this.mixer.clipAction(clip)
    action.enabled = true

    this.totalDuration = action.getClip().duration

    action.play()

    this.scene = mesh.scene

    this.scene.traverse((o) => {
      const obj = o as THREE.Mesh
      obj.material = material
    })

    engine.scene.add(this.scene)
  }

  _tick({ elapsedTime, deltaTime }: tickHandler) {
    if (!this.mixer) return

    const progress = (Math.sin(elapsedTime) + 1) * 0.5

    if (this.mousedown) {
      this.mouseDownTime = Math.min(this.mouseDownTime + 0.01, 1)
    } else {
      this.mouseDownTime = Math.max(0, this.mouseDownTime - 0.01)
    }

    const currentMixertime = this.totalDuration * this.mouseMoveProgressX
    this.directionalLight?.position.set(
      this.mouseMoveProgressX * 10,
      this.mouseMoveProgressY * 10,
      3
    )

    if (this.ambientLight)
      this.ambientLight.intensity =
        0.5 + this.mouseMoveProgressY * this.mouseMoveProgressX * 3

    this.mixer.setTime(currentMixertime * this.mouseDownTime)
    this.mixer.update(deltaTime)
  }

  // Public
  setModel() {
    if (!engine.scene) return

    // engine.scene.add(this.mesh)
  }
}
