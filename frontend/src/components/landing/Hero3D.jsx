import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  MessageSquare,
  Code2,
  FileText,
  Presentation,
  ImageIcon,
  Globe
} from 'lucide-react';

const AGENTS = [
  { name: 'Chat', icon: MessageSquare, color: '#6366f1', angle: 0, distance: 2.8 },
  { name: 'Coding', icon: Code2, color: '#22d3ee', angle: (Math.PI / 3) * 1, distance: 3.1 },
  { name: 'PDF', icon: FileText, color: '#f43f5e', angle: (Math.PI / 3) * 2, distance: 2.7 },
  { name: 'PPT', icon: Presentation, color: '#f59e0b', angle: (Math.PI / 3) * 3, distance: 3.0 },
  { name: 'Vision', icon: ImageIcon, color: '#10b981', angle: (Math.PI / 3) * 4, distance: 2.9 },
  { name: 'Search', icon: Globe, color: '#a855f7', angle: (Math.PI / 3) * 5, distance: 3.2 }
];

function CentralCore() {
  const meshRef = useRef();
  const wireframeRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.25;
      wireframeRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group>
      {/* Inner Glowing Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Outer Wireframe Shell */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

function OrbitingNodes() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {AGENTS.map((agent) => {
        const x = Math.cos(agent.angle) * agent.distance;
        const z = Math.sin(agent.angle) * agent.distance;
        const y = Math.sin(agent.angle * 2) * 0.4;
        const Icon = agent.icon;

        return (
          <group key={agent.name} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial
                color={agent.color}
                emissive={agent.color}
                emissiveIntensity={0.8}
              />
            </mesh>
            <Html center distanceFactor={8} position={[0, 0.45, 0]}>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white whitespace-nowrap shadow-lg select-none backdrop-blur-md border pointer-events-none"
                style={{
                  backgroundColor: `${agent.color}25`,
                  borderColor: `${agent.color}50`
                }}
              >
                <Icon size={11} style={{ color: agent.color }} />
                <span>{agent.name}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

const PARTICLE_COORDS = (() => {
  const coords = [];
  for (let i = 0; i < 180; i++) {
    // Deterministic pseudo-random distribution
    const seed1 = (i * 12.9898) % 1;
    const seed2 = (i * 78.233) % 1;
    const radius = 2.0 + seed1 * 2.5;
    const theta = seed2 * Math.PI * 2;
    const phi = Math.acos(2 * ((seed1 + seed2) % 1) - 1);
    coords.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
  }
  return new Float32Array(coords);
})();

function ParticleField() {
  const points = PARTICLE_COORDS;

  const pointsRef = useRef();

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#818cf8"
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[520px] relative select-none">
      <Canvas
        camera={{ position: [0, 1.2, 5.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#06b6d4" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <CentralCore />
          <OrbitingNodes />
          <ParticleField />
        </Float>
      </Canvas>
    </div>
  );
}
