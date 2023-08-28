import * as THREE from "three"
import { engine } from "../../engine"
import { GUI } from "dat.gui"
import fragmentShader from "./shaders/fragment.glsl"
import vertexShader from "./shaders/vertex.glsl"

const POSITIONS = [
  [-0.5, 0.5, 0],
  [0.5, 0.5, 0],
  [-0.5, -0.5, 0],
  [0.5, -0.5, 0],
]

const EXPAND_FROM_INSIDE = 0.5

export class Cubes {
  geometry: THREE.BoxGeometry
  shaderMaterial: THREE.ShaderMaterial
  mesh: THREE.Mesh
  baseCube: THREE.Mesh
  gui: GUI
  uniforms: { [uniform: string]: THREE.IUniform }
  loader: THREE.TextureLoader
  material: THREE.MeshBasicMaterial
  cubeGroup: THREE.Group
  matcapMaterial: THREE.MeshMatcapMaterial
  guiOptions: {
    [key: string]: number
  }

  constructor() {
    this.gui = new GUI()
    this.geometry = new THREE.BoxGeometry(1, 1, 1)
    this.loader = new THREE.TextureLoader()
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#736D79"),
    })

    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }

    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      wireframe: true,
    })

    this.matcapMaterial = new THREE.MeshMatcapMaterial({
      // matcap: this.loader.load("./textures/test.png"),
    })

    this.baseCube = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 2.1, 2.1),
      this.matcapMaterial
    )

    this.cubeGroup = new THREE.Group()
    this.guiOptions = {
      expand: 0.08,
      baseExpand: 0.1,
      progress: 0,
    }

    this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial)

    this._createCube()

    engine.addTickHandler((elapsedTime: number) => this._tick(elapsedTime))

    this._addGui()
  }

  _tick(elapsedTime: number) {
    this.uniforms.uTime.value = elapsedTime

    this.cubeGroup.children.forEach((side) => {
      side.children.forEach((mesh, index) => {
        mesh.position.z =
          this.guiOptions.baseExpand +
          Math.sin(elapsedTime * mesh.userData.random) *
            this.guiOptions.expand *
            this.guiOptions.progress
      })
    })

    const rotation = 0.002

    this.baseCube.rotation.x += Math.sin(elapsedTime) * rotation
    this.baseCube.rotation.z += Math.sin(elapsedTime) * rotation
    this.mesh.rotation.x += Math.sin(elapsedTime) * rotation
    this.mesh.rotation.z += Math.sin(elapsedTime) * rotation
    this.cubeGroup.rotation.x += Math.sin(elapsedTime) * rotation
    this.cubeGroup.rotation.z += Math.sin(elapsedTime) * rotation
  }

  _createCube() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      this.matcapMaterial
    )

    const createSide = (positions: number[], tag: string) => {
      const mesh = new THREE.Mesh(this.geometry, this.matcapMaterial)
      mesh.position.set(positions[0], positions[1], positions[2])
      mesh.userData.wall = tag
      return mesh
    }

    const createSideGroup = (positions: number[][], tag: string) => {
      const group = new THREE.Group()
      positions.forEach((pos) => group.add(createSide(pos, tag)))
      return group
    }

    // Top side
    const topSideGroup = createSideGroup(POSITIONS, "top")
    topSideGroup.rotation.x = (Math.PI / 2) * -1
    topSideGroup.position.y = EXPAND_FROM_INSIDE
    this.cubeGroup.add(topSideGroup)

    // Bottom side
    const bottomSideGroup = createSideGroup(POSITIONS, "bottom")
    bottomSideGroup.rotation.x = Math.PI / 2
    bottomSideGroup.position.y = -EXPAND_FROM_INSIDE
    this.cubeGroup.add(bottomSideGroup)

    // Left side
    const leftSideGroup = createSideGroup(POSITIONS, "left")
    leftSideGroup.rotation.y = (Math.PI / 2) * -1
    leftSideGroup.position.x = -EXPAND_FROM_INSIDE
    this.cubeGroup.add(leftSideGroup)

    // Right side
    const rightSideGroup = createSideGroup(POSITIONS, "right")
    rightSideGroup.rotation.y = Math.PI / 2
    rightSideGroup.position.x = EXPAND_FROM_INSIDE
    this.cubeGroup.add(rightSideGroup)

    // Front side
    const frontSideGroup = createSideGroup(POSITIONS, "front")
    frontSideGroup.position.z = EXPAND_FROM_INSIDE
    this.cubeGroup.add(frontSideGroup)

    // Back side
    const backSideGroup = createSideGroup(POSITIONS, "back")
    backSideGroup.position.z = -EXPAND_FROM_INSIDE
    backSideGroup.rotation.y = Math.PI
    this.cubeGroup.add(backSideGroup)

    this.cubeGroup.children.forEach((side) => {
      side.children.forEach((mesh) => {
        mesh.userData.random = Math.random() + 1
      })
    })

    this.cubeGroup.scale.set(0, 0, 0)
    this.mesh.scale.set(0, 0, 0)
  }

  // Public
  setModel() {
    if (!engine.scene) return

    engine.scene.add(this.cubeGroup)
    engine.scene.add(this.mesh)
    engine.scene.add(this.baseCube)
  }

  _addGui() {
    const cubeFolder = this.gui.addFolder("Mesh")
    cubeFolder
      .add(this.guiOptions, "progress", 0, 1)
      .step(0.0001)
      .name("Progress")
      .onChange((value) => {
        this.baseCube.scale.set(
          1 - 0.2 * value,
          1 - 0.2 * value,
          1 - 0.2 * value
        )
        this.cubeGroup.scale.set(
          0.8 + 0.2 * value,
          0.8 + 0.2 * value,
          0.8 + 0.2 * value
        )
      })

    cubeFolder
      .add(this.guiOptions, "expand", 0)
      .min(0)
      .max(1)
      .step(0.001)
      .name("Expand")

    cubeFolder
      .add(this.guiOptions, "baseExpand", 0)
      .min(0)
      .max(1)
      .step(0.001)
      .name("Base expand")

    cubeFolder.open()
  }
}
