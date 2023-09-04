import * as THREE from "three"
import { engine } from "../../engine"
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js"
import fragmentShader from "./_fragment.glsl"
import vertexShader from "./_vertex.glsl"
import gsap from "gsap"

const ANIMATION_NAME = "animation_0"
const TEXTURE_PATH = "./images/matcap_1.png"

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
  uniforms: { [uniform: string]: THREE.IUniform }
  mousedown = false
  mouseDownTime = 0
  isIntroAnimationDone = false

  constructor() {
    this.loader = new GLTFLoader()

    this.material = new THREE.MeshBasicMaterial({
      color: "blue",
      wireframe: true,
    })
    this.textureLoader = new THREE.TextureLoader()

    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouseDown: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uRotationY: { value: 0 },
      uTexture: { value: null },
    }

    this._bindEvents()

    Promise.all([
      new Promise<THREE.Texture>((resolve, reject) => {
        this.textureLoader.load(
          TEXTURE_PATH,
          (texture) => resolve(texture),
          undefined,
          (error) => reject(error)
        )
      }),
      new Promise<GLTF>((resolve, reject) => {
        this.loader.load(
          "./models/cone-bricks.gltf",
          (model) => resolve(model),
          undefined,
          (error) => reject(error)
        )
      }),
    ])
      .then(([texture, model]) => {
        this._addModel(model, texture)
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
      this.mousedown = true
    })

    window.addEventListener("mouseup", () => {
      this.mousedown = false
    })
  }

  _createLights() {
    if (!engine.scene) return

    this.directionalLight = new THREE.DirectionalLight(0xffffff)
    this.ambientLight = new THREE.AmbientLight(0x404040)

    // this.ambientLight.intensity = 10

    this.directionalLight.position.set(3, 3, 0)
    engine.scene.add(this.directionalLight)
    engine.scene.add(this.ambientLight)
  }

  _addModel(
    mesh: GLTF,
    texture: THREE.Texture,
    isShaderMaterial = true,
    position = { x: 0, y: 0, z: 0 }
  ) {
    if (!engine.scene) return

    this.uniforms.uTexture = { value: texture }

    let material: THREE.Material | THREE.ShaderMaterial

    if (isShaderMaterial) {
      material = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: this.uniforms,
      })
    }

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

    const timeline = gsap.timeline({
      onComplete: () => {
        this.isIntroAnimationDone = true
      },
    })

    timeline.from(
      this.scene.scale,
      {
        duration: 1.3,
        ease: "elastic.out(1, 0.9)",
        x: 0,
        y: 0,
        z: 0,
      },
      "0.3"
    )

    engine.scene.add(this.scene)
  }

  _introAnimation() {}

  _tick({ elapsedTime, deltaTime }: tickHandler) {
    if (!this.mixer) return

    const progress = (Math.sin(elapsedTime) + 1) * 0.5
    this.uniforms.uTime.value = elapsedTime
    this.uniforms.uProgress.value = progress

    if (this.mousedown) {
      this.mouseDownTime = Math.min(this.mouseDownTime + 0.01, 1)
    } else {
      this.mouseDownTime = Math.max(0, this.mouseDownTime - 0.01)
    }

    this.uniforms.uMouseDown.value += this.mouseDownTime

    const currentMixertime = this.totalDuration * this.mouseMoveProgressX
    // this.directionalLight?.position.set(
    //   this.mouseMoveProgressX * 10,
    //   this.mouseMoveProgressY * 10,
    //   3
    // )

    this.uniforms.uMouseX.value = this.mouseMoveProgressX
    this.uniforms.uMouseY.value = this.mouseMoveProgressY

    if (this.scene) {
      this.scene.rotation.set(
        0.1 + Math.cos(elapsedTime / 4.5) / 10,
        Math.sin(elapsedTime / 4) / 4 + elapsedTime * 0.2,
        0.3 - (1 + Math.sin(elapsedTime / 4)) / 8
      )

      this.uniforms.uRotationY.value = this.scene.rotation.y

      this.scene.position.y = (1 + Math.sin(elapsedTime / 2)) / 10
    }

    // if (this.ambientLight)
    //   this.ambientLight.intensity =
    //     0.5 + this.mouseMoveProgressY * this.mouseMoveProgressX * 3

    this.mixer.setTime(currentMixertime)
    this.mixer.update(deltaTime)
  }

  // Public
  setModel() {
    if (!engine.scene) return

    // engine.scene.add(this.mesh)
  }
}
