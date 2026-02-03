import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Logo() {
  const { scene } = useGLTF('/logo_studio.glb');
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle back and forth rotation on z-axis
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={0.12}
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    />
  );
}

export default function Logo3DSmall() {
  return (
    <div style={{ width: '120px', height: '120px' }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Logo />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
