import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Logo({ mouse, scale }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scale: number }) {
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
      // Smooth follow drag rotation
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.current.y,
        0.1
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        baseRotationX + mouse.current.x,
        0.1
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
        scale={scale}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </Float>
  );
}

function Scene({ mouse, scale }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scale: number }) {
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

      <Logo mouse={mouse} scale={scale} />
      
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
  const rotation = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    isDragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;
    rotation.current.y += deltaX * 0.01;
    rotation.current.x += deltaY * 0.01;
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleEnd();
  const handleMouseLeave = () => handleEnd();

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };
  const handleTouchEnd = () => handleEnd();

  const scale = isMobile ? 0.075 : 0.15;

  return (
    <div
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Scene mouse={rotation} scale={scale} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/logo_studio.glb');
