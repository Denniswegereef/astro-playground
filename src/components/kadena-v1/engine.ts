import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const ENABLE_ORBIT_CONTROLS = true

export class Engine {
  // Public
  scene?: THREE.Scene
  camera?: THREE.PerspectiveCamera
  renderer?: THREE.WebGLRenderer
  clock?: THREE.Clock
  tickHandlers: Function[]
  controls?: OrbitControls

  //
  container: HTMLElement
  width: number
  height: number
  isPlaying: boolean

  constructor() {
    this.container = document.querySelector<HTMLElement>(
      "[data-container-element]"
    ) as HTMLElement

    this.width = 0
    this.height = 0

    this.isPlaying = true

    this.tickHandlers = []

    if (!this.container) return

    this._setSizes()
    this._createTime()
    this._initScene()
    this._createRenderer()
    this._createCamera()
    if (ENABLE_ORBIT_CONTROLS) this._createOrbitControls()
    this._resize()
    this._appendToDom()
    this._addEventListeners()
  }

  _setSizes() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
  }

  _createTime() {
    this.clock = new THREE.Clock()
  }

  _initScene() {
    this.scene = new THREE.Scene()
  }

  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0x1e1826, 1)
  }

  _createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    this.camera.position.z = 3.5
  }

  _createOrbitControls() {
    if (!this.camera || !this.renderer) return

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
  }

  _resize() {
    if (!this.renderer || !this.camera) return

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  _appendToDom() {
    if (!this.renderer) return

    this.container.appendChild(this.renderer.domElement)
  }

  _addEventListeners() {
    // ALSO TRIGGER RESIZE EVENT HERE

    window.addEventListener("resize", () => {
      this._setSizes()
      this._resize()
    })
  }

  // PUBLIC
  addTickHandler(fn: Function) {
    this.tickHandlers.push(fn)
  }

  render() {
    if (!this.isPlaying) return
    if (!this.renderer || !this.scene || !this.camera || !this.clock) return

    requestAnimationFrame(() => this.render())

    // Get the elapsed time
    const elapsedTime = this.clock.getElapsedTime()

    // Pass the elapsed time to each tick handler
    this.tickHandlers.forEach((handler) => handler(elapsedTime))

    if (ENABLE_ORBIT_CONTROLS && this.controls) this.controls.update()

    this.renderer.render(this.scene, this.camera)
  }

  // Interactions
  play() {
    if (!this.isPlaying) {
      this.render()
      this.isPlaying = true
    }
  }

  pause() {
    this.isPlaying = false
  }

  dispose() {
    if (!this.scene || !this.camera || !this.renderer) return
    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key]

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose()
          }
        }
      }
    })

    // Should be orbitControls eventually
    // this.camera.controls.dispose();
    this.renderer.dispose()

    // if (this.debug.active) this.debug.ui.destroy();
  }
}

export const engine = new Engine()
