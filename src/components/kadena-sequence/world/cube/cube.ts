import * as THREE from "three"

// import fragmentShader from "./_fragment.glsl"
// import vertexShader from "./_vertex.glsl"

import { ENABLE_GUI, EVENT } from "../../settings"
import { engine } from "../../engine"
import Events from "@/utilities/events"
import { calculateScrollProgress } from "../../scroll-container"

import gsap from "gsap"

const MATCAP_TEXTURE_LIGHT = "./assets/matcap_8.png"
const MATCAP_TEXTURE_BLACK = "./assets/matcap_7.png"

export class CubeModel {
  textureLoader: THREE.TextureLoader
  // Base
  mesh: THREE.Mesh | null = null
  material: THREE.MeshMatcapMaterial | null = null

  textureLight: THREE.Texture | null = null
  textureDark: THREE.Texture | null = null

  isIntersecting: boolean = false
  intersectingAnimation: gsap.core.Tween | null = null

  uniforms: Uniforms

  constructor() {
    // Options
    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uBaseColor: { value: new THREE.Color(0x000000) },
      uScrollProgress: { value: calculateScrollProgress() },
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
        this.uniforms.uBaseColor.value = new THREE.Color(0xffffff)
      }

      if (data.background === "Dark") {
        this.material.matcap = this.textureDark
        this.uniforms.uBaseColor.value = new THREE.Color(0x000000)
      }
    })

    Events.$on(EVENT.WORLD_SCROLL, (_, data: { scrollProgress: number }) => {
      this._onScrollHandler(data.scrollProgress)
    })
  }

  _createMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshMatcapMaterial({
      matcap: this.textureLight,
    })

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.uniforms.uTime
      shader.uniforms.uScrollProgress = this.uniforms.uScrollProgress
      shader.uniforms.uBaseColor = this.uniforms.uBaseColor

      shader.fragmentShader = shader.fragmentShader.replace(
        /*glsl*/ `#include <common>`,
        /*glsl*/ `
        #include <common>
        uniform float uTime;
        uniform float uScrollProgress;
        uniform vec3 uBaseColor;
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        /*glsl*/ `vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;`,
        /*glsl*/ `
        vec3 outgoingMatcap = diffuseColor.rgb * matcapColor.rgb;
        vec3 outgoingLight = mix(uBaseColor, outgoingMatcap, uScrollProgress);
        `
      )
    }

    this.mesh = new THREE.Mesh(geometry, this.material)

    if (engine.scene) engine.scene.add(this.mesh)
    if (ENABLE_GUI) this._createControls()
  }

  _onScrollHandler(scrollProgress: number) {
    this.uniforms.uScrollProgress.value = scrollProgress
  }

  _onTickHandler({ elapsedTime, deltaTime }: tickHandler) {
    if (!this.mesh || !engine.raycaster || !engine.scene) return

    this.uniforms.uTime.value = elapsedTime

    // Create some floating
    this.mesh.rotation.set(
      0.1 + Math.cos(elapsedTime / 4.5) / 10,
      Math.sin(elapsedTime / 4) / 4 + elapsedTime * 0.2,
      0.3 - (1 + Math.sin(elapsedTime / 4)) / 8
    )

    this.mesh.position.y = (1 + Math.sin(elapsedTime / 2)) / 10

    // calculate objects intersecting the picking ray
    const intersects = engine.raycaster.intersectObjects(engine.scene.children)

    const isIntersected =
      intersects.length > 0 && intersects[0].object === this.mesh

    // Switch to enable and disable interaction and run a gsap clip
    if (isIntersected && !this.isIntersecting) {
      this.isIntersecting = true

      this._onIntersectionDetected()
    } else if (!isIntersected && this.isIntersecting) {
      this.isIntersecting = false

      this._onIntersectionCleared()
    }
  }

  _onIntersectionDetected() {
    if (!this.mesh) return

    this.intersectingAnimation = gsap.to(this.mesh.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 0.3,
      onComplete: () => {
        this.intersectingAnimation = null
      },
    })
  }

  _onIntersectionCleared() {
    if (!this.mesh) return

    if (this.intersectingAnimation) {
      this.intersectingAnimation.reverse()
    } else {
      gsap.to(this.mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
      })
    }
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
