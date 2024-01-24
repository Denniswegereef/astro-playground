import * as THREE from "three"
import { useRef, useState } from "react"
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber"

interface GreetingProps {
  messages: string[]
}

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

export default function Greeting({ messages }: GreetingProps) {
  console.log({ messages })
  const randomMessage = () =>
    messages[Math.floor(Math.random() * messages.length)]

  const [greeting, setGreeting] = useState(messages[0])

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100lvh",
      }}
    >
      {/* <h3
        style={{
          backgroundColor: "lightblue",
        }}
      >
        {greeting}! Thank you for visiting!
      </h3>
      <button onClick={() => setGreeting(randomMessage())}>New Greeting</button> */}

      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  )
}
