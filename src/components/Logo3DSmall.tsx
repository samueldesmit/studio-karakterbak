import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function useTheme() {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function Logo() {
  const theme = useTheme();
  const glbPath = theme === 'dark' ? '/fnish wit Untitled.glb' : '/logo_studio.glb';
  const { scene } = useGLTF(glbPath, true);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={12}
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
