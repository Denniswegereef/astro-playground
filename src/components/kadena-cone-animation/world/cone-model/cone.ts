import * as THREE from "three"
import { engine } from "../../engine"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { gsap } from "gsap"

export class ConeModel {
  material: THREE.MeshBasicMaterial
  loader: GLTFLoader
  mesh: THREE.Mesh | null
  scene: THREE.Group | null
  textureLoader: THREE.TextureLoader
  matcapMaterial: THREE.MeshMatcapMaterial

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

    Promise.all([
      new Promise<THREE.Texture>((resolve, reject) => {
        this.textureLoader.load(
          "./images/326666_66CBC9_C0B8AE_52B3B4-256px.png",
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

  _addModel(gltf: GLTF) {
    if (!engine.scene) return

    this.scene = gltf.scene

    this.scene.traverse((o) => {
      const obj = o as THREE.Mesh
      obj.material = this.matcapMaterial
    })

    const groups = this.scene.children[0].children

    groups.forEach((group) => {
      const groupObj = group as THREE.Group

      groupObj.children.forEach((mesh, index2) => {
        const meshObj = mesh as THREE.Mesh

        const initialPosition = meshObj.position.clone()
        const initialRotation = meshObj.rotation.clone()

        const animationObject = { progress: 0 }

        gsap.to(animationObject, {
          progress: 1,
          duration: 3,
          repeatDelay: 1,
          delay: 2,
          repeat: -1,
          yoyo: true,
          onUpdate: () => {
            const { progress } = animationObject

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
              THREE.MathUtils.lerp(initialPosition.x, index2 * 1, progress),
              THREE.MathUtils.lerp(initialPosition.y, index2 * 1, progress),
              THREE.MathUtils.lerp(initialPosition.z, index2 * 1, progress)
            )
          },
        })
      })
    })

    engine.scene.add(this.scene)
  }

  _tick(elapsedTime: number) {
    if (!this.scene) return
  }

  // Public
  setModel() {
    if (!engine.scene) return

    // engine.scene.add(this.mesh)
  }
}
