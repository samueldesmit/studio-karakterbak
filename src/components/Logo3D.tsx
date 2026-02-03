import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Logo({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF('/logo_studio.glb');
  const meshRef = useRef<THREE.Group>(null);

  const baseRotationX = Math.PI / 2;

  // Enable shadows on the model
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth follow mouse (add to base rotation)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.current.x * 0.3,
        0.05
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        baseRotationX + mouse.current.y * 0.2,
        0.05
      );

      // Gentle back and forth rotation on z-axis
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;

      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <primitive
        ref={meshRef}
        object={scene}
        scale={0.15}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </Float>
  );
}

function Scene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light with shadows */}
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from the opposite side */}
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      
      {/* Rim light for edge highlights */}
      <pointLight position={[0, -5, 5]} intensity={0.6} color="#fff5e6" />
      
      {/* Spot light for dramatic effect */}
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.8}
        castShadow
      />

      <Logo mouse={mouse} />
      
      {/* Contact shadows beneath the logo */}
      <ContactShadows
        position={[0, -5, 0]}
        opacity={0.6}
        scale={25}
        blur={1}
        far={6}
        color="#000000"
      />

      <Environment preset="city" />
    </>
  );
}

export default function Logo3D() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/logo_studio.glb');
