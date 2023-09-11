import * as THREE from "three"

import fragmentShader from "./_fragment.glsl"
import vertexShader from "./_vertex.glsl"

import { ENABLE_GUI } from "../../settings"
import { engine } from "../../engine"
import Events from "@/utilities/events"
import { EVENT } from "../../event-triggers"

const MATCAP_TEXTURE_LIGHT = "./assets/matcap_8.png"
const MATCAP_TEXTURE_BLACK = "./assets/matcap_7.png"

export class CubeModel {
  textureLoader: THREE.TextureLoader
  // Base
  mesh: THREE.Mesh | null = null
  material: THREE.MeshMatcapMaterial | null = null

  textureLight: THREE.Texture | null = null
  textureDark: THREE.Texture | null = null

  uniforms: Uniforms

  constructor() {
    // Options
    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }

    this.textureLoader = new THREE.TextureLoader()

    Promise.all([
      new Promise<THREE.Texture>((resolve, reject) => {
        this.textureLoader.load(
          MATCAP_TEXTURE_LIGHT,
          (texture) => resolve(texture),
          undefined,
          (error) => reject(error)
        )
      }),
      new Promise<THREE.Texture>((resolve, reject) => {
        this.textureLoader.load(
          MATCAP_TEXTURE_BLACK,
          (texture) => resolve(texture),
          undefined,
          (error) => reject(error)
        )
      }),
    ])
      .then(([textureLight, textureDark]) => {
        this.textureLight = textureLight
        this.textureDark = textureDark

        this._createMesh()
        this._bindEvents()
      })
      .catch((error) => {
        console.log("Error loading assets:", error)
      })

    // Start tick handler
    engine.addTickHandler((args: tickHandler) => this._onTickHandler(args))
  }

  _bindEvents() {
    // Bind events
    Events.$on(EVENT.ENGINE_BACKGROUND, (_, data: { background: string }) => {
      if (!this.material) return

      if (data.background === "Light") {
        this.material.matcap = this.textureLight
      }

      if (data.background === "Dark") {
        this.material.matcap = this.textureDark
      }
    })
  }

  _createMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshMatcapMaterial({
      matcap: this.textureLight,
    })

    this.mesh = new THREE.Mesh(geometry, this.material)

    if (engine.scene) engine.scene.add(this.mesh)
    if (ENABLE_GUI) this._createControls()
  }

  _onTickHandler({ elapsedTime, deltaTime }: tickHandler) {
    if (!this.mesh) return

    this.uniforms.uTime.value = elapsedTime

    // Create some floating
    this.mesh.rotation.set(
      0.1 + Math.cos(elapsedTime / 4.5) / 10,
      Math.sin(elapsedTime / 4) / 4 + elapsedTime * 0.2,
      0.3 - (1 + Math.sin(elapsedTime / 4)) / 8
    )

    this.mesh.position.y = (1 + Math.sin(elapsedTime / 2)) / 10
  }

  _createControls() {
    if (!engine.gui) return

    const guiOptions: GuiOptions = {
      progress: 0,
    }

    const guiFolder = engine.gui.addFolder("Mesh")

    guiFolder
      .add(guiOptions, "progress", 0, 1)
      .step(0.0001)
      .name("Progress")
      .onChange((value) => {
        this.uniforms.uProgress.value = value
      })

    guiFolder.open()
  }
}
