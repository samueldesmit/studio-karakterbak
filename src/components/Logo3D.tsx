import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../ThemeContext';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        color: '#333',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid #eee',
          borderTopColor: '#333',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '14px' }}>{progress.toFixed(0)}%</span>
      </div>
    </Html>
  );
}

interface PhysicsState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  rotation: { x: number; y: number };
  spinVelocity: { x: number; y: number };
}

function Logo({ physics, scale }: { physics: React.MutableRefObject<PhysicsState>; scale: number }) {
  const { theme } = useTheme();
  const glbPath = theme === 'dark' ? '/fnish wit Untitled.glb' : '/logo_studio.glb';
  const { scene } = useGLTF(glbPath, true);
  const meshRef = useRef<THREE.Group>(null);

  const baseRotationX = Math.PI / 2;

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
      meshRef.current.position.x = physics.current.position.x;
      meshRef.current.position.y = physics.current.position.y + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = physics.current.rotation.y;
      meshRef.current.rotation.x = baseRotationX + physics.current.rotation.x;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={scale}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}

function Scene({ physics, scale }: { physics: React.MutableRefObject<PhysicsState>; scale: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
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
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, -5, 5]} intensity={0.6} color="#fff5e6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
      />
      <Logo physics={physics} scale={scale} />
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
  const physics = useRef<PhysicsState>({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    rotation: { x: 0, y: 0 },
    spinVelocity: { x: 0, y: 0 },
  });
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const isDragging = useRef(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const bounds = { x: 8, y: 5 };
  const MAX_SPEED = 0.08;
  const MAX_SPIN = 0.03;
  const FRICTION = 0.995;

  const clamp = (val: number, max: number) => Math.max(-max, Math.min(max, val));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Physics loop
  useEffect(() => {
    let animationId: number;

    const updatePhysics = () => {
      if (!isDragging.current) {
        const p = physics.current;

        // Clamp velocities
        p.velocity.x = clamp(p.velocity.x, MAX_SPEED);
        p.velocity.y = clamp(p.velocity.y, MAX_SPEED);
        p.spinVelocity.x = clamp(p.spinVelocity.x, MAX_SPIN);
        p.spinVelocity.y = clamp(p.spinVelocity.y, MAX_SPIN);

        // Apply velocity to position
        p.position.x += p.velocity.x;
        p.position.y += p.velocity.y;

        // Apply spin velocity to rotation
        p.rotation.x += p.spinVelocity.x;
        p.rotation.y += p.spinVelocity.y;

        // Gentle friction
        p.velocity.x *= FRICTION;
        p.velocity.y *= FRICTION;
        p.spinVelocity.x *= FRICTION;
        p.spinVelocity.y *= FRICTION;

        // Bounce off walls
        if (p.position.x > bounds.x) {
          p.position.x = bounds.x;
          p.velocity.x *= -1;
          p.spinVelocity.y += p.velocity.x * 0.3;
        } else if (p.position.x < -bounds.x) {
          p.position.x = -bounds.x;
          p.velocity.x *= -1;
          p.spinVelocity.y += p.velocity.x * 0.3;
        }

        if (p.position.y > bounds.y) {
          p.position.y = bounds.y;
          p.velocity.y *= -1;
          p.spinVelocity.x += p.velocity.y * 0.3;
        } else if (p.position.y < -bounds.y) {
          p.position.y = -bounds.y;
          p.velocity.y *= -1;
          p.spinVelocity.x += p.velocity.y * 0.3;
        }
      }

      animationId = requestAnimationFrame(updatePhysics);
    };

    animationId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    isDragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
    lastTime.current = Date.now();
    physics.current.velocity = { x: 0, y: 0 };
    physics.current.spinVelocity = { x: 0, y: 0 };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;

    const now = Date.now();
    const dt = Math.max(now - lastTime.current, 1);
    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;

    // Move position
    const worldDelta = {
      x: (deltaX / window.innerWidth) * bounds.x * 2,
      y: -(deltaY / window.innerHeight) * bounds.y * 2,
    };
    physics.current.position.x += worldDelta.x;
    physics.current.position.y += worldDelta.y;

    // Track velocity for throwing (clamped to max speed)
    physics.current.velocity.x = clamp(worldDelta.x * (5 / dt), MAX_SPEED);
    physics.current.velocity.y = clamp(worldDelta.y * (5 / dt), MAX_SPEED);

    // Add spin based on movement (clamped)
    physics.current.spinVelocity.x = clamp(deltaY * 0.002, MAX_SPIN);
    physics.current.spinVelocity.y = clamp(deltaX * 0.002, MAX_SPIN);

    lastPos.current = { x: clientX, y: clientY };
    lastTime.current = now;
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

  const scale = isMobile ? 7.5 : 15;

  return (
    <div
      style={{ width: '100%', height: '100%', cursor: 'grab', position: 'relative', zIndex: 3 }}
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
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <Suspense fallback={<Loader />}>
          <Scene physics={physics} scale={scale} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/logo_studio.glb', true);
useGLTF.preload('/fnish wit Untitled.glb', true);
