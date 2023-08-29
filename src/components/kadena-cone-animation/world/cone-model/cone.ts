import * as THREE from "three"
import { engine } from "../../engine"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { gsap } from "gsap"
import VirtualScroll from "virtual-scroll"
import { clamp } from "three/src/math/MathUtils"

const MATCAP_TEXTURE = "./images/matcap_1.png"

export class ConeModel {
  material: THREE.MeshBasicMaterial
  loader: GLTFLoader
  mesh: THREE.Mesh | null
  scene: THREE.Group | null
  textureLoader: THREE.TextureLoader
  matcapMaterial: THREE.MeshMatcapMaterial
  scrollProgress: number = 0
  increasing: boolean = true
  groups: THREE.Group[] | null = null

  constructor() {
    this.loader = new GLTFLoader()

    this.material = new THREE.MeshBasicMaterial({
      color: "blue",
      wireframe: true,
    })
    this.mesh = null
    this.scene = null
    this.textureLoader = new THREE.TextureLoader()
    this.matcapMaterial = new THREE.MeshMatcapMaterial()

    // this.scrollContainerElement = document.querySelector<HTMLElement>(
    //   "[data-scroll-container-element]"
    // ) as HTMLElement

    this._createScrollContainer()

    Promise.all([
      new Promise<THREE.Texture>((resolve, reject) => {
        this.textureLoader.load(
          MATCAP_TEXTURE,
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
        this.matcapMaterial.matcap = texture

        this._addModel(model)

        // Start the tick handler
        engine.addTickHandler((elapsedTime: number) => this._tick(elapsedTime))
      })
      .catch((error) => {
        console.log("Error loading assets:", error)
      })
  }

  _createScrollContainer() {
    const scroller = new VirtualScroll({})
    scroller.on((event) => {
      this.scrollProgress = clamp(event.y * -0.00001, 0, 1)

      console.log(this.scrollProgress)
    })
  }

  _addModel(gltf: GLTF) {
    if (!engine.scene) return

    this.scene = gltf.scene

    this.scene.traverse((o) => {
      const obj = o as THREE.Mesh
      obj.material = this.matcapMaterial
    })

    this.groups = this.scene.children[0].children as unknown as THREE.Group[]

    engine.scene.add(this.scene)
  }

  _tick(elapsedTime: number) {
    if (!this.scene || !this.groups) return

    this.groups.forEach((group) => {
      const groupObj = group as THREE.Group

      groupObj.children.forEach((mesh, index2) => {
        const meshObj = mesh as THREE.Mesh

        const initialPosition = meshObj.position.clone()
        const initialRotation = meshObj.rotation.clone()

        const progress = this.scrollProgress

        meshObj.rotation.x = THREE.MathUtils.lerp(
          initialRotation.x,
          Math.PI * 2,
          progress
        )
        meshObj.rotation.y = THREE.MathUtils.lerp(
          initialRotation.y,
          Math.PI * 2,
          progress
        )

        meshObj.position.set(
          THREE.MathUtils.lerp(initialPosition.x, index2 * 5, progress),
          THREE.MathUtils.lerp(initialPosition.y, index2 * 5, progress),
          THREE.MathUtils.lerp(initialPosition.z, index2 * 5, progress)
        )
      })
    })
  }

  // Public
  setModel() {
    if (!engine.scene) return

    // engine.scene.add(this.mesh)
  }
}
