import * as THREE from "three"

import { ENABLE_GUI, EVENT } from "../../settings"
import { engine } from "../../engine"
import Events from "@/utilities/events"
import { calculateScrollProgress } from "../../scroll-container"

import gsap from "gsap"
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js"
import { clamp } from "three/src/math/MathUtils.js"

const MATCAP_TEXTURE_LIGHT = "./assets/matcap_5.png"
const MATCAP_TEXTURE_BLACK = "./assets/matcap_12.png"

const ANIMATION_NAME = "animation_0"

export class ConeModel {
  textureLoader: THREE.TextureLoader
  loader: GLTFLoader

  meshObjects: THREE.Mesh[] = []

  // Base
  mesh: THREE.Group | null = null
  material: THREE.MeshMatcapMaterial | null = null
  mixer: THREE.AnimationMixer | null = null

  totalAnimationDuration: number = 0
  currentMixertime: { value: number } = { value: 0 }

  textureLight: THREE.Texture | null = null
  textureDark: THREE.Texture | null = null

  model: GLTF | null = null

  isIntersecting: boolean = false
  intersectingAnimation: gsap.core.Timeline | null = null

  isFinishedIntroAnimation: boolean = false

  uniforms: Uniforms

  constructor() {
    // Options
    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uBaseColor: { value: new THREE.Color(0xffffff) },
      uScrollProgress: { value: calculateScrollProgress() },
    }

    this.textureLoader = new THREE.TextureLoader()
    this.loader = new GLTFLoader()

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
      new Promise<GLTF>((resolve, reject) => {
        this.loader.load(
          "./models/cone-bricks.gltf",
          (model) => resolve(model),
          undefined,
          (error) => reject(error)
        )
      }),
    ])
      .then(([textureLight, textureDark, model]) => {
        this.textureLight = textureLight
        this.textureDark = textureDark
        this.model = model

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
    if (!this.model || !engine.scene) return

    this.mesh = this.model.scene

    // Animation mixer things
    this.mixer = new THREE.AnimationMixer(this.mesh)
    const clips = this.model.animations
    const clip = THREE.AnimationClip.findByName(clips, ANIMATION_NAME)
    const action = this.mixer.clipAction(clip)
    action.enabled = true

    this.totalAnimationDuration = action.getClip().duration - 0.01

    // Material
    this.material = new THREE.MeshMatcapMaterial({
      matcap: this.textureLight,
    })

    // Set the materials to all the meshes
    this.mesh.traverse((o) => {
      const obj = o as THREE.Mesh
      if (!this.material) return

      // Create an array to store all mesh objects inside the model for the raycast later
      if (obj instanceof THREE.Mesh) {
        this.meshObjects.push(obj)
      }

      obj.material = this.material
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

    action.play()

    engine.scene.add(this.mesh)

    gsap.from(this.mesh.scale, {
      duration: 1.3,
      delay: 0.3,
      ease: "elastic.out(1, 0.9)",
      x: 0,
      y: 0,
      z: 0,
      onComplete: () => {
        this.isFinishedIntroAnimation = true
      },
    })

    if (ENABLE_GUI) this._createControls()
  }

  _onScrollHandler(scrollProgress: number) {
    this.uniforms.uScrollProgress.value = clamp(scrollProgress, 0, 0.99)
  }

  _onTickHandler({ elapsedTime, deltaTime }: tickHandler) {
    if (!this.mesh || !engine.raycaster || !engine.scene || !this.mixer) return

    this.uniforms.uTime.value = elapsedTime

    // Create some floating

    // Update mesh.rotation only when not intersecting.
    this.mesh.rotation.set(
      0.1 + Math.cos(elapsedTime / 4.5) / 10,
      Math.sin(elapsedTime / 4) / 4 + elapsedTime * 0.2,
      0.3 - (1 + Math.sin(elapsedTime / 4)) / 8
    )

    this.mesh.position.y = (1 + Math.sin(elapsedTime / 2)) / 10

    this.mixer.setTime(this.currentMixertime.value)
    this.mixer.update(deltaTime)

    // calculate objects intersecting the picking ray
    const intersects = engine.raycaster.intersectObjects(this.meshObjects)

    const isIntersected = intersects.length > 0 && this.isFinishedIntroAnimation

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

    this.intersectingAnimation = gsap
      .timeline()
      .to(
        this.mesh.scale,
        {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 2,
        },
        "0"
      )
      .to(
        this.currentMixertime,
        {
          value: this.totalAnimationDuration,
          duration: 3,
          ease: "expo.out",
        },
        "0"
      )
      .eventCallback("onComplete", () => {
        this.intersectingAnimation = null
      })
  }

  _onIntersectionCleared() {
    if (!this.mesh) return

    if (this.intersectingAnimation) {
      this.intersectingAnimation.pause()

      gsap.to(this.mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
      })

      gsap.to(this.currentMixertime, {
        value: 0,
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
