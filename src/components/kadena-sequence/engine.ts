import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {
  ENABLE_GUI,
  ENABLE_ORBIT_CONTROLS,
  ENABLE_STATS,
  EVENT,
} from "./settings"
import Stats from "three/examples/jsm/libs/stats.module.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js"
import { RenderPass } from "three/addons/postprocessing/RenderPass.js"
import effectRenderPassFragment from "./shaders/effectRenderPassFragment.glsl"
import effectRenderPassVertex from "./shaders/effectRenderPassVertex.glsl"
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js"
import { GUI } from "dat.gui"
import Events from "@/utilities/events"

const ENABLE_EFFECTS = true

export class Engine {
  // Public
  scene?: THREE.Scene
  camera?: THREE.PerspectiveCamera
  renderer?: THREE.WebGLRenderer
  clock?: THREE.Clock
  tickHandlers: Function[]
  controls?: OrbitControls
  stats: Stats[] = []
  effectComposer?: EffectComposer
  customPass: ShaderPass | null = null
  raycaster: THREE.Raycaster | null = null
  raycasterPointer: THREE.Vector2 | null = null
  container: HTMLElement
  width: number
  height: number
  isPlaying: boolean
  prevTime: number = 0

  uniforms: Uniforms
  gui: GUI | null = null
  worldGuiFolder: GUI | null = null

  constructor() {
    this.container = document.querySelector<HTMLElement>(
      "[data-container-element]"
    ) as HTMLElement

    this.width = 0
    this.height = 0

    this.isPlaying = true

    this.uniforms = {
      uNoiseAmount: { value: 0.15 },
      uTime: { value: 0 },
      tDiffuse: { value: null },
    }

    this.tickHandlers = []

    if (!this.container) return

    this.gui = ENABLE_GUI ? new GUI() : null

    this._setSizes()
    this._createTime()
    this._initScene()
    this._createRenderer()
    this._createCamera()
    this._createRaycaster()
    if (ENABLE_EFFECTS) this._createEffectComposer()
    if (ENABLE_ORBIT_CONTROLS) this._createOrbitControls()
    if (ENABLE_STATS) this._createStats()
    this._resize()
    this._appendToDom()
    this._addEventListeners()
    if (ENABLE_GUI) this._setControls()
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
    this.renderer.setClearColor(0x1e9e3f1, 1)

    THREE.ColorManagement.enabled = false

    // After instantiating the renderer
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  }

  _createEffectComposer() {
    if (!this.renderer || !this.scene || !this.camera) return

    this.effectComposer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(this.scene, this.camera)

    this.effectComposer.addPass(renderPass)

    const myEffect = {
      uniforms: this.uniforms,
      vertexShader: effectRenderPassVertex,
      fragmentShader: effectRenderPassFragment,
    }

    this.customPass = new ShaderPass(myEffect)
    this.customPass.renderToScreen = true

    this.effectComposer.addPass(this.customPass)
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

  _createRaycaster() {
    this.raycaster = new THREE.Raycaster()
    // High value because we don't want to intersect right away
    this.raycasterPointer = new THREE.Vector2(10, 10)
  }

  _createOrbitControls() {
    if (!this.camera || !this.renderer) return

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enableZoom = false
  }

  _createStats() {
    this.stats.push(new Stats())
    // this.stats.push(new Stats())
    // this.stats.push(new Stats())

    this.stats[0].showPanel(0)
    // this.stats[1].showPanel(1)
    // this.stats[2].showPanel(2)

    this.stats.forEach((stat, index) => {
      this.container.appendChild(stat.dom)
      stat.dom.style.cssText = `position:absolute;top:0px;left:${85 * index}px;`
    })
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

    window.addEventListener("pointermove", (event) => {
      if (!this.raycasterPointer) return

      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      this.raycasterPointer.x = (event.clientX / window.innerWidth) * 2 - 1
      this.raycasterPointer.y = -(event.clientY / window.innerHeight) * 2 + 1
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
    const deltaTime = this.clock.getDelta()

    // Raycaster
    // update the picking ray with the camera and pointer position
    if (this.raycaster && this.raycasterPointer) {
      this.raycaster.setFromCamera(this.raycasterPointer, this.camera)
    }

    // Pass the elapsed time to each tick handler
    this.tickHandlers.forEach((handler) => handler({ elapsedTime, deltaTime }))

    if (this.customPass) this.customPass.uniforms.uTime.value = elapsedTime

    if (ENABLE_ORBIT_CONTROLS && this.controls) this.controls.update()
    if (ENABLE_STATS && this.stats) this.stats.forEach((stat) => stat.update())

    ENABLE_EFFECTS && this.effectComposer
      ? this.effectComposer?.render()
      : this.renderer.render(this.scene, this.camera)
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
  }

  _setControls() {
    if (!this.gui) return

    this.worldGuiFolder = this.gui.addFolder("World")

    const settings: GuiOptions = {
      scrollProgress: 0,
      background: "Light",
      noise: this.uniforms.uNoiseAmount.value,
      // message: "dat.GUI",
      // checkbox: true,
      // colorA: "#FF00B4",
      // colorB: "#22CBFF",
      // step5: 10,
      // range: 50,
      // speed: 0,
      // func: () => {
      //   console.log("lol")
      // },
      // justgooddesign: () => {
      //   console.log("test")
      // },
      // field1: "Field 1",
      // field2: "Field 2",
      // color0: "#ffae23", // CSS string
      // color1: [0, 128, 255], // RGB array
      // color2: [0, 128, 255, 0.3], // RGB with alpha
      // color3: { h: 350, s: 0.9, v: 0.3 }, // Hue, saturation, value
    }

    this.worldGuiFolder
      .add(settings, "background", ["Light", "Dark"])
      .onChange((value) => {
        if (!this.renderer) return

        if (value === "Light") {
          this.renderer.setClearColor(0x1e9e3f1, 1)
        }

        if (value === "Dark") {
          this.renderer.setClearColor(0x1e1726, 1)
        }

        Events.$trigger(EVENT.ENGINE_BACKGROUND, {
          data: {
            background: value,
          },
        })
      })

    this.worldGuiFolder
      .add(settings, "noise", 0, 0.5, 0.0001)
      .onChange((value) => {
        this.uniforms.uNoiseAmount.value = value
        if (this.customPass) {
          this.customPass.uniforms.uNoiseAmount.value = value
        }
      })

    this.worldGuiFolder.open()
  }
}

export const engine = new Engine()
