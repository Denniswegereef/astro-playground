import * as THREE from "three"
import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber"
import { ModelOne } from "./vacuum-model-one"
import { ModelTwo } from "./vacuum-model-two"
import { OrbitControls } from "@react-three/drei"

interface GreetingProps {}

function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  )
}

export const ModelScrollTest = ({}: GreetingProps) => {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100lvh",
      }}
    >
      <Canvas>
        <OrbitControls />
        <Suspense>
          <ModelOne position={[2, -5, -1]} />
          <ModelTwo position={[-2, -5, -1]} scale={[0.65, 0.65, 0.65]} />
        </Suspense>
        <ambientLight intensity={Math.PI * 2} />
        <spotLight
          position={[0, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
        {/* <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} /> */}
      </Canvas>
    </div>
  )
}
